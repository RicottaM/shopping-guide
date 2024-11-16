// src/hooks/useBluetoothService.ts

import { useState, useEffect, useRef } from 'react';
import { Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import positionService from '../services/PositionService';
import bleManager from '../BleManagerInstance'; // Import singletons
import { ScannedDevice } from '../types/ScannedDevice';
import { useGetAppData } from './useGetAppData';
import { BleDevice } from '../models/bleDevice.model';

export function useBluetoothService() {
  const [devices, setDevices] = useState<ScannedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [macToNameMapping, setMacToNameMapping] = useState<{ [key: string]: number }>({});
  const [bleDevices, setBleDevices] = useState<BleDevice[]>();

  const deviceSetRef = useRef<Set<string>>(new Set());
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const macToNameMappingRef = useRef<{ [key: string]: number }>({});

  const getAppData = useGetAppData();

  // Kalman filter variables
  const rssiMeasurementsRef = useRef<{ [key: string]: number[] }>({});
  const kalmanStateRef = useRef<{ [key: string]: number }>({});
  const kalmanCovarianceRef = useRef<{ [key: string]: number }>({});
  const processNoise = 0.008; // process noise covariance
  const measurementNoise = 1; // measurement noise covariance

  useEffect(() => {
    const fetchBleDevices = async () => {
      try {
        const storeId = await getAppData('selectedStoreId');
        const bleDevicesResponse = await fetch(`http://172.20.10.7:3000/ble_devices/${storeId}`);
        const bleDevicesData = await bleDevicesResponse.json();

        setBleDevices(bleDevicesData);
      } catch (error) {
        if (error instanceof Error) {
          console.error('An error occurred while getting BLE devices: ', error.message);
        } else {
          console.error('An error occurred while getting BLE devices.');
        }
      }
    };

    fetchBleDevices();
  }, []);

  useEffect(() => {
    if (bleDevices) {
      const mapping: { [key: string]: number } = {};

      bleDevices.forEach((device) => {
        // Convert MAC addresses to uppercase to match with scanned devices
        mapping[device.mac.toUpperCase()] = device.section_id;
      });

      setMacToNameMapping(mapping);
      macToNameMappingRef.current = mapping; // Update the ref
    }
  }, [bleDevices]);

  const scanDevices = async () => {
    if (isScanning) {
      bleManager.stopDeviceScan();
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      setIsScanning(false);
    } else {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }

      setDevices([]);
      deviceSetRef.current.clear();

      bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.error('Device scan error:', error);
          return;
        }

        if (scannedDevice && scannedDevice.name === 'HMSoft') {
          // For Android, scannedDevice.id may not be the MAC address
          // Use scannedDevice.address if available, or adjust as needed
          const macAddress = scannedDevice.id.toUpperCase(); // Adjust identifier as necessary

          if (!deviceSetRef.current.has(macAddress)) {
            deviceSetRef.current.add(macAddress);
            setDevices((prevDevices) => [
              ...prevDevices,
              {
                device: scannedDevice,
                filteredRssi: scannedDevice.rssi ?? 0,
                id: macAddress,
              },
            ]);
          } else {
            setDevices((prevDevices) =>
              prevDevices.map((scanned) =>
                scanned.id === macAddress
                  ? {
                    ...scanned,
                    filteredRssi: scannedDevice.rssi ?? scanned.filteredRssi,
                  }
                  : scanned
              )
            );
          }

          if (scannedDevice.rssi !== null) {
            applyKalmanFilter(macAddress, scannedDevice.rssi);
          }
        }
      });

      scanIntervalRef.current = setInterval(() => {
        setDevices((prevDevices) => {
          const sortedDevices = [...prevDevices].sort((a, b) => {
            return (b.filteredRssi ?? 0) - (a.filteredRssi ?? 0);
          });

          if (sortedDevices.length >= 1) {
            const topDevice = sortedDevices[0];
            const macAddress = topDevice.id;

            if (macToNameMappingRef.current) {
              const mappedName = macToNameMappingRef.current[macAddress];

              if (mappedName !== undefined) {
                positionService.updateLocation(mappedName);
              }
            }
          }

          return sortedDevices;
        });
      }, 500);

      setIsScanning(true);
    }
  };

  const applyKalmanFilter = (identifier: string, rssi: number) => {
    if (kalmanStateRef.current[identifier] === undefined) {
      // Initialize Kalman filter state and covariance if not already present
      kalmanStateRef.current[identifier] = rssi;
      kalmanCovarianceRef.current[identifier] = 1;
      rssiMeasurementsRef.current[identifier] = [];
    }

    // Add new RSSI measurement to history
    rssiMeasurementsRef.current[identifier].push(rssi);

    // Prediction step
    let predictedState = kalmanStateRef.current[identifier];
    let predictedCovariance = kalmanCovarianceRef.current[identifier] + processNoise;

    // Measurement update step
    const kGain = predictedCovariance / (predictedCovariance + measurementNoise);
    const updatedState = predictedState + kGain * (rssi - predictedState);
    const updatedCovariance = (1 - kGain) * predictedCovariance;

    // Save updated state and covariance
    kalmanStateRef.current[identifier] = updatedState;
    kalmanCovarianceRef.current[identifier] = updatedCovariance;

    // Update the device's filtered RSSI value
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === identifier
          ? { ...device, filteredRssi: updatedState }
          : device
      )
    );
  };

  useEffect(() => {
    return () => {
      // Cleanup when unmounting component
      if (isScanning) {
        bleManager.stopDeviceScan();
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      // Do not call bleManager.destroy()
    };
  }, []);

  return {
    devices,
    isScanning,
    scanDevices,
  };
}
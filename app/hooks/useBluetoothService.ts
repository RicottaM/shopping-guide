// src/hooks/useBluetoothService.ts

import { useState, useEffect, useRef } from 'react';
import { Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import positionService from '../services/PositionService';
import bleManager from '../BleManagerInstance'; // Import singletons
import { ScannedDevice } from '../types/ScannedDevice';
import { useGetAppData } from './useGetAppData';
import { BleDevice } from '../models/bleDevice.model';

class KalmanFilter {
  private processNoise: number;
  private measurementNoise: number;
  private state: { [key: string]: number };
  private covariance: { [key: string]: number };

  constructor(processNoise: number, measurementNoise: number) {
    this.processNoise = processNoise;
    this.measurementNoise = measurementNoise;
    this.state = {};
    this.covariance = {};
  }

  apply(identifier: string, measurement: number): number {
    if (this.state[identifier] === undefined) {
      this.state[identifier] = measurement;
      this.covariance[identifier] = 1;
    }

    // Prediction step
    let predictedState = this.state[identifier];
    let predictedCovariance = this.covariance[identifier] + this.processNoise;

    // Measurement update step
    const kGain = predictedCovariance / (predictedCovariance + this.measurementNoise);
    const updatedState = predictedState + kGain * (measurement - predictedState);
    const updatedCovariance = (1 - kGain) * predictedCovariance;

    // Save updated state and covariance
    this.state[identifier] = updatedState;
    this.covariance[identifier] = updatedCovariance;

    return updatedState;
  }
}

export function useBluetoothService() {
  const [devices, setDevices] = useState<ScannedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [macToNameMapping, setMacToNameMapping] = useState<{ [key: string]: number }>({});
  const [bleDevices, setBleDevices] = useState<BleDevice[]>();

  const deviceSetRef = useRef<Set<string>>(new Set());
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const macToNameMappingRef = useRef<{ [key: string]: number }>({});

  const getAppData = useGetAppData();

  const kalmanFilter = useRef(new KalmanFilter(0.008, 1)).current;

  useEffect(() => {
    const fetchBleDevices = async () => {
      try {
        const storeId = await getAppData('selectedStoreId');
        const bleDevicesResponse = await fetch(`http://172.20.10.4:3000/ble_devices/${storeId}`);
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
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
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
          const macAddress = scannedDevice.id.toUpperCase();

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
            const filteredRssi = kalmanFilter.apply(macAddress, scannedDevice.rssi);
            setDevices((prevDevices) =>
              prevDevices.map((device) => (device.id === macAddress ? { ...device, filteredRssi } : device))
            );
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
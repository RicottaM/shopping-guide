// src/hooks/useBluetoothService.ts
import { useState, useEffect, useRef } from 'react';
import { Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import positionService from '../services/PositionService';
import bleManager from '../BleManagerInstance'; // Importuj singletons
import { ScannedDevice } from '../types/ScannedDevice';
import { useGetAppData } from './useGetAppData';
import { BleDevice } from '../models/bleDevice.model';
import React from 'react';

export function useBluetoothService() {
  const [devices, setDevices] = useState<ScannedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [macToNameMapping, setMacToNameMapping] = useState<{ [key: string]: number }>();
  const [bleDevices, setBleDevices] = useState<BleDevice[]>();

  const deviceSetRef = useRef<Set<string>>(new Set());
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getAppData = useGetAppData();

  const rssiMeasurementsRef = useRef<{ [key: string]: number[] }>({});
  const kalmanStateRef = useRef<{ [key: string]: number }>({});
  const kalmanCovarianceRef = useRef<{ [key: string]: number }>({});
  const processNoise = 0.008;
  const measurementNoise = 1;

  useEffect(() => {
    const fetchBleDevices = async () => {
      try {
        const storeId = await getAppData('selectedStoreId');
        const bleDevices = await fetch(`http://172.20.10.3:3000/ble_devices/${storeId}`);
        const bleDevicesData = await bleDevices.json();

        return bleDevicesData;
      } catch (error) {
        if (error instanceof Error) {
          console.error('An error occured while getting ble devices: ', error.message);
        } else {
          console.error('An error occured while getting ble devices.');
        }
      }
    };

    fetchBleDevices().then((bleDevices: BleDevice[]) => {
      //console.log(bleDevices);
      if (bleDevices) {
        const mapping: { [key: string]: number } = {};
        //console.log(bleDevices);
        bleDevices.forEach((device) => {
          mapping[device.mac] = device.section_id;
        });

        setMacToNameMapping(mapping);
      }
    });
  }, []);

  const scanDevices = async () => {
    if (isScanning) {
      // Zatrzymaj skanowanie
      bleManager.stopDeviceScan();
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      setIsScanning(false);
    } else {
      // Rozpocznij skanowanie
      // Sprawdź uprawnienia na Androidzie
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
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

        console.log('Scanned device: ', scannedDevice);

        if (scannedDevice && scannedDevice.name === 'HMSoft') {
          const uuid = scannedDevice.id;
          if (!deviceSetRef.current.has(uuid)) {
            deviceSetRef.current.add(uuid);
            setDevices((prevDevices) => [...prevDevices, { device: scannedDevice, filteredRssi: scannedDevice.rssi ?? 0, id: scannedDevice.id }]);
          } else {
            // Aktualizuj RSSI
            setDevices((prevDevices) =>
              prevDevices.map((scanned) =>
                scanned.device.id === uuid ? { ...scanned, filteredRssi: scannedDevice.rssi ?? scanned.filteredRssi, id: scanned.device.id } : scanned
              )
            );
          }

          if (scannedDevice.rssi !== null) {
            applyKalmanFilter(uuid, scannedDevice.rssi);
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

            if (macToNameMapping) {
              const mappedName = macToNameMapping[topDevice.device.id];

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

  const applyKalmanFilter = (uuid: string, rssi: number) => {
    if (kalmanStateRef.current[uuid] === undefined) {
      // Initialize Kalman filter state and covariance if not already present
      kalmanStateRef.current[uuid] = rssi;
      kalmanCovarianceRef.current[uuid] = 1;
      rssiMeasurementsRef.current[uuid] = [];
    }

    // Add new RSSI measurement to history
    rssiMeasurementsRef.current[uuid].push(rssi);

    // Prediction step
    let predictedState = kalmanStateRef.current[uuid];
    let predictedCovariance = kalmanCovarianceRef.current[uuid] + processNoise;

    // Measurement update step
    let kalmanGain = predictedCovariance / (predictedCovariance + measurementNoise);
    let updatedState = predictedState + kalmanGain * (rssi - predictedState);
    let updatedCovariance = (1 - kalmanGain) * predictedCovariance;

    // Update the Kalman filter state and covariance
    kalmanStateRef.current[uuid] = updatedState;
    kalmanCovarianceRef.current[uuid] = updatedCovariance;

    // Update RSSI value in the devices array with the filtered value
    setDevices((prevDevices) => prevDevices.map((scanned) => (scanned.device.id === uuid ? { ...scanned, filteredRssi: updatedState } : scanned)));
  };

  useEffect(() => {
    return () => {
      // Cleanup podczas odmontowywania komponentu
      if (isScanning) {
        bleManager.stopDeviceScan();
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      // Nie wywołuj bleManager.destroy()
    };
  }, []);

  return {
    devices,
    isScanning,
    scanDevices,
  };
}

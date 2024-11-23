// src/hooks/useBluetoothService.ts

import { useState, useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import positionService from '../services/PositionService';
import bleManager from '../BleManagerInstance'; // Import singletons
import { ScannedDevice } from '../types/ScannedDevice';
import { useGetAppData } from './useGetAppData';
import { BleDevice } from '../models/bleDevice.model';

export function useBluetoothService() {
  const [devices, setDevices] = useState<ScannedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [macToPositionMapping, setMacToPositionMapping] = useState<{ [key: string]: number }>({});
  const [bleDevices, setBleDevices] = useState<BleDevice[]>();

  const deviceSetRef = useRef<Set<string>>(new Set());
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const macToPositionMappingRef = useRef<{ [key: string]: number }>({});

  const getAppData = useGetAppData();

  // Kalman filter variables for RSSI
  const rssiMeasurementsRef = useRef<{ [key: string]: number[] }>({});
  const kalmanStateRef = useRef<{ [key: string]: number }>({});
  const kalmanCovarianceRef = useRef<{ [key: string]: number }>({});
  const processNoise = 0.05;
  const measurementNoise = 1.5;



  // Kalman filter variables for position
  // const positionStateRef = useRef<number>(0);
  // const positionCovarianceRef = useRef<number>(100);
  // const processNoisePosition = 300.0; // Increase for faster responsiveness
  // const measurementNoisePosition = 0.01; // Decrease to trust measurements more



  // Store estimated distances to beacons
  const estimatedDistancesRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchBleDevices = async () => {
      try {
        const storeId = await getAppData('selectedStoreId');
        const bleDevicesResponse = await fetch(`http://172.20.10.2:3000/ble_devices/${storeId}`);
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
        // Map MAC addresses to their positions along the line (e.g., in meters or section IDs)
        mapping[device.mac.toUpperCase()] = device.section_id;
      });

      setMacToPositionMapping(mapping);
      macToPositionMappingRef.current = mapping; // Update the ref
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
            applyKalmanFilter(macAddress, scannedDevice.rssi);
          }
        }
      });

      scanIntervalRef.current = setInterval(() => {
        estimateAndUpdatePosition();
      }, 100);

      setIsScanning(true);
    }
  };

  const applyKalmanFilter = (identifier: string, rssi: number) => {
    if (kalmanStateRef.current[identifier] === undefined) {
      kalmanStateRef.current[identifier] = rssi;
      kalmanCovarianceRef.current[identifier] = 100; // Start with high uncertainty
      rssiMeasurementsRef.current[identifier] = [];
    }

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

    // Estimate distance from filtered RSSI
    const A = -60; // Reference RSSI at 1 meter (calibrate for your environment)
    const n = 1.9; // Path loss exponent (adjust based on environment)
    const estimatedDistance = Math.pow(10, (A - updatedState) / (10 * n));

    estimatedDistancesRef.current[identifier] = estimatedDistance;

    // Update the device's filtered RSSI value
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === identifier
          ? { ...device, filteredRssi: updatedState }
          : device
      )
    );
  };

  const estimateAndUpdatePosition = () => {
    const estimatedPosition = estimatePosition();

    if (estimatedPosition !== undefined && !isNaN(estimatedPosition)) {
      // Zaokrąglamy pozycję do najbliższej sekcji
      const roundedPosition = Math.round(estimatedPosition);

      // Upewniamy się, że pozycja mieści się w zakresie dostępnych sekcji
      const maxSectionId = Math.max(...Object.values(macToPositionMappingRef.current));
      const minSectionId = Math.min(...Object.values(macToPositionMappingRef.current));
      const clampedPosition = Math.min(Math.max(roundedPosition, minSectionId), maxSectionId);

      // Aktualizuj pozycję bezpośrednio
      positionService.updateLocation(clampedPosition);
    }
  };


  const estimatePosition = () => {
    const estimatedDistances = estimatedDistancesRef.current;
    const positions = macToPositionMappingRef.current;

    const weightsAndPositions = Object.keys(estimatedDistances)
      .map((mac) => {
        const distance = estimatedDistances[mac];
        const position = positions[mac];
        if (distance && position !== undefined) {
          const weight = 1 / Math.pow(distance, 2); // Weight inversely proportional to distance squared
          return { weight, position };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null) as { weight: number; position: number }[];

    if (weightsAndPositions.length === 0) {
      return undefined;
    }

    const totalWeight = weightsAndPositions.reduce((sum, item) => sum + item.weight, 0);
    const weightedPositionSum = weightsAndPositions.reduce(
      (sum, item) => sum + item.weight * item.position,
      0
    );

    const estimatedPosition = weightedPositionSum / totalWeight;

    return estimatedPosition;
  };

  // const updatePositionKalmanFilter = (observation: number) => {
  //   // Prediction step
  //   let predictedState = positionStateRef.current;
  //   let predictedCovariance = positionCovarianceRef.current + processNoisePosition;

  //   // Measurement update step
  //   const kGain = predictedCovariance / (predictedCovariance + measurementNoisePosition);
  //   const updatedState = predictedState + kGain * (observation - predictedState);
  //   const updatedCovariance = (1 - kGain) * predictedCovariance;

  //   // Save updated state and covariance
  //   positionStateRef.current = updatedState;
  //   positionCovarianceRef.current = updatedCovariance;
  // };

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
    currentFilteredPosition: estimatePosition()
  };
}

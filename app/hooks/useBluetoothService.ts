// src/hooks/useBluetoothService.ts
import { useState, useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import positionService from '../services/PositionService';
import bleManager from '../BleManagerInstance';
import { ScannedDevice } from '../types/ScannedDevice';
import { useGetAppData } from './useGetAppData';
import { BleDevice } from '../models/bleDevice.model';

const MIN_RSSI_THRESHOLD = -90;
const PROCESS_NOISE = 0.25;
const MEASUREMENT_NOISE = 1.5;
const RSSI_REF_1M = -60;
const PATH_LOSS_EXPONENT = 1.9;

export function useBluetoothService() {
  const [devices, setDevices] = useState<ScannedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [macToPositionMapping, setMacToPositionMapping] = useState<{ [key: string]: number }>({});
  const [bleDevices, setBleDevices] = useState<BleDevice[]>();

  const deviceSetRef = useRef<Set<string>>(new Set());
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const macToPositionMappingRef = useRef<{ [key: string]: number }>({});
  const kalmanStateRef = useRef<{ [key: string]: number }>({});
  const kalmanCovarianceRef = useRef<{ [key: string]: number }>({});
  const estimatedDistancesRef = useRef<{ [key: string]: number }>({});

  const getAppData = useGetAppData();

  useEffect(() => {
    const fetchBleDevices = async () => {
      try {
        const storeId = await getAppData('selectedStoreId');
        const bleDevicesResponse = await fetch(`http://172.20.10.4:3000/ble_devices/${storeId}`);
        const bleDevicesData = await bleDevicesResponse.json();
        setBleDevices(bleDevicesData);
      } catch (error) {
        console.error('Error fetching BLE devices:', error instanceof Error ? error.message : 'Unknown error');
      }
    };
    fetchBleDevices();
  }, []);

  useEffect(() => {
    if (bleDevices) {
      const mapping: { [key: string]: number } = {};
      bleDevices.forEach((device) => {
        mapping[device.mac.toUpperCase()] = device.section_id;
      });
      setMacToPositionMapping(mapping);
      macToPositionMappingRef.current = mapping;
    }
  }, [bleDevices]);

  const applyKalmanFilter = (identifier: string, rssi: number) => {
    if (rssi < MIN_RSSI_THRESHOLD) return;

    if (kalmanStateRef.current[identifier] === undefined) {
      kalmanStateRef.current[identifier] = rssi;
      kalmanCovarianceRef.current[identifier] = 100;
    }

    const predictedState = kalmanStateRef.current[identifier];
    const predictedCovariance = kalmanCovarianceRef.current[identifier] + PROCESS_NOISE;
    const kGain = predictedCovariance / (predictedCovariance + MEASUREMENT_NOISE);
    const updatedState = predictedState + kGain * (rssi - predictedState);
    const updatedCovariance = (1 - kGain) * predictedCovariance;

    kalmanStateRef.current[identifier] = updatedState;
    kalmanCovarianceRef.current[identifier] = updatedCovariance;

    const estimatedDistance = Math.pow(10, (RSSI_REF_1M - updatedState) / (10 * PATH_LOSS_EXPONENT));
    estimatedDistancesRef.current[identifier] = estimatedDistance;

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === identifier
          ? { ...device, filteredRssi: updatedState }
          : device
      )
    );
  };

  const estimatePosition = () => {
    const estimatedDistances = estimatedDistancesRef.current;
    const positions = macToPositionMappingRef.current;

    // console.log('Aktywne nadajniki:', {
    //   distances: estimatedDistances,
    //   positions: positions,
    //   activeBeacons: Object.keys(estimatedDistances).length
    // });

    const weightsAndPositions = Object.keys(estimatedDistances)
      .map((mac) => {
        const distance = estimatedDistances[mac];
        const position = positions[mac];
        if (distance && position !== undefined) {
          const weight = 1 / Math.pow(distance, 2);
          return { weight, position };
        }
        return null;
      })
      .filter((item): item is { weight: number; position: number } => item !== null);

    if (weightsAndPositions.length === 0) return undefined;

    const totalWeight = weightsAndPositions.reduce((sum, item) => sum + item.weight, 0);
    const weightedPositionSum = weightsAndPositions.reduce(
      (sum, item) => sum + item.weight * item.position,
      0
    );

    const finalPosition = weightedPositionSum / totalWeight;
    // console.log('Obliczona pozycja:', {
    //   position: finalPosition,
    //   weightsAndPositions
    // });

    return finalPosition;
  };

  const scanDevices = async () => {
    if (isScanning) {
      bleManager.stopDeviceScan();
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      setIsScanning(false);
      return;
    }

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
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
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
      const position = estimatePosition();
      if (position !== undefined && !isNaN(position)) {
        const maxSectionId = Math.max(...Object.values(macToPositionMappingRef.current));
        const minSectionId = Math.min(...Object.values(macToPositionMappingRef.current));
        const clampedPosition = Math.min(Math.max(position, minSectionId), maxSectionId);
        positionService.updateLocation(clampedPosition);
      }
    }, 50);

    setIsScanning(true);
  };

  useEffect(() => {
    return () => {
      if (isScanning) {
        bleManager.stopDeviceScan();
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  return {
    devices,
    isScanning,
    scanDevices,
    currentFilteredPosition: estimatePosition()
  };
}
// src/types/ScannedDevice.ts
import { Device } from 'react-native-ble-plx';

export interface ScannedDevice {
    device: Device;
    filteredRssi: number;
    id: string;
}
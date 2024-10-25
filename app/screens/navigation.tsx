// src/components/BluetoothScanner.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, FlatList, Text, StyleSheet } from 'react-native';
import { useBluetoothService } from '../hooks/useBluetoothService';
import positionService from '../services/PositionService';

export default function BluetoothScanner() {
  const { devices, isScanning, scanDevices } = useBluetoothService();
  const [currentLocation, setCurrentLocation] = useState<number | null>(null);

  useEffect(() => {
    const subscription = positionService.currentLocation$.subscribe(
      (location) => {
        setCurrentLocation(location);
      },
      (error) => {
        console.error('Błąd w subskrypcji PositionService:', error);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button title={isScanning ? 'Stop Scanning' : 'Start Scanning'} onPress={scanDevices} />
      <Text style={styles.locationText}>Current Location: {currentLocation}</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.device.id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{item.device.name ?? 'Unnamed Device'}</Text>
            <Text>RSSI: {item.filteredRssi.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  locationText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Button, FlatList, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useBluetoothService } from '../hooks/useBluetoothService';
import positionService from '../services/PositionService';
import { useNavigation, useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Screens } from '../enum/screens';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';
import { useGetAppData } from '../hooks/useGetAppData';
import ChatBubble from '../components/ChatBubble';
import PathFindingService from '../services/PathFindingService';
import { Edge } from '../models/edge.model';
import EtiMap from '../../assets/svg/stores/EtiStore';

export default function Navigation() {
  const { devices, isScanning, scanDevices } = useBluetoothService();
  const [currentLocation, setCurrentLocation] = useState<number | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const handleRouteChange = useHandleRouteChange();
  const getAppData = useGetAppData();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // Start scanning when the component mounts
    scanDevices();

    // Subscribe to currentLocation updates
    const subscription = positionService.currentLocation$.subscribe(
      (location) => {
        setCurrentLocation(location);
      },
      (error) => {
        console.error('Error in PositionService subscription:', error);
      }
    );

    // Clean up the subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mapContainer}>
          <EtiMap currentLocation={currentLocation} />
        </View>
      </ScrollView>

      {/* Nawigacja na dole */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-circle-left" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Code)}>
          <MaterialCommunityIcons name="qrcode-scan" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Navigation)}>
          <FontAwesome5 name="flag-checkered" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.User)}>
          <FontAwesome name="user" size={32} color="#013b3d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a0cbb3',
  },
  deviceListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scrollContainer: {
    padding: 16,
  },
  mapContainer: {
    marginTop: 70,
    height: 500,
  },
  locationText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceListContainer: {
    marginTop: 10,
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
    paddingBottom: 50,
  },
  navButton: {
    alignItems: 'center',
    backgroundColor: '#e8fefd',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 15,
    width: 66,
    height: 62,
  },
  backButtonContainer: {
    justifyContent: 'center',
    marginLeft: 40,
  },
});
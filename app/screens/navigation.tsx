import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Button, FlatList, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useBluetoothService} from '../hooks/useBluetoothService';
import positionService from '../services/PositionService';
import StoreMap from './nav'; // Import mapy sklepu
import { useNavigation, useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Screens } from '../enum/screens';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';
import TestSvg from '../../assets/svg/test.svg';
import ChatBubble from '../components/ChatBubble';

export default function BluetoothScanner() {
  const { devices, isScanning, scanDevices } = useBluetoothService();
  const [currentLocation, setCurrentLocation] = useState<number | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const handleRouteChange = useHandleRouteChange();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // Start scanning when the component mounts
    scanDevices();
  
    // Subskrybuj tylko raz przy montowaniu komponentu
    const subscription = positionService.currentLocation$.subscribe(
      (location) => {
        // Zaktualizuj stan tylko, jeśli lokalizacja jest różna od bieżącej
        setCurrentLocation((prevLocation) => {
          if (prevLocation !== location) {
            return location;
          }
          return prevLocation;
        });
      },
      (error) => {
        console.error('Błąd w subskrypcji PositionService:', error);
      }
    );
  
    // Oczyść subskrypcję po odmontowaniu komponentu
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Przykładowe odwiedzone sekcje - możesz dodać bardziej dynamiczną logikę opartą na aktualnej lokalizacji
  const visitedSections = currentLocation ? [`A${currentLocation}`] : [];

  return (
    
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Dodaj mapę sklepu na górze */}
        <View style={styles.mapContainer}>
          <StoreMap visitedSections={visitedSections} />
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
const windowHeight = Dimensions.get('window').height; // Wysokość ekranu

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
    height: windowHeight * 0.7, // Zamiast stałej wysokości dopasowujemy do 70% wysokości ekranu
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    paddingTop: 30,
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
    marginTop: 100,
    justifyContent: 'center',
    marginLeft: 40,
  },  
});
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSaveAppData } from '../hooks/useSaveAppData';
import { Store } from '../models/store.model';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';
import { Screens } from '../enum/screens';

export default function Map() {
  const navigation = useNavigation();
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store>();
  const [initialRegion, setInitialRegion] = useState({
    latitude: 52.2297,
    longitude: 21.0122,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const saveAppData = useSaveAppData();
  const useRouteChange = useHandleRouteChange();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSelectStore = async (storeId: number) => {
    await saveAppData('selectedStoreId', storeId.toString(), 7);
    Alert.alert(`Store has been selected successfully`);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://localhost:3000/stores');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: Store[] = await response.json();
        setStores(data);

        if (data.length > 0) {
          setInitialRegion({
            latitude: parseFloat(data[0].latitude),
            longitude: parseFloat(data[0].longitude),
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (error) {
        console.log('Fetching stores failed.');
      }
    };

    fetchStores();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer} onPress={() => useRouteChange(Screens.Categories)}>
        <MaterialIcons name="arrow-back-ios" size={32} color="#013b3d" />
      </TouchableOpacity>

      <MapView style={styles.map} region={initialRegion}>
        {stores.map((store: Store) => (
          <Marker
            key={store.store_id}
            coordinate={{ latitude: parseFloat(store.latitude), longitude: parseFloat(store.longitude) }}
            title={store.store_name}
            onPress={() => setSelectedStore(store)}
          />
        ))}
      </MapView>

      {selectedStore && (
        <View style={styles.storeDetails}>
          <Text style={styles.storeName}>{selectedStore.store_name}</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => handleSelectStore(selectedStore.store_id)}>
            <Text style={styles.selectButtonText}>Select store</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a0cbb3',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  storeDetails: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    backgroundColor: '#e8fefd',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#013b3d',
  },
  selectButton: {
    backgroundColor: '#013b3d',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#e8fefd',
    fontSize: 18,
    fontWeight: '600',
  },
});

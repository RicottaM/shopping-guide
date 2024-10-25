import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Screens } from '../enum/screens';
import { useGetAppData } from '../hooks/useGetAppData';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';

export default function User() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const navigation = useNavigation();

  const getAppData = useGetAppData();
  const handleRouteChange = useHandleRouteChange();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const username = await getAppData('username');
      setUsername(username);
    })();
  }, []);

  async function handleLogout() {
    await deleteUserData();
    await logoutUser();

    router.push('/');
  }

  const logoutUser = async () => {
    await fetch('http://192.168.1.10:3000' + '/auth/logout');
  };

  const deleteUserData = async () => {
    await SecureStore.deleteItemAsync('username');
    await SecureStore.deleteItemAsync('userId');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>Hi, {username}!</Text>
        <TouchableOpacity style={styles.logOutContainer} onPress={() => handleLogout()}>
          <Text style={styles.logOut}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Map)}>
          <FontAwesome5 name="map-marked-alt" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.navigate('/')}>
          <FontAwesome5 name="home" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Cart)}>
          <FontAwesome5 name="shopping-basket" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Categories)}>
          <FontAwesome5 name="th-list" size={32} color="#013b3d" />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 40,
    marginTop: 100,
  },
  userName: {
    color: '#013b3d',
    fontWeight: '500',
    fontSize: 24,
  },
  logOutContainer: {
    backgroundColor: '#e8fefd',
    borderRadius: 15,
    padding: 15,
  },
  logOut: {
    color: '#013b3d',
    fontSize: 20,
    fontWeight: '500',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
    paddingBottom: 50, // Odstęp od dołu
    paddingTop: 30, // Wewnętrzny odstęp od góry
    bottom: -635, // Pozycja navbaru
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
});

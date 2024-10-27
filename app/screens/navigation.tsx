import React, { useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';
import TestSvg from '../../assets/svg/test.svg';
import { Screens } from '../enum/screens';
import ChatBubble from '../components/ChatBubble';

export default function Navigation() {
  const router = useRouter();
  const navigation = useNavigation();
  const navIconSize = 32;

  const handleRouteChange = useHandleRouteChange();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ChatBubble />
      <View style={styles.mapContainer}>
        <TestSvg width={200} height={200} />
      </View>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Categories)}>
          <FontAwesome5 name="th-list" size={navIconSize} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Code)}>
          <MaterialCommunityIcons name="qrcode-scan" size={navIconSize} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Cart)}>
          <FontAwesome5 name="shopping-basket" size={navIconSize} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.User)}>
          <FontAwesome name="user" size={navIconSize} color="#013b3d" />
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
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#013b3d',
  },
  icon: {
    marginTop: 2,
    marginLeft: 6,
    color: '#013b3d',
  },
  backButtonContainer: {
    marginTop: 100,
    justifyContent: 'center',
    marginLeft: 40,
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
    padding: 15,
    borderRadius: 15,
    width: 66,
    height: 62,
  },
  mapContainer: {
    height: 790,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

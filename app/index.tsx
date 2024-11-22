import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useGetAppData } from './hooks/useGetAppData';
import { useHandleRouteChange } from './hooks/useHandleRouteChange';
import { Screens } from './enum/screens';
import { useVoiceFlow } from './hooks/useVoiceFlow';
import { startScreenFlow } from './voiceFlows/startScreenFlow';

export default function Home() {
  const navigation = useNavigation();
  const router = useRouter();
  const getAppData = useGetAppData();
  const handleRouteChange = useHandleRouteChange();

  const [username, setUsername] = useState('');

  const { traverseFlow } = useVoiceFlow();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    startVoiceFlow();
  }, []);

  const startVoiceFlow = async () => {
    const userData = await getAppData('username');
    setUsername(userData);

    const flow = startScreenFlow(handleRouteChange, userData);
    await traverseFlow(flow, 'intro');
  };

  const handleGetStarted = () => {
    if (username) {
      handleRouteChange(Screens.User);
    } else {
      handleRouteChange(Screens.Login);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Welcome to Shopper</Text>
      <Text style={styles.paragraph}>Fill your cart, follow the trail, and make your shopping faster!</Text>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
        <AntDesign name="right" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#a0cbb3',
  },
  logo: {
    width: 230,
    height: 230,
    borderRadius: 115,
    marginTop: 170,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#013b3d',
    marginTop: 70,
  },
  paragraph: {
    fontSize: 20,
    marginHorizontal: 20,
    color: '#013b3d',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8fefd',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 100,
    borderRadius: 25,
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
});

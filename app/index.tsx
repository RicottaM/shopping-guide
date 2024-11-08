import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import { useGetAppData } from './hooks/useGetAppData';
import { useHandleRouteChange } from './hooks/useHandleRouteChange';
import { Screens } from './enum/screens';

interface SpeechResultsEvent {
  value: string[];
}

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();

  const getAppData = useGetAppData();
  const handleRouteChange = useHandleRouteChange();
  const [username, setUsername] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const userData = await getAppData('username');
      setUsername(userData);
    })();
  }, []);

  // Initialize voice and TTS settings
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Tts.speak("Welcome to Shopper. Say 'Get started' to begin.");

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (event: SpeechResultsEvent) => {
    const spokenText = event.value[0].toLowerCase();
    if (spokenText.includes('get started')) {
      handleGetStarted();
    } else {
      Tts.speak("I didn't understand. Please say 'Get started'.");
    }
  };

  const handleGetStarted = () => {
    if (username) {
      handleRouteChange(Screens.User);
    } else {
      handleRouteChange(Screens.Login);
    }
  };

  const startVoiceRecognition = () => {
    Voice.start('en-US');
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

      {/* Voice command trigger */}
      <TouchableOpacity onPress={startVoiceRecognition} style={styles.voiceButton}>
        <AntDesign name="sound" size={24} color="#013b3d" />
        <Text style={styles.voiceButtonText}>Voice Command</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e8fefd',
    borderRadius: 20,
    marginTop: 20,
  },
  voiceButtonText: {
    fontSize: 18,
    color: '#013b3d',
    marginLeft: 10,
  },
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

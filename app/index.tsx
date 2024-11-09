import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import * as Speech from 'expo-speech';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import { useGetAppData } from './hooks/useGetAppData';
import { useHandleRouteChange } from './hooks/useHandleRouteChange';
import { Screens } from './enum/screens';
import Voice from "@react-native-voice/voice";

interface SpeechResultsEvent {
  value: string[];
}

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();

  const getAppData = useGetAppData();
  const handleRouteChange = useHandleRouteChange();
  const [username, setUsername] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleGetStarted = () => {
    if (username) {
      handleRouteChange(Screens.User);
    } else {
      handleRouteChange(Screens.Login);
    }
  };

  // const textVoice = (text: string) => {
  //   Speech.speak("Hello shopper!");
  // }

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);
    setIsListening(true);
  };

  const onSpeechResults = (e: any) => {
    console.log('onSpeechResults: ', e);
    const text = e.value[0];
    setRecognizedText(text);
    setIsListening(false);
  };

  const startListening = async () => {
    setRecognizedText('');
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Welcome to Shopper</Text>
      <Text style={styles.paragraph}>Fill your cart, follow the trail, and make your shopping faster!</Text>

      {/* <TouchableOpacity style={styles.button} onPress={() => {textVoice("Hello shopper!")}}>
        <Text style={styles.buttonText}>Voice</Text>
        <AntDesign name="right" size={24} style={styles.icon} />
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.button} onPress={startListening}>
        <Text style={styles.buttonText}>{isListening ? 'Listening...' : 'Start Voice Input'}</Text>
        <AntDesign name="right" size={24} style={styles.icon} />
      </TouchableOpacity>

      {recognizedText !== '' && (
        <Text style={styles.recognizedText}>You said: {recognizedText}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
        <AntDesign name="right" size={24} style={styles.icon} />
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
  recognizedText: {
    fontSize: 18,
    color: '#013b3d',
    marginTop: 20,
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
    marginTop: 30,
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
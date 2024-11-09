import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useGetAppData } from './hooks/useGetAppData';
import { useHandleRouteChange } from './hooks/useHandleRouteChange';
import { Screens } from './enum/screens';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import * as Speech from 'expo-speech';

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();
  const getAppData = useGetAppData();
  const handleRouteChange = useHandleRouteChange();

  const [username, setUsername] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isError, setError] = useState<string>('');
  const [textToSpeak, setTextToSpeak] = useState('');
  
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const isAvailable = await ExpoSpeechRecognitionModule.isRecognitionAvailable();
        if (!isAvailable) {
          setError('Speech recognition is not available on this device');
        }
      } catch (e) {
        setError('Error checking speech recognition availability');
      }
    };
    
    checkAvailability();
  }, []);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
    setError('');
  });
  
  useSpeechRecognitionEvent('result', (event) => {
    if (event.results && event.results.length > 0) {
      const newTranscript = event.results[0].transcript;
      setTranscript(newTranscript);
    }
  });
  
  useSpeechRecognitionEvent('error', (event) => {
    const errorMessage = `Error: ${event.error} - ${event.message}`;
    setError(errorMessage);
    setIsListening(false);
  });

  const handleGetStarted = () => {
    if (username) {
      handleRouteChange(Screens.User);
    } else {
      handleRouteChange(Screens.Login);
    }
  };

  const handleStart = async () => {
    try {
      setError('');
      setTranscript('');
  
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        setError('Microphone permission denied');
        return;
      }
  
      await ExpoSpeechRecognitionModule.start({
        lang: 'pl-PL',
        interimResults: true,
        maxAlternatives: 1,
        continuous: true,
        requiresOnDeviceRecognition: false,
        addsPunctuation: true,
        volumeChangeEventOptions: {
          enabled: true,
          intervalMillis: 100,
        }
      });
  
    } catch (e) {
      setError(`Start error: ${(e as Error).message}`);
      setIsListening(false);
    }
  };
  
  const handleStop = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } catch (e) {
      setError(`Stop error: ${(e as Error).message}`);
    }
  };

  const handleSpeak = () => {
    Speech.speak(textToSpeak, { language: 'pl-PL' });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.header}>Welcome to Shopper</Text>
      <Text style={styles.paragraph}>
        Fill your cart, follow the trail, and make your shopping faster!
      </Text>

      <TouchableOpacity
        style={[styles.button, isListening && styles.listeningButton]}
        onPress={isListening ? handleStop : handleStart}>
        <Text style={styles.buttonText}>
          {isListening ? 'Tap to Stop' : 'Start Voice Input'}
        </Text>
        <AntDesign name="sound" size={24} style={styles.icon} />
      </TouchableOpacity>

      {isError ? (
        <Text style={styles.errorText}>{isError}</Text>
      ) : transcript ? (
        <Text style={styles.recognizedText}>You said: {transcript}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Enter text to speak"
        value={textToSpeak}
        onChangeText={setTextToSpeak}
      />
      <TouchableOpacity style={styles.button} onPress={handleSpeak}>
        <Text style={styles.buttonText}>Speak</Text>
        <AntDesign name="sound" size={24} style={styles.icon} />
      </TouchableOpacity>

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
    marginTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#013b3d',
    marginTop: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#013b3d',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8fefd',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#013b3d',
    marginRight: 10,
  },
  icon: {
    color: '#013b3d',
  },
  listeningButton: {
    backgroundColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff0033',
    fontSize: 16,
    marginTop: 10,
  },
  recognizedText: {
    fontSize: 18,
    color: '#013b3d',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#013b3d',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 20,
    width: '80%',
  },
});
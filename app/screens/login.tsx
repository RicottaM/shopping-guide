// Login.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSaveAppData } from '../hooks/useSaveAppData';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';
import { Screens } from '../enum/screens';
import { useVoiceFlow } from '../hooks/useVoiceFlow';
import { loginScreenFlow } from '../voiceFlows/loginScreenFlow';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();
  const saveAppData = useSaveAppData();
  const handleRouteChange = useHandleRouteChange();
  const { traverseFlow } = useVoiceFlow();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    startVoiceLoginFlow();
  }, []);

  const startVoiceLoginFlow = async () => {
    const flow = loginScreenFlow(handleRouteChange, loginUser);
    await traverseFlow(flow, 'intro', { email: login, password }, (updatedContext) => {
      if (updatedContext.email !== undefined) {
        setLogin(updatedContext.email);
      }
      if (updatedContext.password !== undefined) {
        setPassword(updatedContext.password);
      }
    });
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://172.20.10.3:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.replace(/\s+/g, ''),
          password: password.replace(/\s+/g, ''),
        }),
        credentials: 'include',
      });

      const authData = await response.json();

      if (authData.user) {
        await saveAppData('username', authData.user.first_name, 30);
        await saveAppData('userId', authData.user.user_id, 30);
        handleRouteChange(Screens.Categories);
        return true;
      } else {
        // Reset state variables on failed login
        setLogin('');
        setPassword('');
        return false;
      }
    } catch {
      // Reset state variables on error
      setLogin('');
      setPassword('');
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText1}>Sign </Text>
        <Text style={styles.headerText2}>In</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor="#013b3d"
            value={login}
            onChangeText={setLogin}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Password" secureTextEntry selectionColor="#013b3d" value={password} onChangeText={setPassword} />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={() => loginUser(login, password)}>
          {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.loginButtonText}>Login</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => handleRouteChange(Screens.Register)}>
        <Text style={styles.signupText}>Don't have an account? Sign up!</Text>
      </TouchableOpacity>

      {/* Restored Navbar */}
      <View style={styles.navbar}>{/* Navbar content */}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 100,
    marginBottom: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText1: {
    fontSize: 36,
    color: '#013b3d',
    fontWeight: '600',
    letterSpacing: 4,
    top: 20,
  },
  headerText2: {
    fontSize: 36,
    color: '#013b3d',
    fontWeight: '600',
    letterSpacing: 4,
    top: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#a0cbb3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '70%',
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: '#e8fefd',
    borderRadius: 15,
    paddingTop: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    fontSize: 20,
    marginBottom: 15,
    color: '#013b3d',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#013b3d',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    borderRadius: 10,
    paddingVertical: 5,
  },
  signupText: {
    color: '#013b3d',
    fontWeight: '500',
    fontSize: 16,
    marginTop: 15,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 30,
    bottom: -190,
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

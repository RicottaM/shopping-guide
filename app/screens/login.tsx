import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { Screens } from '../enum/screens';
import { useGetAppData } from '../hooks/useGetAppData';
import { useSaveAppData } from '../hooks/useSaveAppData';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const navigation = useNavigation();

  const saveAppData = useSaveAppData();
  const getAppData = useGetAppData();
  const handleRouteChange = useHandleRouteChange();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    const response = await fetch('http://192.168.1.10:3000' + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: login,
        password: password,
      }),
      credentials: 'include', // to include cookies
    });

    const authData = await response.json();

    if (authData.user) {
      await saveAppData('username', authData.user.first_name, 30);
      await saveAppData('userId', authData.user.user_id, 30);

      handleRouteChange(Screens.Categories);
    } else {
      Alert.alert(authData.message);
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => handleRouteChange(Screens.Register)}>
        <Text style={styles.signupText}>Don't have an account? Sign up!</Text>
      </TouchableOpacity>

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
  headerContainer: {
    marginTop: 100,
    marginBottom: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    right: 20,
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

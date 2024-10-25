import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { Screens } from '../enum/screens';
import { useGetAppData } from '../hooks/useGetAppData';
import { useSaveAppData } from '../hooks/useSaveAppData';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';

export default function Register() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const router = useRouter();
  const navigation = useNavigation();

  const getAppData = useGetAppData();
  const saveAppData = useSaveAppData();
  const handleRouteChange = useHandleRouteChange();

  const usernameMinLength = 3;
  const passwordMinLength = 8;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const validateData = () => {
    if (firstName.length < usernameMinLength || lastName.length < usernameMinLength) {
      Alert.alert('First name and Last name must be at least 3 characters long');
      return false;
    }

    if (!isValidEmail(login)) {
      Alert.alert('Invalid email');
      return false;
    }

    if (password !== repeatPassword) {
      Alert.alert('Password mismatch');
      return false;
    }

    if (password.length < passwordMinLength || repeatPassword.length < passwordMinLength) {
      Alert.alert('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateData()) return;

    const response = await fetch('http://192.168.1.10:3000' + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: login,
        password: password,
        first_name: firstName,
        last_name: lastName,
      }),
      credentials: 'include',
    });

    const authData = await response.json();

    if (authData.user) {
      await saveAppData('username', authData.user.first_name, 30);
      await saveAppData('userId', authData.user.user_id, 30);

      router.push('/screens/categories');
    } else {
      Alert.alert(authData.message);
    }
  };

  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText1}>Sign </Text>
        <Text style={styles.headerText2}>Up</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="First name" selectionColor="#013b3d" value={firstName} onChangeText={setFirstName} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Last name" selectionColor="#013b3d" value={lastName} onChangeText={setLastName} />
        </View>
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Repeat password"
            secureTextEntry
            selectionColor="#013b3d"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/screens/login')}>
        <Text style={styles.signupText}>Already have an account? Sign in!</Text>
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
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Login)}>
          <FontAwesome name="user" size={32} color="#013b3d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
    bottom: -85,
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

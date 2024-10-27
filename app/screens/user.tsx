import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Screens } from '../enum/screens';
import { useGetAppData } from '../hooks/useGetAppData';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';
import { ChatMessage } from '../models/chatMessage.model';

export default function User() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
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
    await fetch('http://localhost:3000/auth/logout');
  };

  const deleteUserData = async () => {
    await SecureStore.deleteItemAsync('username');
    await SecureStore.deleteItemAsync('userId');
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    setInputText('');

    // Przykładowa odpowiedź bota
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { text: 'To jest odpowiedź bota.', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>Hi, {username}!</Text>
        <TouchableOpacity style={styles.logOutContainer} onPress={handleLogout}>
          <Text style={styles.logOut}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <View key={index} style={[styles.messageBubble, message.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={message.sender === 'user' ? styles.userMessageText : styles.botMessageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            selectionColor={'#e8fefd'}
            placeholder="Send message..."
            placeholderTextColor="#e8fefd"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <FontAwesome5 name="paper-plane" size={18} color="#e8fefd" />
          </TouchableOpacity>
        </View>
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
    fontSize: 20,
  },
  logOutContainer: {
    backgroundColor: '#e8fefd',
    borderRadius: 10,
    padding: 10,
  },
  logOut: {
    color: '#013b3d',
    fontSize: 20,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    marginTop: 30,
    marginHorizontal: 40,
    padding: 10,
    backgroundColor: '#e8fefd',
    borderRadius: 15,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#013b3d',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#b0e5d7',
    alignSelf: 'flex-start',
  },
  userMessageText: {
    color: '#e8fefd',
    fontSize: 18,
  },
  botMessageText: {
    color: '#013b3d',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#013b3d',
    color: '#e8fefd',
    borderRadius: 10,
    padding: 10,
  },
  textInput: {
    flex: 1,
    color: '#e8fefd',
    fontSize: 18,
  },
  sendButton: {
    marginLeft: 10,
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
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 15,
    width: 66,
    height: 62,
  },
});

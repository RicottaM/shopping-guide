import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, ScrollView, TextInput } from 'react-native';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { ChatMessage } from '../models/chatMessage.model';

export default function ChatBubble() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ text: `Hi! How can I help you?`, sender: 'bot' }]);
  const [inputText, setInputText] = useState('');
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return !isExpanded || gestureState.moveY < 30;
      },
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const handleSend = () => {
    if (inputText.trim() === '') return;
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    setInputText('');

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { text: 'To jest odpowiedź bota.', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...(isExpanded ? {} : panResponder.panHandlers)}
    >
      {isExpanded ? (
        <View style={styles.chatContainer}>
          <View style={styles.dragArea} {...panResponder.panHandlers}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setIsExpanded(false)}>
              <FontAwesome5 name="times" size={18} color="#013b3d" />
            </TouchableOpacity>
          </View>

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
      ) : (
        <TouchableOpacity style={styles.chatIcon} onPress={() => setIsExpanded(true)}>
          <Entypo name="chat" size={32} color="#e8fefd" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    zIndex: 1000,
  },
  chatContainer: {
    width: 300,
    height: 400,
    backgroundColor: '#a0cbb3',
    borderRadius: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: '#013b3d',
  },
  dragArea: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    backgroundColor: '#013b3d',
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 2,
    zIndex: 1,
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
});

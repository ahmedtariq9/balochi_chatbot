import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './src/components/Header';
import ChatFeed from './src/components/ChatFeed';
import ChatInput from './src/components/ChatInput';
import ApiKeyModal from './src/components/ApiKeyModal';
import { generateChatResponse } from './src/services/gemini';

const STORAGE_KEY = 'suleimani_mobile_api_key';
const SESSIONS_KEY = 'suleimani_mobile_sessions';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [scriptMode, setScriptMode] = useState('auto');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Load API key and messages on startup
  useEffect(() => {
    (async () => {
      try {
        const savedKey = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedKey) {
          setApiKey(savedKey);
        } else {
          setModalVisible(true);
        }

        const savedMsgs = await AsyncStorage.getItem(SESSIONS_KEY);
        if (savedMsgs) {
          setMessages(JSON.parse(savedMsgs));
        }
      } catch (e) {}
    })();
  }, []);

  // Save messages to storage
  const saveMessages = async (newMsgs) => {
    setMessages(newMsgs);
    try {
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(newMsgs));
    } catch (e) {}
  };

  const handleSaveApiKey = async (key) => {
    setApiKey(key);
    if (key) {
      await AsyncStorage.setItem(STORAGE_KEY, key);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleNewChat = () => {
    Alert.alert('New Chat', 'Start a fresh conversation?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => saveMessages([]) }
    ]);
  };

  const handleSendMessage = async (userText) => {
    if (!userText.trim() || loading) return;

    if (!apiKey) {
      setModalVisible(true);
      return;
    }

    const userMessage = {
      id: 'u_' + Date.now(),
      role: 'user',
      content: userText
    };

    const updated = [...messages, userMessage];
    saveMessages(updated);
    setLoading(true);

    try {
      const responseText = await generateChatResponse({
        apiKey,
        messages: updated,
        scriptMode
      });

      const assistantMessage = {
        id: 'a_' + Date.now(),
        role: 'assistant',
        content: responseText
      };

      saveMessages([...updated, assistantMessage]);
    } catch (err) {
      Alert.alert('Suleimani Balochi Engine', err.message || 'Error communicating with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Header
        apiKey={apiKey}
        scriptMode={scriptMode}
        onChangeScriptMode={setScriptMode}
        onOpenKeyModal={() => setModalVisible(true)}
        onNewChat={handleNewChat}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.feedContainer}>
          <ChatFeed
            messages={messages}
            loading={loading}
            onSelectStarterPrompt={handleSendMessage}
            flatListRef={flatListRef}
          />
        </View>

        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </KeyboardAvoidingView>

      <ApiKeyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617'
  },
  keyboardContainer: {
    flex: 1
  },
  feedContainer: {
    flex: 1
  }
});

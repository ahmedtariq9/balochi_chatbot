import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import StarterCards from './StarterCards';

function isArabicScript(text) {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const matches = text.match(arabicRegex) || [];
  const latinMatches = text.match(/[a-zA-Z]/g) || [];
  return matches.length >= latinMatches.length && matches.length > 0;
}

export default function ChatFeed({ messages, loading, onSelectStarterPrompt, flatListRef }) {
  if (!messages || messages.length === 0) {
    return <StarterCards onSelectPrompt={onSelectStarterPrompt} />;
  }

  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  const handleSpeak = (text) => {
    Speech.stop();
    Speech.speak(text, { rate: 0.9 });
  };

  const renderItem = ({ item, index }) => {
    const isUser = item.role === 'user';
    const isRtl = isArabicScript(item.content);

    return (
      <View style={[styles.bubbleWrap, isUser ? styles.bubbleWrapUser : styles.bubbleWrapAi]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
          <View style={styles.bubbleHeader}>
            <Text style={styles.senderName}>{isUser ? 'You' : 'SuleimaniGPT (سلیمانی)'}</Text>
            {!isUser && (
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleSpeak(item.content)} style={styles.iconBtn}>
                  <Text style={styles.iconText}>🔊</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCopy(item.content)} style={styles.iconBtn}>
                  <Text style={styles.iconText}>📋</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.messageText,
              isRtl ? styles.rtlText : styles.ltrText,
              isUser ? styles.textUser : styles.textAi
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item, index) => item.id || String(index)}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      ListFooterComponent={
        loading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>سلیمانی بلوچی ٹی نبشتہ کنغ انت... (Writing in Balochi...)</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 24
  },
  bubbleWrap: {
    marginBottom: 14,
    width: '100%'
  },
  bubbleWrapUser: {
    alignItems: 'flex-end'
  },
  bubbleWrapAi: {
    alignItems: 'flex-start'
  },
  bubble: {
    maxWidth: '88%',
    borderRadius: 18,
    padding: 14
  },
  bubbleUser: {
    backgroundColor: '#059669',
    borderTopRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1
  },
  bubbleAi: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  senderName: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8
  },
  iconBtn: {
    padding: 2
  },
  iconText: {
    fontSize: 12
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22
  },
  textUser: {
    color: '#f8fafc'
  },
  textAi: {
    color: '#f1f5f9'
  },
  rtlText: {
    textAlign: 'right',
    fontSize: 15,
    lineHeight: 26
  },
  ltrText: {
    textAlign: 'left'
  },
  loadingBox: {
    padding: 10,
    alignItems: 'center'
  },
  loadingText: {
    color: '#34d399',
    fontSize: 11
  }
});

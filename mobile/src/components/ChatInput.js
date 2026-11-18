import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

function isArabicScript(text) {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const matches = text.match(arabicRegex) || [];
  const latinMatches = text.match(/[a-zA-Z]/g) || [];
  return matches.length >= latinMatches.length && matches.length > 0;
}

export default function ChatInput({ onSendMessage, disabled }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const isRtl = isArabicScript(text);

  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <TextInput
          style={[styles.input, isRtl ? styles.rtlInput : styles.ltrInput]}
          value={text}
          onChangeText={setText}
          placeholder="سلیمانی، اردو یا انگریزی ٹی کُجھ جست کن..."
          placeholderTextColor="#64748b"
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={[styles.sendBtn, (!text.trim() || disabled) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || disabled}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#020617',
    borderTopWidth: 1,
    borderTopColor: '#1e293b'
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  input: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 8
  },
  rtlInput: {
    textAlign: 'right',
    fontSize: 15
  },
  ltrInput: {
    textAlign: 'left'
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  sendBtnDisabled: {
    backgroundColor: '#334155'
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -2
  }
});

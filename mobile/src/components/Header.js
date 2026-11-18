import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Header({ onOpenKeyModal, onNewChat, apiKey, scriptMode, onChangeScriptMode }) {
  const nextScriptMode = () => {
    if (scriptMode === 'auto') onChangeScriptMode('arabic');
    else if (scriptMode === 'arabic') onChangeScriptMode('roman');
    else onChangeScriptMode('auto');
  };

  const scriptLabels = {
    auto: 'Auto',
    arabic: 'بلوچی',
    roman: 'Roman'
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>س</Text>
        </View>
        <View>
          <Text style={styles.title}>SuleimaniGPT</Text>
          <Text style={styles.subtitle}>سلیمانی بلوچی اے آئی</Text>
        </View>
      </View>

      <View style={styles.right}>
        {/* Script Switcher Pill */}
        <TouchableOpacity style={styles.pill} onPress={nextScriptMode}>
          <Text style={styles.pillText}>{scriptLabels[scriptMode] || 'Auto'}</Text>
        </TouchableOpacity>

        {/* API Key Status */}
        <TouchableOpacity
          style={[styles.keyBtn, apiKey ? styles.keyBtnActive : styles.keyBtnInactive]}
          onPress={onOpenKeyModal}
        >
          <Text style={styles.keyBtnText}>{apiKey ? '🔑 Key' : '⚠️ Set Key'}</Text>
        </TouchableOpacity>

        {/* New Chat */}
        <TouchableOpacity style={styles.newChatBtn} onPress={onNewChat}>
          <Text style={styles.newChatText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 16
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  },
  title: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 14
  },
  subtitle: {
    color: '#34d399',
    fontSize: 11
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155'
  },
  pillText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600'
  },
  keyBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1
  },
  keyBtnActive: {
    backgroundColor: '#064e3b',
    borderColor: '#059669'
  },
  keyBtnInactive: {
    backgroundColor: '#451a03',
    borderColor: '#d97706'
  },
  keyBtnText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '600'
  },
  newChatBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center'
  },
  newChatText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -2
  }
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { STARTER_PROMPTS } from '../constants/starterPrompts';

export default function StarterCards({ onSelectPrompt }) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✨ Suleimani Balochi AI</Text>
      </View>

      <Text style={styles.headingBalochi}>وَش آتکے! مَں تَھی سلیمانی بلوچی اے آئی آں</Text>
      <Text style={styles.subtitle}>
        خالص سلیمانی بلوچی ٹی گپ ءُ تران کن
      </Text>

      <View style={styles.grid}>
        {STARTER_PROMPTS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => onSelectPrompt(item.promptText)}
          >
            <Text style={styles.cardTitleBalochi}>{item.titleBalochi}</Text>
            <Text style={styles.cardTitleRoman}>{item.titleRoman}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitleBalochi}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 12
  },
  badgeText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: 'bold'
  },
  headingBalochi: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 32
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20
  },
  grid: {
    width: '100%',
    gap: 10
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  cardTitleBalochi: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 2
  },
  cardTitleRoman: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4
  },
  cardSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'right'
  }
});

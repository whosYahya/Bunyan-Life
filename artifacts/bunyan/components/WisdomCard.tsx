import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import HADITHS from '@/assets/data/hadiths.json';

interface WisdomItem {
  id: string;
  arabic?: string | null;
  english: string;
  reference: string;
  source?: string;
  reflection: string;
}

const hadiths = HADITHS as WisdomItem[];

export default function WisdomCard() {
  const colors = useColors();

  // Day-seeded — same content all day, rotates each morning
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const item = hadiths[dayOfYear % hadiths.length]!;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          borderLeftColor: colors.primary,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.primary} />
        <Text style={[styles.title, { color: colors.foreground }]}>Wisdom of the Day</Text>
      </View>

      {/* Arabic */}
      {item.arabic ? (
        <Text style={[styles.arabicText, { color: colors.primary }]}>{item.arabic}</Text>
      ) : null}

      {/* English */}
      <Text style={[styles.englishText, { color: colors.foreground }]}>"{item.english}"</Text>

      {/* Reference */}
      <Text style={[styles.reference, { color: colors.primary }]}>
        — {item.reference}{item.source ? ` · ${item.source}` : ''}
      </Text>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Reflection */}
      <View style={styles.reflectionRow}>
        <View style={[styles.reflectionDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.reflectionLabel, { color: colors.primary }]}>Reflection</Text>
      </View>
      <Text style={[styles.reflectionText, { color: colors.mutedForeground }]}>{item.reflection}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderLeftWidth: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  arabicText: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: 'right',
    fontStyle: 'italic',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  englishText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  reference: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  reflectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reflectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  reflectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  reflectionText: {
    fontSize: 13,
    lineHeight: 20,
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import AYAHS from '@/assets/data/ayahs.json';
import HADITHS from '@/assets/data/hadiths.json';

type ContentType = 'ayah' | 'hadith';

interface WisdomItem {
  id: string;
  arabic?: string | null;
  english: string;
  reference: string;
  source?: string;
  reflection: string;
}

export default function HadithCard() {
  const colors = useColors();

  // Seed initial index from day-of-year so content is consistent within a day
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );

  const [contentType, setContentType] = useState<ContentType>('hadith');
  const dataset: WisdomItem[] = contentType === 'ayah'
    ? (AYAHS as WisdomItem[])
    : (HADITHS as WisdomItem[]);

  const [index, setIndex] = useState(dayOfYear % dataset.length);

  const currentIndex = index % dataset.length;
  const item = dataset[currentIndex]!;

  const handlePrev = () => setIndex(i => (i - 1 + dataset.length) % dataset.length);
  const handleNext = () => setIndex(i => (i + 1) % dataset.length);

  const handleTypeChange = (type: ContentType) => {
    setContentType(type);
    const newDataset = type === 'ayah' ? AYAHS : HADITHS;
    setIndex(dayOfYear % newDataset.length);
  };

  const accentColor = contentType === 'ayah' ? colors.gold : colors.primary;
  const title = contentType === 'ayah' ? 'Ayah of the Day' : 'Hadith of the Day';
  const icon: keyof typeof Ionicons.glyphMap = contentType === 'ayah' ? 'book-outline' : 'chatbubble-ellipses-outline';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          borderLeftColor: accentColor,
        },
      ]}
    >
      {/* Header: title + type toggle */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={icon} size={14} color={accentColor} />
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        </View>

        {/* Toggle */}
        <View style={[styles.toggle, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          {(['hadith', 'ayah'] as ContentType[]).map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => handleTypeChange(type)}
              style={[
                styles.toggleOption,
                contentType === type && { backgroundColor: accentColor, borderRadius: 10 },
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: contentType === type ? '#fff' : colors.mutedForeground },
                ]}
              >
                {type === 'hadith' ? 'Hadith' : 'Ayah'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Arabic text */}
      {item.arabic && (
        <Text
          style={[styles.arabicText, { color: accentColor }]}
          numberOfLines={3}
        >
          {item.arabic}
        </Text>
      )}

      {/* English translation */}
      <Text style={[styles.englishText, { color: colors.foreground }]}>
        "{item.english}"
      </Text>

      {/* Reference */}
      <Text style={[styles.reference, { color: accentColor }]}>
        — {item.reference}
        {item.source ? ` · ${item.source}` : ''}
      </Text>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Reflection */}
      <View style={styles.reflectionRow}>
        <View style={[styles.reflectionDot, { backgroundColor: accentColor }]} />
        <Text style={[styles.reflectionLabel, { color: accentColor }]}>Reflection</Text>
      </View>
      <Text style={[styles.reflectionText, { color: colors.mutedForeground }]}>
        {item.reflection}
      </Text>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          onPress={handlePrev}
          style={[styles.navBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
        >
          <Ionicons name="chevron-back" size={16} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.counter, { color: colors.mutedForeground }]}>
          {currentIndex + 1} / {dataset.length}
        </Text>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
        >
          <Ionicons name="chevron-forward" size={16} color={colors.foreground} />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 2,
    gap: 2,
  },
  toggleOption: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
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
    marginBottom: 16,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  counter: {
    fontSize: 12,
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PrayerName, PrayerStatus } from '@/types';

const TAB_BAR_EXTRA = 100;

type Section = 'prayer' | 'quran' | 'dhikr' | 'learning';

const PRAYERS: { key: PrayerName; name: string; arabic: string; time: string }[] = [
  { key: 'fajr', name: 'Fajr', arabic: 'الفجر', time: '5:17 AM' },
  { key: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر', time: '12:15 PM' },
  { key: 'asr', name: 'Asr', arabic: 'العصر', time: '3:48 PM' },
  { key: 'maghrib', name: 'Maghrib', arabic: 'المغرب', time: '6:42 PM' },
  { key: 'isha', name: 'Isha', arabic: 'العشاء', time: '8:09 PM' },
];

const STATUS_OPTIONS: { status: PrayerStatus; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { status: 'prayed', icon: 'checkmark', label: 'Prayed' },
  { status: 'masjid', icon: 'home-outline', label: 'Masjid' },
  { status: 'delayed', icon: 'time-outline', label: 'Delayed' },
  { status: 'missed', icon: 'close', label: 'Missed' },
];

const DHIKR_PRESETS = [
  { label: 'SubhanAllah', arabic: 'سبحان الله', target: 33 },
  { label: 'Alhamdulillah', arabic: 'الحمد لله', target: 33 },
  { label: "Allahu Akbar", arabic: 'الله أكبر', target: 34 },
];

function statusColor(s: PrayerStatus | null, colors: ReturnType<typeof useColors>) {
  if (s === 'prayed' || s === 'masjid') return colors.primary;
  if (s === 'delayed') return colors.warning;
  if (s === 'missed') return colors.destructive;
  return colors.mutedForeground;
}

export default function DeenScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getTodayLog, logPrayer, logQuran, toggleDhikr, setTasbeeh, logLearning } = useApp();
  const todayLog = getTodayLog();

  const [section, setSection] = useState<Section>('prayer');
  const [quranPages, setQuranPages] = useState('');
  const [quranMins, setQuranMins] = useState('');
  const [learningMins, setLearningMins] = useState('');
  const [loggedQuran, setLoggedQuran] = useState(false);
  const [loggedLearning, setLoggedLearning] = useState(false);

  const tasbeeh = todayLog.tasbeehCount;

  const SECTIONS = [
    { id: 'prayer' as Section, label: 'Prayer', icon: 'moon-outline' as const },
    { id: 'quran' as Section, label: 'Quran', icon: 'book-outline' as const },
    { id: 'dhikr' as Section, label: 'Dhikr', icon: 'heart-outline' as const },
    { id: 'learning' as Section, label: 'Learning', icon: 'library-outline' as const },
  ];

  const completedPrayers = (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerName[])
    .filter(p => todayLog.prayers[p] === 'prayed' || todayLog.prayers[p] === 'masjid').length;

  const card = {
    backgroundColor: colors.card, borderRadius: colors.radius,
    padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: colors.border,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 0 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.foreground, letterSpacing: -0.5, marginBottom: 4 }}>Deen</Text>
        <Text style={{ fontSize: 13, color: colors.mutedForeground, marginBottom: 16 }}>
          {completedPrayers}/5 prayers · {todayLog.quranPages} Quran pages today
        </Text>

        {/* Section selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 12 }}>
          {SECTIONS.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => setSection(s.id)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8,
                borderRadius: 20, backgroundColor: section === s.id ? colors.primary : colors.secondary,
                borderWidth: 1, borderColor: section === s.id ? colors.primary : colors.border,
              }}
            >
              <Ionicons name={s.icon} size={14} color={section === s.id ? '#fff' : colors.mutedForeground} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: section === s.id ? '#fff' : colors.foreground }}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: TAB_BAR_EXTRA, paddingTop: 4 }}
      >
        {/* PRAYER SECTION */}
        {section === 'prayer' && (
          <>
            {PRAYERS.map(prayer => {
              const current = todayLog.prayers[prayer.key];
              return (
                <View key={prayer.key} style={[card, current ? { borderLeftWidth: 3, borderLeftColor: statusColor(current, colors) } : {}]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 11, color: colors.gold, fontWeight: '600', marginBottom: 1 }}>{prayer.arabic}</Text>
                      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.foreground }}>{prayer.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 1 }}>{prayer.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {STATUS_OPTIONS.map(opt => {
                        const active = current === opt.status;
                        const activeColor = statusColor(opt.status, colors);
                        return (
                          <TouchableOpacity
                            key={opt.status}
                            onPress={async () => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              await logPrayer(prayer.key, opt.status);
                            }}
                            style={{
                              width: 38, height: 38, borderRadius: 12,
                              backgroundColor: active ? activeColor : colors.secondary,
                              alignItems: 'center', justifyContent: 'center',
                              borderWidth: 1, borderColor: active ? activeColor : colors.border,
                            }}
                          >
                            <Ionicons name={opt.icon} size={17} color={active ? '#fff' : colors.mutedForeground} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                  {current && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor(current, colors) }} />
                      <Text style={{ fontSize: 11, color: statusColor(current, colors), fontWeight: '600', textTransform: 'capitalize' }}>{current}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* QURAN SECTION */}
        {section === 'quran' && (
          <>
            <View style={card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8 }}>Today</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                    <Text style={{ fontSize: 40, fontWeight: '800', color: colors.primary }}>{todayLog.quranPages}</Text>
                    <Text style={{ fontSize: 16, color: colors.mutedForeground }}>pages</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>{todayLog.quranMinutes} minutes of reading</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8 }}>Goal</Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground, marginTop: 4 }}>2 pages</Text>
                  <Text style={{ fontSize: 12, color: todayLog.quranPages >= 2 ? colors.success : colors.mutedForeground, marginTop: 2 }}>
                    {todayLog.quranPages >= 2 ? 'Completed' : 'Daily target'}
                  </Text>
                </View>
              </View>
              <View style={{ height: 6, backgroundColor: colors.muted, borderRadius: 3 }}>
                <View style={{
                  height: 6, width: `${Math.min(todayLog.quranPages / 4 * 100, 100)}%`,
                  backgroundColor: todayLog.quranPages >= 4 ? colors.success : colors.primary, borderRadius: 3,
                }} />
              </View>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 6 }}>4 pages = full score</Text>
            </View>

            <View style={card}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>Log Session</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, marginBottom: 6, fontWeight: '600' }}>PAGES READ</Text>
                  <TextInput
                    value={quranPages}
                    onChangeText={setQuranPages}
                    placeholder="0"
                    keyboardType="number-pad"
                    style={{
                      borderWidth: 1, borderColor: colors.input, borderRadius: 12,
                      padding: 12, fontSize: 18, fontWeight: '700', color: colors.foreground,
                      backgroundColor: colors.secondary, textAlign: 'center',
                    }}
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, marginBottom: 6, fontWeight: '600' }}>MINUTES</Text>
                  <TextInput
                    value={quranMins}
                    onChangeText={setQuranMins}
                    placeholder="0"
                    keyboardType="number-pad"
                    style={{
                      borderWidth: 1, borderColor: colors.input, borderRadius: 12,
                      padding: 12, fontSize: 18, fontWeight: '700', color: colors.foreground,
                      backgroundColor: colors.secondary, textAlign: 'center',
                    }}
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
              </View>
              {loggedQuran && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={{ fontSize: 13, color: colors.success, fontWeight: '600' }}>Session logged!</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={async () => {
                  const p = parseInt(quranPages || '0');
                  const m = parseInt(quranMins || '0');
                  if (p > 0 || m > 0) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    await logQuran(p, m);
                    setQuranPages('');
                    setQuranMins('');
                    setLoggedQuran(true);
                    setTimeout(() => setLoggedQuran(false), 3000);
                  }
                }}
                style={{
                  backgroundColor: colors.primary, borderRadius: 14, padding: 14,
                  alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
                }}
              >
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Log Session</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* DHIKR SECTION */}
        {section === 'dhikr' && (
          <>
            {/* Morning & Evening toggles */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
              <TouchableOpacity
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  await toggleDhikr('morning');
                }}
                style={[card, {
                  flex: 1, marginBottom: 0, alignItems: 'center', paddingVertical: 20,
                  backgroundColor: todayLog.dhikrMorning ? colors.emeraldLight : colors.card,
                  borderColor: todayLog.dhikrMorning ? colors.primary : colors.border,
                }]}
              >
                <Ionicons name={todayLog.dhikrMorning ? 'sunny' : 'sunny-outline'} size={28} color={todayLog.dhikrMorning ? colors.primary : colors.mutedForeground} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: todayLog.dhikrMorning ? colors.primary : colors.foreground, marginTop: 8 }}>Morning Adhkar</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}>33 remembrances</Text>
                {todayLog.dhikrMorning && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={{ fontSize: 11, color: colors.success, fontWeight: '600' }}>Done</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  await toggleDhikr('evening');
                }}
                style={[card, {
                  flex: 1, marginBottom: 0, alignItems: 'center', paddingVertical: 20,
                  backgroundColor: todayLog.dhikrEvening ? colors.emeraldLight : colors.card,
                  borderColor: todayLog.dhikrEvening ? colors.primary : colors.border,
                }]}
              >
                <Ionicons name={todayLog.dhikrEvening ? 'moon' : 'moon-outline'} size={28} color={todayLog.dhikrEvening ? colors.primary : colors.mutedForeground} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: todayLog.dhikrEvening ? colors.primary : colors.foreground, marginTop: 8 }}>Evening Adhkar</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}>33 remembrances</Text>
                {todayLog.dhikrEvening && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={{ fontSize: 11, color: colors.success, fontWeight: '600' }}>Done</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Tasbeeh Counter */}
            <View style={card}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 4 }}>Tasbeeh Counter</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 20 }}>Tap the counter to increment</Text>
              <TouchableOpacity
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await setTasbeeh(tasbeeh + 1);
                }}
                style={{
                  alignItems: 'center', justifyContent: 'center',
                  width: 140, height: 140, borderRadius: 70, alignSelf: 'center',
                  backgroundColor: colors.emeraldLight, borderWidth: 3, borderColor: colors.primary,
                  marginBottom: 20,
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 52, fontWeight: '800', color: colors.primary }}>{tasbeeh}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                {DHIKR_PRESETS.map((preset, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await setTasbeeh(tasbeeh + preset.target);
                    }}
                    style={{
                      flex: 1, paddingVertical: 10, borderRadius: 12,
                      backgroundColor: colors.secondary, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 9, color: colors.mutedForeground, marginBottom: 2 }}>{preset.arabic}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: colors.foreground }}>+{preset.target}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  await setTasbeeh(0);
                }}
                style={{
                  paddingVertical: 12, borderRadius: 12, alignItems: 'center',
                  backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border,
                }}
              >
                <Text style={{ color: colors.mutedForeground, fontWeight: '600', fontSize: 14 }}>Reset Counter</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* LEARNING SECTION */}
        {section === 'learning' && (
          <>
            <View style={card}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Today</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={{ fontSize: 40, fontWeight: '800', color: colors.primary }}>{todayLog.islamicLearningMinutes}</Text>
                <Text style={{ fontSize: 16, color: colors.mutedForeground }}>minutes of Islamic learning</Text>
              </View>
            </View>

            <View style={card}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>Log a Learning Session</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, marginBottom: 8, fontWeight: '600' }}>MINUTES SPENT</Text>
              <TextInput
                value={learningMins}
                onChangeText={setLearningMins}
                placeholder="e.g. 20"
                keyboardType="number-pad"
                style={{
                  borderWidth: 1, borderColor: colors.input, borderRadius: 12,
                  padding: 14, fontSize: 18, fontWeight: '700', color: colors.foreground,
                  backgroundColor: colors.secondary, marginBottom: 14,
                }}
                placeholderTextColor={colors.mutedForeground}
              />
              <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 14 }}>
                Count time spent on: Quran tafsir, hadith study, Islamic lectures, Islamic books, podcasts
              </Text>
              {loggedLearning && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={{ fontSize: 13, color: colors.success, fontWeight: '600' }}>Logged successfully!</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={async () => {
                  const m = parseInt(learningMins || '0');
                  if (m > 0) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    await logLearning(m);
                    setLearningMins('');
                    setLoggedLearning(true);
                    setTimeout(() => setLoggedLearning(false), 3000);
                  }
                }}
                style={{
                  backgroundColor: colors.primary, borderRadius: 14, padding: 14,
                  alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
                }}
              >
                <Ionicons name="library-outline" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Log Session</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

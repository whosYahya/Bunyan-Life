import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import ProgressRing from '@/components/ProgressRing';
import { toHijri, formatHijri } from '@/utils/hijri';
import { PrayerName, PrayerStatus } from '@/types';

const TAB_BAR_EXTRA = 100;

const PRAYER_NAMES: { key: PrayerName; short: string; arabic: string; time: string }[] = [
  { key: 'fajr', short: 'Fajr', arabic: 'الفجر', time: '5:17' },
  { key: 'dhuhr', short: 'Dhuhr', arabic: 'الظهر', time: '12:15' },
  { key: 'asr', short: 'Asr', arabic: 'العصر', time: '3:48' },
  { key: 'maghrib', short: 'Maghrib', arabic: 'المغرب', time: '6:42' },
  { key: 'isha', short: 'Isha', arabic: 'العشاء', time: '8:09' },
];

const QUOTES = [
  { text: 'The believer to another believer is like a building whose different parts support one another.', source: 'Prophet Muhammad ﷺ', ref: 'Bukhari & Muslim' },
  { text: 'Indeed, Allah will not change the condition of a people until they change what is in themselves.', source: 'The Quran', ref: '13:11' },
  { text: 'Verily, with hardship comes ease.', source: 'The Quran', ref: '94:6' },
  { text: 'The strong man is not the one who can overpower others. Rather, the strong man is the one who controls himself when angry.', source: 'Prophet Muhammad ﷺ', ref: 'Bukhari' },
  { text: 'Take benefit of five before five: your youth before old age, your health before sickness, your wealth before poverty, your free time before preoccupation, and your life before death.', source: 'Prophet Muhammad ﷺ', ref: 'Al-Bayhaqi' },
  { text: 'Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.', source: 'Prophet Muhammad ﷺ', ref: 'Muslim' },
  { text: 'The best of you are those who learn the Quran and teach it.', source: 'Prophet Muhammad ﷺ', ref: 'Bukhari' },
];

function getGreeting(): { arabic: string; english: string } {
  const h = new Date().getHours();
  if (h >= 3 && h < 6) return { arabic: 'الفجر قريب', english: 'Rise for Fajr,' };
  if (h >= 6 && h < 12) return { arabic: 'صباح الخير', english: 'Good Morning,' };
  if (h >= 12 && h < 17) return { arabic: 'السلام عليكم', english: 'Good Afternoon,' };
  if (h >= 17 && h < 21) return { arabic: 'السلام عليكم', english: 'Good Evening,' };
  return { arabic: 'تصبح على خير', english: 'Good Night,' };
}

function scoreLabel(s: number) {
  if (s >= 96) return 'Perfect day!';
  if (s >= 81) return 'Excellent work';
  if (s >= 61) return 'Great progress';
  if (s >= 41) return 'Keep going';
  if (s >= 21) return 'Getting started';
  return 'Begin today';
}

function prayerStatusColor(status: PrayerStatus | null, colors: ReturnType<typeof useColors>) {
  if (status === 'prayed' || status === 'masjid') return colors.primary;
  if (status === 'delayed') return colors.warning;
  if (status === 'missed') return colors.destructive;
  return colors.border;
}

function prayerStatusIcon(status: PrayerStatus | null): keyof typeof Ionicons.glyphMap {
  if (status === 'prayed') return 'checkmark';
  if (status === 'masjid') return 'home';
  if (status === 'delayed') return 'time-outline';
  if (status === 'missed') return 'close';
  return 'remove';
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getTodayLog, calculateDailyScore, getPrayerStreak, getQuranStreak } = useApp();
  const { state } = useApp();

  const todayLog = getTodayLog();
  const score = calculateDailyScore(todayLog);
  const prayerStreak = getPrayerStreak();
  const quranStreak = getQuranStreak();
  const greeting = getGreeting();
  const now = new Date();
  const hijri = toHijri(now);
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length]!;

  const completedPrayers = useMemo(() => {
    const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    return prayers.filter(p => todayLog.prayers[p] === 'prayed' || todayLog.prayers[p] === 'masjid').length;
  }, [todayLog.prayers]);

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingTop: insets.top + 12, paddingBottom: TAB_BAR_EXTRA },
    header: { paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    arabicGreeting: { fontSize: 13, color: colors.gold, fontStyle: 'italic', marginBottom: 2 },
    englishGreeting: { fontSize: 14, color: colors.mutedForeground, marginBottom: 2 },
    nameText: { fontSize: 26, fontWeight: '700', color: colors.foreground, letterSpacing: -0.5 },
    dateText: { fontSize: 12, color: colors.mutedForeground, marginTop: 3 },
    card: {
      backgroundColor: colors.card, borderRadius: colors.radius, marginHorizontal: 16, marginBottom: 12,
      padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
      shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: colors.border,
    },
    sectionLabel: { fontSize: 11, fontWeight: '600', color: colors.mutedForeground, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
    scoreLabelText: { fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 4 },
    scorePercent: { fontSize: 28, fontWeight: '800', color: colors.primary, letterSpacing: -1 },
    statRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    statValue: { fontSize: 16, fontWeight: '700', color: colors.foreground },
    statLabel: { fontSize: 11, color: colors.mutedForeground },
    prayerPill: { flex: 1, alignItems: 'center', paddingVertical: 10 },
    prayerCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
    prayerShort: { fontSize: 10, fontWeight: '600', color: colors.foreground },
    prayerTime: { fontSize: 9, color: colors.mutedForeground, marginTop: 1 },
    statsGrid: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 12 },
    statCard: {
      flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 14,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05,
      shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: colors.border,
    },
    statCardIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statCardValue: { fontSize: 18, fontWeight: '700', color: colors.foreground },
    statCardLabel: { fontSize: 10, color: colors.mutedForeground, marginTop: 2 },
    quoteCard: {
      backgroundColor: colors.goldLight, borderRadius: colors.radius, marginHorizontal: 16, marginBottom: 12,
      padding: 18, borderLeftWidth: 3, borderLeftColor: colors.gold,
      borderWidth: 1, borderColor: colors.gold + '30',
    },
    quoteText: { fontSize: 13, color: colors.foreground, fontStyle: 'italic', lineHeight: 20, marginBottom: 8 },
    quoteSource: { fontSize: 11, color: colors.gold, fontWeight: '600', textAlign: 'right' },
    notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  });

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.arabicGreeting}>{greeting.arabic}</Text>
            <Text style={s.englishGreeting}>{greeting.english}</Text>
            <Text style={s.nameText}>{state.profile.name}</Text>
            <Text style={s.dateText}>{dateStr}  ·  {formatHijri(hijri)}</Text>
          </View>
          <TouchableOpacity style={s.notifBtn}>
            <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Daily Score Card */}
        <View style={s.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <ProgressRing score={score} size={116} strokeWidth={10} color={colors.primary}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: colors.foreground, letterSpacing: -1 }}>{score}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, fontWeight: '500' }}>pts</Text>
              </View>
            </ProgressRing>
            <View style={{ flex: 1 }}>
              <Text style={s.sectionLabel}>Today's Score</Text>
              <Text style={s.scoreLabelText}>{scoreLabel(score)}</Text>
              <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 10 }} />
              <View style={s.statRow}>
                <Ionicons name="flame" size={15} color={colors.warning} />
                <Text style={s.statValue}>{prayerStreak}</Text>
                <Text style={s.statLabel}>{prayerStreak === 1 ? 'day' : 'days'} streak</Text>
              </View>
              <View style={s.statRow}>
                <Ionicons name="book-outline" size={15} color={colors.primary} />
                <Text style={s.statValue}>{todayLog.quranPages}</Text>
                <Text style={s.statLabel}>Quran pages</Text>
              </View>
              <View style={s.statRow}>
                <Ionicons name="water-outline" size={15} color="#3B82F6" />
                <Text style={s.statValue}>{(todayLog.waterMl / 1000).toFixed(1)}L</Text>
                <Text style={s.statLabel}>of 2L water</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Prayer Status */}
        <View style={s.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground }}>Today's Prayers</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: completedPrayers === 5 ? colors.primary : colors.foreground }}>{completedPrayers}</Text>
              <Text style={{ fontSize: 13, color: colors.mutedForeground }}>/5</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {PRAYER_NAMES.map(p => {
              const status = todayLog.prayers[p.key];
              const bgColor = prayerStatusColor(status, colors);
              const icon = prayerStatusIcon(status);
              return (
                <View key={p.key} style={s.prayerPill}>
                  <View style={[s.prayerCircle, { backgroundColor: status ? bgColor : colors.muted, borderWidth: status ? 0 : 1, borderColor: colors.border }]}>
                    <Ionicons name={icon} size={16} color={status ? '#fff' : colors.mutedForeground} />
                  </View>
                  <Text style={[s.prayerShort, { color: status ? bgColor : colors.foreground }]}>{p.short}</Text>
                  <Text style={s.prayerTime}>{p.time}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={s.statsGrid}>
          <View style={s.statCard}>
            <View style={[s.statCardIcon, { backgroundColor: '#3B82F618' }]}>
              <Ionicons name="water-outline" size={16} color="#3B82F6" />
            </View>
            <Text style={s.statCardValue}>{(todayLog.waterMl / 1000).toFixed(1)}L</Text>
            <Text style={s.statCardLabel}>Water</Text>
          </View>
          <View style={s.statCard}>
            <View style={[s.statCardIcon, { backgroundColor: '#A78BFA18' }]}>
              <Ionicons name="moon-outline" size={16} color="#A78BFA" />
            </View>
            <Text style={s.statCardValue}>{todayLog.sleepHours > 0 ? `${todayLog.sleepHours}h` : '—'}</Text>
            <Text style={s.statCardLabel}>Sleep</Text>
          </View>
          <View style={s.statCard}>
            <View style={[s.statCardIcon, { backgroundColor: colors.emeraldLight }]}>
              <Ionicons name="barbell-outline" size={16} color={colors.primary} />
            </View>
            <Text style={s.statCardValue}>{todayLog.workoutDone ? 'Done' : '—'}</Text>
            <Text style={s.statCardLabel}>Workout</Text>
          </View>
        </View>

        {/* Quote of the Day */}
        <View style={s.quoteCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Ionicons name="sparkles" size={12} color={colors.gold} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.gold, letterSpacing: 0.8, textTransform: 'uppercase' }}>Wisdom of the Day</Text>
          </View>
          <Text style={s.quoteText}>"{quote.text}"</Text>
          <Text style={s.quoteSource}>{quote.source} · {quote.ref}</Text>
        </View>

        {/* Daily Goals Preview */}
        <View style={s.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground }}>Daily Goals</Text>
            <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '600' }}>
              {state.goals.filter(g => g.type === 'daily').filter(g => g.current >= g.target).length}/
              {state.goals.filter(g => g.type === 'daily').length} done
            </Text>
          </View>
          {state.goals.filter(g => g.type === 'daily').slice(0, 3).map(goal => {
            const pct = Math.min(goal.current / goal.target, 1);
            return (
              <View key={goal.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: colors.foreground }}>{goal.title}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{goal.current}/{goal.target} {goal.unit}</Text>
                </View>
                <View style={{ height: 5, backgroundColor: colors.muted, borderRadius: 3 }}>
                  <View style={{ height: 5, width: `${pct * 100}%`, backgroundColor: pct >= 1 ? colors.success : colors.primary, borderRadius: 3 }} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

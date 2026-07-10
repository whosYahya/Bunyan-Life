import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import ProgressRing from '@/components/ProgressRing';
import Greeting from '@/components/Greeting';
import UpcomingPrayerCard from '@/components/UpcomingPrayerCard';
import HadithCard from '@/components/HadithCard';
import { toHijri, formatHijri } from '@/utils/hijri';
import { PrayerName, PrayerStatus } from '@/types';

const TAB_BAR_EXTRA = 110;

const PRAYER_META: { key: PrayerName; short: string; time: string }[] = [
  { key: 'fajr',    short: 'Fajr',    time: '5:17' },
  { key: 'dhuhr',   short: 'Dhuhr',   time: '12:15' },
  { key: 'asr',     short: 'Asr',     time: '3:48' },
  { key: 'maghrib', short: 'Maghrib', time: '6:42' },
  { key: 'isha',    short: 'Isha',    time: '8:09' },
];

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

function scoreLabel(s: number) {
  if (s >= 96) return 'Perfect day!';
  if (s >= 81) return 'Excellent work';
  if (s >= 61) return 'Great progress';
  if (s >= 41) return 'Keep going';
  if (s >= 21) return 'Getting started';
  return 'Begin today';
}

import type { DailyLog } from '@/types';

function getRecentActivity(log: DailyLog): string[] {
  const items: string[] = [];
  const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const prayed = prayers.filter(p => log.prayers[p] === 'prayed' || log.prayers[p] === 'masjid');
  if (prayed.length > 0) {
    items.push(`Prayed ${prayed.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}`);
  }
  if (log.quranPages > 0) {
    items.push(`Read ${log.quranPages} page${log.quranPages !== 1 ? 's' : ''} of Quran`);
  }
  if (log.waterMl > 0) {
    items.push(`Drank ${(log.waterMl / 1000).toFixed(1)}L of water`);
  }
  if (log.workoutDone) {
    items.push(`Completed ${log.workoutType ?? 'a'} workout (${log.workoutMinutes} mins)`);
  }
  if (log.dhikrMorning) items.push('Completed morning adhkar');
  if (log.dhikrEvening) items.push('Completed evening adhkar');
  if (log.islamicLearningMinutes > 0) {
    items.push(`${log.islamicLearningMinutes} mins of Islamic learning`);
  }
  if (log.sleepHours > 0) {
    items.push(`Logged ${log.sleepHours}h sleep`);
  }
  return items;
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    getTodayLog, calculateDailyScore, getPrayerStreak, getFajrStreak,
    getQuranStreak, getWorkoutStreak, state,
  } = useApp();

  const todayLog = getTodayLog();
  const score = calculateDailyScore(todayLog);
  const prayerStreak = getPrayerStreak();
  const fajrStreak = getFajrStreak();
  const quranStreak = getQuranStreak();
  const workoutStreak = getWorkoutStreak();

  const now = new Date();
  const hijri = toHijri(now);
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hijriStr = formatHijri(hijri);

  const completedPrayers = useMemo(() => {
    return PRAYER_META.filter(p =>
      todayLog.prayers[p.key] === 'prayed' || todayLog.prayers[p.key] === 'masjid'
    ).length;
  }, [todayLog.prayers]);

  const recentActivity = useMemo(() => getRecentActivity(todayLog as any), [todayLog]);

  const card = {
    backgroundColor: colors.card,
    borderRadius: colors.radius,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  };

  const streaks = [
    { label: 'Prayer', value: prayerStreak, icon: 'moon-outline' as const, color: colors.primary },
    { label: 'Fajr', value: fajrStreak, icon: 'sunny-outline' as const, color: colors.gold },
    { label: 'Quran', value: quranStreak, icon: 'book-outline' as const, color: '#22C55E' },
    { label: 'Workout', value: workoutStreak, icon: 'barbell-outline' as const, color: '#EF4444' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: TAB_BAR_EXTRA }}
      >
        {/* 1. Greeting */}
        <Greeting
          name={state.profile.name}
          dateStr={dateStr}
          hijriStr={hijriStr}
        />

        {/* 2. Today's Score Card */}
        <View style={card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <ProgressRing score={score} size={116} strokeWidth={10} color={colors.primary}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: colors.foreground, letterSpacing: -1 }}>{score}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, fontWeight: '500' }}>pts</Text>
              </View>
            </ProgressRing>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.mutedForeground, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
                Today's Score
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 10 }}>
                {scoreLabel(score)}
              </Text>
              <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 10 }} />
              {[
                { icon: 'flame' as const, color: colors.warning, value: prayerStreak, label: 'day streak' },
                { icon: 'book-outline' as const, color: colors.primary, value: todayLog.quranPages, label: 'Quran pages' },
                { icon: 'water-outline' as const, color: '#3B82F6', value: `${(todayLog.waterMl / 1000).toFixed(1)}L`, label: 'water' },
              ].map((s, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                  <Ionicons name={s.icon} size={14} color={s.color} />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground }}>{s.value}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 3. Next Prayer Card */}
        <View style={{ marginHorizontal: 16 }}>
          <UpcomingPrayerCard />
        </View>

        {/* 4. Today's Prayer Tracker */}
        <View style={card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground }}>Today's Prayers</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: completedPrayers === 5 ? colors.primary : colors.foreground }}>
                {completedPrayers}
              </Text>
              <Text style={{ fontSize: 13, color: colors.mutedForeground }}>/5</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {PRAYER_META.map(p => {
              const status = todayLog.prayers[p.key];
              const bgColor = prayerStatusColor(status, colors);
              const icon = prayerStatusIcon(status);
              return (
                <View key={p.key} style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}>
                  <View style={{
                    width: 38, height: 38, borderRadius: 12,
                    backgroundColor: status ? bgColor : colors.muted,
                    borderWidth: status ? 0 : 1, borderColor: colors.border,
                    alignItems: 'center', justifyContent: 'center', marginBottom: 5,
                  }}>
                    <Ionicons name={icon} size={16} color={status ? '#fff' : colors.mutedForeground} />
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: status ? bgColor : colors.foreground }}>
                    {p.short}
                  </Text>
                  <Text style={{ fontSize: 9, color: colors.mutedForeground, marginTop: 1 }}>{p.time}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 5. Quick Stats — Water, Sleep, Workout, Quran, Learning */}
        <View style={{ marginHorizontal: 16, marginBottom: 12, gap: 10 }}>
          {/* Row 1 */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: 'Water', value: `${(todayLog.waterMl / 1000).toFixed(1)}L`, sub: `of 2L`, icon: 'water-outline' as const, color: '#3B82F6' },
              { label: 'Sleep', value: todayLog.sleepHours > 0 ? `${todayLog.sleepHours}h` : '—', sub: 'last night', icon: 'moon-outline' as const, color: '#A78BFA' },
              { label: 'Workout', value: todayLog.workoutDone ? 'Done' : '—', sub: todayLog.workoutType ?? 'not logged', icon: 'barbell-outline' as const, color: colors.primary },
            ].map(s => (
              <View key={s.label} style={{
                flex: 1, backgroundColor: colors.card, borderRadius: colors.radius,
                padding: 14, borderWidth: 1, borderColor: colors.border,
                shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
              }}>
                <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: s.color + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Ionicons name={s.icon} size={15} color={s.color} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: colors.foreground }}>{s.value}</Text>
                <Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
          {/* Row 2 */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: 'Quran', value: `${todayLog.quranPages}`, sub: 'pages read', icon: 'book-outline' as const, color: colors.gold },
              { label: 'Learning', value: todayLog.islamicLearningMinutes > 0 ? `${todayLog.islamicLearningMinutes}m` : '—', sub: 'Islamic study', icon: 'library-outline' as const, color: '#22C55E' },
            ].map(s => (
              <View key={s.label} style={{
                flex: 1, backgroundColor: colors.card, borderRadius: colors.radius,
                padding: 14, borderWidth: 1, borderColor: colors.border,
                shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
              }}>
                <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: s.color + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Ionicons name={s.icon} size={15} color={s.color} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: colors.foreground }}>{s.value}</Text>
                <Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. Today's Goals */}
        {state.goals.filter(g => g.type === 'daily').length > 0 && (
          <View style={card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground }}>Daily Goals</Text>
              <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '600' }}>
                {state.goals.filter(g => g.type === 'daily' && g.current >= g.target).length}/
                {state.goals.filter(g => g.type === 'daily').length} done
              </Text>
            </View>
            {state.goals.filter(g => g.type === 'daily').slice(0, 4).map(goal => {
              const pct = Math.min(goal.current / goal.target, 1);
              return (
                <View key={goal.id} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: colors.foreground }}>{goal.title}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{goal.current}/{goal.target} {goal.unit}</Text>
                  </View>
                  <View style={{ height: 5, backgroundColor: colors.muted, borderRadius: 3 }}>
                    <View style={{
                      height: 5,
                      width: `${pct * 100}%`,
                      backgroundColor: pct >= 1 ? colors.success : colors.primary,
                      borderRadius: 3,
                    }} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* 7. Hadith / Ayah of the Day */}
        <View style={{ marginHorizontal: 16 }}>
          <HadithCard />
        </View>

        {/* 8. Current Streaks */}
        <View style={card}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>
            Current Streaks
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {streaks.map(s => (
              <View key={s.label} style={{
                flex: 1, alignItems: 'center', paddingVertical: 14,
                borderRadius: 14, backgroundColor: s.color + '12',
                borderWidth: 1, borderColor: s.color + '30',
              }}>
                <Ionicons name={s.icon} size={16} color={s.color} />
                <Text style={{ fontSize: 22, fontWeight: '800', color: s.color, marginTop: 5 }}>
                  {s.value}
                </Text>
                <Text style={{ fontSize: 9, color: colors.mutedForeground, marginTop: 2 }}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 9. Recent Activity */}
        {recentActivity.length > 0 && (
          <View style={card}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>
              Recent Activity
            </Text>
            {recentActivity.map((item, i) => (
              <View key={i} style={{
                flexDirection: 'row', alignItems: 'flex-start', gap: 10,
                paddingVertical: 8,
                borderBottomWidth: i < recentActivity.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}>
                <View style={{
                  width: 28, height: 28, borderRadius: 8,
                  backgroundColor: colors.emeraldLight, alignItems: 'center', justifyContent: 'center', marginTop: 1,
                }}>
                  <Ionicons name="checkmark" size={14} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: colors.foreground }}>{item}</Text>
                  <Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 1 }}>Today</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {recentActivity.length === 0 && (
          <View style={[card, { alignItems: 'center', paddingVertical: 24 }]}>
            <Ionicons name="time-outline" size={32} color={colors.mutedForeground} style={{ marginBottom: 10 }} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 4 }}>
              No activity yet today
            </Text>
            <Text style={{ fontSize: 12, color: colors.mutedForeground, textAlign: 'center' }}>
              Log your first prayer or drink some water to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

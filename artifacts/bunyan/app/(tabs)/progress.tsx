import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import ProgressRing from '@/components/ProgressRing';
import WeeklyBarChart from '@/components/WeeklyBarChart';
import { getWeekDayLabels } from '@/utils/hijri';
import { PrayerName } from '@/types';

const TAB_BAR_EXTRA = 100;

function AchievementItem({ title, description, iconName, level, unlockedAt }: {
  title: string; description: string; iconName: string; level: string; unlockedAt: string | null;
}) {
  const colors = useColors();
  const unlocked = !!unlockedAt;
  const levelColor = level === 'gold' ? colors.gold : level === 'silver' ? '#94A3B8' : '#CD7F32';

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: colors.border, opacity: unlocked ? 1 : 0.45,
    }}>
      <View style={{
        width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
        backgroundColor: unlocked ? levelColor + '20' : colors.muted,
        borderWidth: 1, borderColor: unlocked ? levelColor + '40' : colors.border,
      }}>
        <Ionicons name={iconName as any} size={22} color={unlocked ? levelColor : colors.mutedForeground} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground }}>{title}</Text>
          {unlocked && (
            <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, backgroundColor: levelColor + '20' }}>
              <Text style={{ fontSize: 9, fontWeight: '700', color: levelColor, textTransform: 'uppercase' }}>{level}</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 1 }}>{description}</Text>
        {unlocked && unlockedAt && (
          <Text style={{ fontSize: 10, color: levelColor, marginTop: 2, fontWeight: '600' }}>
            Unlocked {new Date(unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        )}
      </View>
      {!unlocked && <Ionicons name="lock-closed-outline" size={16} color={colors.mutedForeground} />}
      {unlocked && <Ionicons name="checkmark-circle" size={18} color={levelColor} />}
    </View>
  );
}

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getWeeklyLogs, calculateDailyScore, getPrayerStreak, getFajrStreak, getQuranStreak, getWorkoutStreak, state } = useApp();
  const weeklyLogs = getWeeklyLogs();
  const labels = getWeekDayLabels();
  const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  const weeklyScores = weeklyLogs.map((l, i) => ({
    label: labels[i] ?? '',
    value: calculateDailyScore(l),
  }));

  const avgScore = useMemo(() => {
    const scores = weeklyLogs.map(l => calculateDailyScore(l));
    const nonZero = scores.filter(s => s > 0);
    return nonZero.length ? Math.round(nonZero.reduce((a, b) => a + b, 0) / nonZero.length) : 0;
  }, [weeklyLogs, calculateDailyScore]);

  // Category averages for the week
  const prayerAvg = useMemo(() => {
    const avg = weeklyLogs.reduce((sum, l) => {
      const done = prayers.filter(p => l.prayers[p] === 'prayed' || l.prayers[p] === 'masjid').length;
      return sum + done / 5;
    }, 0) / 7;
    return Math.round(avg * 100);
  }, [weeklyLogs]);

  const quranAvg = useMemo(() => {
    const avg = weeklyLogs.reduce((sum, l) => sum + Math.min(l.quranPages / 4, 1), 0) / 7;
    return Math.round(avg * 100);
  }, [weeklyLogs]);

  const waterAvg = useMemo(() => {
    const avg = weeklyLogs.reduce((sum, l) => sum + Math.min(l.waterMl / 2000, 1), 0) / 7;
    return Math.round(avg * 100);
  }, [weeklyLogs]);

  const workoutAvg = useMemo(() => {
    const done = weeklyLogs.filter(l => l.workoutDone).length;
    return Math.round(done / 7 * 100);
  }, [weeklyLogs]);

  const prayerStreak = getPrayerStreak();
  const fajrStreak = getFajrStreak();
  const quranStreak = getQuranStreak();
  const workoutStreak = getWorkoutStreak();

  const card = {
    backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: colors.border,
  };

  const categories = [
    { label: 'Prayer', value: prayerAvg, color: colors.primary, icon: 'moon-outline' as const },
    { label: 'Quran', value: quranAvg, color: colors.gold, icon: 'book-outline' as const },
    { label: 'Water', value: waterAvg, color: '#3B82F6', icon: 'water-outline' as const },
    { label: 'Workout', value: workoutAvg, color: '#EF4444', icon: 'barbell-outline' as const },
  ];

  const streaks = [
    { label: 'Prayer', value: prayerStreak, icon: 'moon-outline' as const, color: colors.primary },
    { label: 'Fajr', value: fajrStreak, icon: 'sunny-outline' as const, color: colors.gold },
    { label: 'Quran', value: quranStreak, icon: 'book-outline' as const, color: '#22C55E' },
    { label: 'Workout', value: workoutStreak, icon: 'barbell-outline' as const, color: '#EF4444' },
  ];

  const unlockedCount = state.achievements.filter(a => a.unlockedAt).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.foreground, letterSpacing: -0.5 }}>Progress</Text>
        <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 4 }}>
          {unlockedCount}/{state.achievements.length} achievements · {avgScore} avg weekly score
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: TAB_BAR_EXTRA, paddingTop: 4 }}>

        {/* Weekly Overview */}
        <View style={card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8 }}>Weekly Average</Text>
              <Text style={{ fontSize: 36, fontWeight: '800', color: colors.primary, letterSpacing: -1, marginTop: 2 }}>{avgScore}</Text>
              <Text style={{ fontSize: 13, color: colors.mutedForeground }}>points per day</Text>
            </View>
            <ProgressRing score={avgScore} size={80} strokeWidth={8} color={colors.primary}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.foreground }}>{avgScore}</Text>
            </ProgressRing>
          </View>
          <WeeklyBarChart data={weeklyScores} maxValue={100} color={colors.primary} height={80} />
        </View>

        {/* Category Breakdown */}
        <View style={card}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>Weekly Breakdown</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {categories.map(cat => (
              <View key={cat.label} style={{ alignItems: 'center' }}>
                <ProgressRing score={cat.value} size={68} strokeWidth={7} color={cat.color}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>{cat.value}%</Text>
                </ProgressRing>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 8 }}>
                  <Ionicons name={cat.icon} size={11} color={cat.color} />
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, fontWeight: '500' }}>{cat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Streaks */}
        <View style={card}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>Current Streaks</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {streaks.map(streak => (
              <View
                key={streak.label}
                style={{
                  flex: 1, minWidth: '45%', paddingVertical: 14, paddingHorizontal: 14,
                  borderRadius: 14, backgroundColor: streak.color + '12',
                  borderWidth: 1, borderColor: streak.color + '30', alignItems: 'center',
                }}
              >
                <Ionicons name={streak.icon} size={20} color={streak.color} />
                <Text style={{ fontSize: 26, fontWeight: '800', color: streak.color, marginTop: 6 }}>{streak.value}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}>{streak.label} streak</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground }}>Achievements</Text>
            <Text style={{ fontSize: 12, color: colors.gold, fontWeight: '600' }}>
              {unlockedCount}/{state.achievements.length}
            </Text>
          </View>
          {state.achievements.map(a => (
            <AchievementItem
              key={a.id}
              title={a.title}
              description={a.description}
              iconName={a.iconName}
              level={a.level}
              unlockedAt={a.unlockedAt}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { WorkoutType } from '@/types';
import WeeklyBarChart from '@/components/WeeklyBarChart';
import { getWeekDayLabels } from '@/utils/hijri';

const TAB_BAR_EXTRA = 100;
const WATER_GOAL_ML = 2000;

type Section = 'water' | 'workout' | 'sleep' | 'nutrition';

const WORKOUT_TYPES: { key: WorkoutType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'push', label: 'Push', icon: 'arrow-up-circle-outline' },
  { key: 'pull', label: 'Pull', icon: 'arrow-down-circle-outline' },
  { key: 'legs', label: 'Legs', icon: 'walk-outline' },
  { key: 'cardio', label: 'Cardio', icon: 'heart-circle-outline' },
  { key: 'running', label: 'Running', icon: 'speedometer-outline' },
  { key: 'walking', label: 'Walking', icon: 'footsteps-outline' },
  { key: 'sports', label: 'Sports', icon: 'football-outline' },
];

export default function HealthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getTodayLog, addWater, logWorkout, logSleep, logNutrition, getWeeklyLogs } = useApp();
  const todayLog = getTodayLog();
  const weeklyLogs = getWeeklyLogs();
  const labels = getWeekDayLabels();

  const [section, setSection] = useState<Section>('water');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutType | null>(null);
  const [workoutMins, setWorkoutMins] = useState(45);
  const [sleepHours, setSleepHours] = useState(todayLog.sleepHours || 7);
  const [loggedWorkout, setLoggedWorkout] = useState(false);
  const [loggedSleep, setLoggedSleep] = useState(false);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [weight, setWeight] = useState('');

  const waterPct = Math.min(todayLog.waterMl / WATER_GOAL_ML, 1);
  const waterBarWidth = `${waterPct * 100}%`;

  const weeklyWater = weeklyLogs.map((l, i) => ({ label: labels[i] ?? '', value: l.waterMl }));
  const weeklyWorkout = weeklyLogs.map((l, i) => ({ label: labels[i] ?? '', value: l.workoutMinutes }));
  const weeklySleep = weeklyLogs.map((l, i) => ({ label: labels[i] ?? '', value: l.sleepHours }));

  const SECTIONS = [
    { id: 'water' as Section, label: 'Water', icon: 'water-outline' as const },
    { id: 'workout' as Section, label: 'Workout', icon: 'barbell-outline' as const },
    { id: 'sleep' as Section, label: 'Sleep', icon: 'moon-outline' as const },
    { id: 'nutrition' as Section, label: 'Nutrition', icon: 'nutrition-outline' as const },
  ];

  const card = {
    backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: colors.border,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 0 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.foreground, letterSpacing: -0.5, marginBottom: 4 }}>Health</Text>
        <Text style={{ fontSize: 13, color: colors.mutedForeground, marginBottom: 16 }}>
          {(todayLog.waterMl / 1000).toFixed(1)}L water · {todayLog.sleepHours > 0 ? `${todayLog.sleepHours}h sleep` : 'no sleep logged'}
          {todayLog.workoutDone ? ` · ${todayLog.workoutType} workout` : ''}
        </Text>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: TAB_BAR_EXTRA, paddingTop: 4 }}>

        {/* WATER SECTION */}
        {section === 'water' && (
          <>
            <View style={card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <View>
                  <Text style={{ fontSize: 40, fontWeight: '800', color: '#3B82F6', letterSpacing: -1 }}>
                    {(todayLog.waterMl / 1000).toFixed(1)}L
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>of {WATER_GOAL_ML / 1000}L goal</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: waterPct >= 1 ? colors.success : colors.foreground }}>
                    {Math.round(waterPct * 100)}%
                  </Text>
                  {waterPct >= 1 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                      <Text style={{ fontSize: 11, color: colors.success, fontWeight: '600' }}>Goal reached!</Text>
                    </View>
                  )}
                </View>
              </View>
              {/* Progress bar */}
              <View style={{ height: 12, backgroundColor: colors.muted, borderRadius: 6, marginBottom: 20 }}>
                <View style={{
                  height: 12, width: waterBarWidth as any, backgroundColor: '#3B82F6',
                  borderRadius: 6, minWidth: waterPct > 0 ? 12 : 0,
                }} />
              </View>
              {/* Quick add buttons */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[250, 500, 750, 1000].map(ml => (
                  <TouchableOpacity
                    key={ml}
                    onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await addWater(ml);
                    }}
                    style={{
                      flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: '#3B82F618',
                      alignItems: 'center', borderWidth: 1, borderColor: '#3B82F630',
                    }}
                  >
                    <Ionicons name="water" size={14} color="#3B82F6" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#3B82F6', marginTop: 3 }}>+{ml < 1000 ? ml : '1k'}</Text>
                    <Text style={{ fontSize: 9, color: colors.mutedForeground }}>{ml < 1000 ? 'ml' : 'ml'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={card}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>This Week</Text>
              <WeeklyBarChart data={weeklyWater} maxValue={WATER_GOAL_ML * 1.2} color="#3B82F6" height={72} />
            </View>
          </>
        )}

        {/* WORKOUT SECTION */}
        {section === 'workout' && (
          <>
            {todayLog.workoutDone && (
              <View style={[card, { backgroundColor: colors.emeraldLight, borderColor: colors.primary }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>Workout Complete</Text>
                    <Text style={{ fontSize: 12, color: colors.primary + 'AA', marginTop: 1, textTransform: 'capitalize' }}>
                      {todayLog.workoutType} · {todayLog.workoutMinutes} mins
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={card}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>Select Workout Type</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                {WORKOUT_TYPES.map(w => (
                  <TouchableOpacity
                    key={w.key}
                    onPress={() => setSelectedWorkout(w.key)}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                      paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
                      backgroundColor: selectedWorkout === w.key ? colors.primary : colors.secondary,
                      borderWidth: 1, borderColor: selectedWorkout === w.key ? colors.primary : colors.border,
                    }}
                  >
                    <Ionicons name={w.icon} size={14} color={selectedWorkout === w.key ? '#fff' : colors.mutedForeground} />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: selectedWorkout === w.key ? '#fff' : colors.foreground }}>{w.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>DURATION (MINUTES)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <TouchableOpacity
                  onPress={() => setWorkoutMins(Math.max(5, workoutMins - 5))}
                  style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="remove" size={22} color={colors.foreground} />
                </TouchableOpacity>
                <Text style={{ fontSize: 32, fontWeight: '800', color: colors.foreground, minWidth: 70, textAlign: 'center' }}>{workoutMins}</Text>
                <TouchableOpacity
                  onPress={() => setWorkoutMins(workoutMins + 5)}
                  style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="add" size={22} color={colors.foreground} />
                </TouchableOpacity>
              </View>
              {loggedWorkout && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={{ fontSize: 13, color: colors.success, fontWeight: '600' }}>Workout logged!</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={async () => {
                  if (!selectedWorkout) return;
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  await logWorkout(selectedWorkout, workoutMins);
                  setLoggedWorkout(true);
                  setTimeout(() => setLoggedWorkout(false), 3000);
                }}
                style={{
                  backgroundColor: selectedWorkout ? colors.primary : colors.muted, borderRadius: 14,
                  padding: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
                }}
              >
                <Ionicons name="barbell-outline" size={18} color={selectedWorkout ? '#fff' : colors.mutedForeground} />
                <Text style={{ color: selectedWorkout ? '#fff' : colors.mutedForeground, fontSize: 15, fontWeight: '700' }}>
                  {selectedWorkout ? 'Log Workout' : 'Select a type first'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={card}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>Weekly Minutes</Text>
              <WeeklyBarChart data={weeklyWorkout} color={colors.primary} height={72} />
            </View>
          </>
        )}

        {/* SLEEP SECTION */}
        {section === 'sleep' && (
          <>
            <View style={card}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Last Night</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                <Text style={{ fontSize: 40, fontWeight: '800', color: '#A78BFA' }}>{todayLog.sleepHours > 0 ? todayLog.sleepHours : '—'}</Text>
                <Text style={{ fontSize: 16, color: colors.mutedForeground }}>{todayLog.sleepHours > 0 ? 'hours' : 'not logged'}</Text>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>LOG SLEEP HOURS</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <TouchableOpacity
                  onPress={() => setSleepHours(Math.max(0, sleepHours - 0.5))}
                  style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="remove" size={22} color={colors.foreground} />
                </TouchableOpacity>
                <Text style={{ fontSize: 32, fontWeight: '800', color: '#A78BFA', minWidth: 80, textAlign: 'center' }}>{sleepHours}h</Text>
                <TouchableOpacity
                  onPress={() => setSleepHours(Math.min(12, sleepHours + 0.5))}
                  style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="add" size={22} color={colors.foreground} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                {[6, 7, 7.5, 8].map(h => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => setSleepHours(h)}
                    style={{
                      flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center',
                      backgroundColor: sleepHours === h ? '#A78BFA20' : colors.secondary,
                      borderWidth: 1, borderColor: sleepHours === h ? '#A78BFA' : colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: sleepHours === h ? '#A78BFA' : colors.foreground }}>{h}h</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {loggedSleep && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={{ fontSize: 13, color: colors.success, fontWeight: '600' }}>Sleep logged!</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={async () => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  await logSleep(sleepHours);
                  setLoggedSleep(true);
                  setTimeout(() => setLoggedSleep(false), 3000);
                }}
                style={{ backgroundColor: '#A78BFA', borderRadius: 14, padding: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
              >
                <Ionicons name="moon-outline" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Log Sleep</Text>
              </TouchableOpacity>
            </View>
            <View style={card}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>Weekly Sleep</Text>
              <WeeklyBarChart data={weeklySleep} maxValue={10} color="#A78BFA" height={72} />
            </View>
          </>
        )}

        {/* NUTRITION SECTION */}
        {section === 'nutrition' && (
          <View style={card}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>Log Nutrition</Text>
            {[
              { label: 'CALORIES (kcal)', value: calories, set: setCalories, placeholder: 'e.g. 2000' },
              { label: 'PROTEIN (g)', value: protein, set: setProtein, placeholder: 'e.g. 150' },
              { label: 'BODY WEIGHT (kg)', value: weight, set: setWeight, placeholder: 'e.g. 80' },
            ].map(field => (
              <View key={field.label} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, marginBottom: 6, fontWeight: '600' }}>{field.label}</Text>
                <TextInput
                  value={field.value}
                  onChangeText={field.set}
                  placeholder={field.placeholder}
                  keyboardType="decimal-pad"
                  style={{
                    borderWidth: 1, borderColor: colors.input, borderRadius: 12,
                    padding: 14, fontSize: 16, fontWeight: '700', color: colors.foreground,
                    backgroundColor: colors.secondary,
                  }}
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
            ))}
            <TouchableOpacity
              onPress={async () => {
                const c = parseFloat(calories || '0');
                const p = parseFloat(protein || '0');
                const w = weight ? parseFloat(weight) : undefined;
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                await logNutrition(c, p, w);
                setCalories(''); setProtein(''); setWeight('');
              }}
              style={{ backgroundColor: colors.primary, borderRadius: 14, padding: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            >
              <Ionicons name="nutrition-outline" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Save Nutrition</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';

const TAB_BAR_EXTRA = 100;

const LEVEL_COLORS: Record<string, string> = {
  Builder: '#94A3B8',
  Disciplined: '#3B82F6',
  Consistent: '#22C55E',
  Leader: '#C9A84C',
  Mentor: '#1A6B45',
};

const LEVEL_THRESHOLDS: Record<string, string> = {
  Builder: '< 30 prayers',
  Disciplined: '30+ prayers',
  Consistent: '100+ prayers',
  Leader: '365+ prayers',
  Mentor: '1825+ prayers',
};

function EditNameModal({ visible, current, onSave, onClose }: {
  visible: boolean; current: string; onSave: (name: string) => void; onClose: () => void;
}) {
  const [name, setName] = useState(current);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} activeOpacity={1} onPress={onClose}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity activeOpacity={1}>
          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: insets.bottom + 24, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>Edit Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={{ borderWidth: 1, borderColor: colors.input, borderRadius: 12, padding: 14, fontSize: 16, color: colors.foreground, backgroundColor: colors.secondary, marginBottom: 16 }}
              placeholder="Your name"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => { if (name.trim()) { onSave(name.trim()); onClose(); } }}
              style={{ backgroundColor: colors.primary, borderRadius: 14, padding: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateProfile, getTotalStats, getPrayerStreak, getQuranStreak, getWorkoutStreak, logout, resetOnboarding } = useApp();
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleResetOnboarding = async () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the onboarding flow next time you open the app. Use for testing only.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive', onPress: async () => {
            await resetOnboarding();
            Alert.alert('Done', 'Onboarding will show on next app launch.');
          },
        },
      ]
    );
  };

  const stats = getTotalStats();
  const prayerStreak = getPrayerStreak();
  const quranStreak = getQuranStreak();
  const workoutStreak = getWorkoutStreak();
  const level = state.profile.level;
  const levelColor = LEVEL_COLORS[level] ?? colors.primary;
  const initials = state.profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const joinedDate = new Date(state.profile.joinedAt);
  const daysActive = Math.floor((Date.now() - joinedDate.getTime()) / 86400000);

  const unlockedAchievements = state.achievements.filter(a => a.unlockedAt);

  const card = {
    backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: colors.border,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.foreground, letterSpacing: -0.5 }}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: TAB_BAR_EXTRA }}>

        {/* Profile Hero */}
        <View style={[card, { alignItems: 'center', paddingVertical: 28 }]}>
          {/* Avatar */}
          <View style={{
            width: 80, height: 80, borderRadius: 40, backgroundColor: levelColor + '20',
            borderWidth: 3, borderColor: levelColor, alignItems: 'center', justifyContent: 'center', marginBottom: 14,
          }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: levelColor }}>{initials}</Text>
          </View>

          {/* Name */}
          <TouchableOpacity
            onPress={() => setEditingName(true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.foreground }}>{state.profile.name}</Text>
            <Ionicons name="pencil-outline" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* Level badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: levelColor + '18', borderWidth: 1, borderColor: levelColor + '40' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: levelColor }}>{level}</Text>
            </View>
          </View>

          <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 8 }}>
            {daysActive} days active · {LEVEL_THRESHOLDS[level]}
          </Text>
        </View>

        {/* Stats overview */}
        <View style={[card, { padding: 0 }]}>
          {[
            { label: 'Total Prayers', value: stats.totalPrayers.toString(), icon: 'moon-outline' as const, color: colors.primary },
            { label: 'Quran Pages', value: stats.totalQuranPages.toString(), icon: 'book-outline' as const, color: colors.gold },
            { label: 'Workouts', value: stats.totalWorkouts.toString(), icon: 'barbell-outline' as const, color: '#EF4444' },
            { label: 'Water Logged', value: `${stats.totalWaterLiters}L`, icon: 'water-outline' as const, color: '#3B82F6' },
          ].map((stat, i, arr) => (
            <View key={stat.label} style={{
              flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14,
              borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border,
            }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: stat.color + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: colors.foreground, fontWeight: '500' }}>{stat.label}</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.foreground }}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Streaks */}
        <View style={card}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>Current Streaks</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: 'Prayer', value: prayerStreak, color: colors.primary },
              { label: 'Quran', value: quranStreak, color: colors.gold },
              { label: 'Workout', value: workoutStreak, color: '#EF4444' },
            ].map(s => (
              <View key={s.label} style={{
                flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14,
                backgroundColor: s.color + '12', borderWidth: 1, borderColor: s.color + '30',
              }}>
                <Ionicons name="flame" size={18} color={s.color} />
                <Text style={{ fontSize: 22, fontWeight: '800', color: s.color, marginTop: 4 }}>{s.value}</Text>
                <Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        {unlockedAchievements.length > 0 && (
          <View style={card}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 14 }}>
              Achievements ({unlockedAchievements.length}/{state.achievements.length})
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {unlockedAchievements.map(a => {
                const lc = a.level === 'gold' ? colors.gold : a.level === 'silver' ? '#94A3B8' : '#CD7F32';
                return (
                  <View key={a.id} style={{
                    width: 72, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6,
                    borderRadius: 14, backgroundColor: lc + '18', borderWidth: 1, borderColor: lc + '40',
                  }}>
                    <Ionicons name={a.iconName as any} size={22} color={lc} />
                    <Text style={{ fontSize: 9, fontWeight: '600', color: colors.foreground, textAlign: 'center', marginTop: 5 }} numberOfLines={2}>
                      {a.title}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={[card, { padding: 0 }]}>
          {[
            { label: 'Notifications', icon: 'notifications-outline' as const, onPress: () => {} },
            { label: 'Prayer Reminders', icon: 'alarm-outline' as const, onPress: () => {} },
            { label: 'Language', icon: 'language-outline' as const, onPress: () => {} },
            { label: 'Export Data', icon: 'download-outline' as const, onPress: () => {} },
            { label: 'About Bunyan', icon: 'information-circle-outline' as const, onPress: () => {} },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={{
                flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border,
              }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Ionicons name={item.icon} size={18} color={colors.foreground} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.foreground }}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Developer Tools */}
        <View style={[card, { padding: 0, borderColor: colors.warning + '40' }]}>
          <View style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.warning, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Developer
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleResetOnboarding}
            style={{
              flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16,
              borderTopWidth: 1, borderTopColor: colors.border,
            }}
          >
            <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.warning + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name="refresh-outline" size={18} color={colors.warning} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.foreground }}>Reset Onboarding</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderColor: colors.destructive + '30', backgroundColor: colors.destructive + '08' }]}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.destructive }}>Sign Out</Text>
        </TouchableOpacity>

        {/* App info */}
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.primary }}>بنيان · Bunyan</Text>
          <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 3 }}>Build Yourself. Strengthen the Ummah.</Text>
          <Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 6 }}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <EditNameModal
        visible={editingName}
        current={state.profile.name}
        onSave={async (name) => { await updateProfile({ name }); }}
        onClose={() => setEditingName(false)}
      />
    </View>
  );
}

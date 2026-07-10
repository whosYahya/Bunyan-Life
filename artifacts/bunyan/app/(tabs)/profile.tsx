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
  const { state, updateProfile, logout, resetOnboarding } = useApp();
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

  const level = state.profile.level;
  const levelColor = LEVEL_COLORS[level] ?? colors.primary;
  const initials = state.profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const joinedDate = new Date(state.profile.joinedAt);
  const daysActive = Math.floor((Date.now() - joinedDate.getTime()) / 86400000);

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

        {/* TRACK */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.mutedForeground, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Track
        </Text>
        <View style={[card, { padding: 0, marginBottom: 20 }]}>
          {[
            { label: 'Badges & Achievements', icon: 'ribbon-outline' as const, color: colors.gold },
            { label: 'Progress Analytics', icon: 'bar-chart-outline' as const, color: colors.primary },
            { label: 'Weekly Report', icon: 'calendar-outline' as const, color: '#22C55E' },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: item.color + '18', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.foreground }}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ACCOUNT */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.mutedForeground, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Account
        </Text>
        <View style={[card, { padding: 0, marginBottom: 20 }]}>
          {[
            { label: 'Notifications', icon: 'notifications-outline' as const, color: colors.foreground },
            { label: 'Privacy', icon: 'shield-checkmark-outline' as const, color: colors.foreground },
            { label: 'Data & Backup', icon: 'cloud-upload-outline' as const, color: colors.foreground },
            { label: 'Settings', icon: 'settings-outline' as const, color: colors.foreground },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <Ionicons name={item.icon} size={18} color={colors.foreground} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.foreground }}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        {/* MORE */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.mutedForeground, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          More
        </Text>
        <View style={[card, { padding: 0, marginBottom: 20 }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Ionicons name="person-add-outline" size={18} color={colors.primary} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.foreground }}>Invite a Brother</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.gold + '18', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Ionicons name="people-outline" size={18} color={colors.gold} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.foreground }}>Brotherhood</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16 }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.destructive + '14', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: colors.destructive }}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
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

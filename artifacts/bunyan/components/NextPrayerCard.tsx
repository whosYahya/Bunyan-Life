import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { PRAYER_TIMES, formatPrayerTime } from '@/utils/prayerTimes';

function formatCountdown(totalMinutes: number): string {
  if (totalMinutes <= 0) return 'Now';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m away`;
  if (m === 0) return `${h}h away`;
  return `${h}h ${m}m away`;
}

function getNextPrayer(now: Date): { prayer: (typeof PRAYER_TIMES)[number]; minutesLeft: number; isImminent: boolean } {
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const ranked = PRAYER_TIMES.map(p => {
    const pMins = p.hours * 60 + p.minutes;
    const diff = pMins > nowMins ? pMins - nowMins : 24 * 60 - nowMins + pMins;
    return { prayer: p, minutesLeft: diff };
  }).sort((a, b) => a.minutesLeft - b.minutesLeft);
  const next = ranked[0]!;
  return { ...next, isImminent: next.minutesLeft <= 30 };
}

export default function NextPrayerCard() {
  const colors = useColors();
  const [now, setNow] = useState(new Date());
  const [reminderEnabled, setReminderEnabled] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const { prayer, minutesLeft, isImminent } = getNextPrayer(now);
  const accentColor = isImminent ? colors.warning : colors.primary;

  const handleReminderToggle = () => {
    if (reminderEnabled) {
      setReminderEnabled(false);
    } else {
      Alert.alert(
        'Enable Reminder',
        'Prayer reminders require notification permissions. Enable in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: () => setReminderEnabled(true) },
        ]
      );
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isImminent ? colors.warning + '50' : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.row}>
        {/* Left: label, name, time + countdown */}
        <View style={styles.left}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>NEXT PRAYER</Text>
          <Text style={[styles.prayerName, { color: colors.foreground }]}>{prayer.name}</Text>
          <Text style={[styles.subtext, { color: colors.mutedForeground }]}>
            {formatPrayerTime(prayer.hours, prayer.minutes)}
            {'  ·  '}
            <Text style={{ color: accentColor, fontWeight: '700' }}>
              {formatCountdown(minutesLeft)}
            </Text>
          </Text>
        </View>

        {/* Right: emoji icon + reminder status */}
        <View style={styles.right}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: accentColor + '14',
                borderColor: accentColor + '30',
              },
            ]}
          >
            <Text style={styles.emoji}>{prayer.emoji}</Text>
          </View>

          <TouchableOpacity onPress={handleReminderToggle} activeOpacity={0.75} style={styles.reminderRow}>
            {reminderEnabled ? (
              <>
                <Text style={[styles.reminderText, { color: colors.success ?? colors.primary }]}>
                  Reminder Set
                </Text>
                <Text style={{ fontSize: 11, color: colors.success ?? colors.primary }}> ✓</Text>
              </>
            ) : (
              <Text style={[styles.reminderText, { color: colors.mutedForeground }]}>
                Enable Reminder
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  prayerName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
    lineHeight: 32,
  },
  subtext: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  right: {
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emoji: {
    fontSize: 26,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface PrayerTime {
  name: string;
  arabic: string;
  hours: number;
  minutes: number;
}

// Static prayer times — realistic for a mid-latitude location
const PRAYER_TIMES: PrayerTime[] = [
  { name: 'Fajr',    arabic: 'الفجر',   hours: 5,  minutes: 17 },
  { name: 'Dhuhr',   arabic: 'الظهر',   hours: 12, minutes: 15 },
  { name: 'Asr',     arabic: 'العصر',   hours: 15, minutes: 48 },
  { name: 'Maghrib', arabic: 'المغرب',  hours: 18, minutes: 42 },
  { name: 'Isha',    arabic: 'العشاء',  hours: 20, minutes: 9  },
];

function formatTime(h: number, m: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function formatCountdown(totalMinutes: number): string {
  if (totalMinutes <= 0) return 'Now';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min${m !== 1 ? 's' : ''}`;
  if (m === 0) return `${h} hr${h !== 1 ? 's' : ''}`;
  return `${h} hr${h !== 1 ? 's' : ''} ${m} min${m !== 1 ? 's' : ''}`;
}

interface NextPrayer {
  prayer: PrayerTime;
  minutesLeft: number;
  isImminent: boolean; // < 30 mins
}

function getNextPrayer(now: Date): NextPrayer {
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const remaining = PRAYER_TIMES.map(p => {
    const pMins = p.hours * 60 + p.minutes;
    const diff = pMins > nowMins ? pMins - nowMins : 24 * 60 - nowMins + pMins;
    return { prayer: p, minutesLeft: diff };
  });
  remaining.sort((a, b) => a.minutesLeft - b.minutesLeft);
  const next = remaining[0]!;
  return { ...next, isImminent: next.minutesLeft <= 30 };
}

export default function UpcomingPrayerCard() {
  const colors = useColors();
  const [now, setNow] = useState(new Date());

  // Refresh every 30 seconds so the countdown stays accurate
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const { prayer, minutesLeft, isImminent } = getNextPrayer(now);
  const accentColor = isImminent ? colors.warning : colors.primary;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isImminent ? colors.warning + '60' : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>Next Prayer</Text>
        </View>
        {isImminent && (
          <View style={[styles.imminentBadge, { backgroundColor: colors.warning + '20' }]}>
            <Text style={[styles.imminentText, { color: colors.warning }]}>Soon</Text>
          </View>
        )}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Prayer name + time */}
        <View style={styles.prayerInfo}>
          <Text style={[styles.arabicName, { color: accentColor }]}>{prayer.arabic}</Text>
          <Text style={[styles.prayerName, { color: colors.foreground }]}>{prayer.name}</Text>
          <Text style={[styles.prayerTime, { color: colors.mutedForeground }]}>
            {formatTime(prayer.hours, prayer.minutes)}
          </Text>
        </View>

        {/* Vertical divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <View
            style={[
              styles.countdownIcon,
              { backgroundColor: accentColor + '15', borderColor: accentColor + '30' },
            ]}
          >
            <Ionicons name="time-outline" size={20} color={accentColor} />
          </View>
          <Text style={[styles.countdownValue, { color: accentColor }]}>
            {formatCountdown(minutesLeft)}
          </Text>
          <Text style={[styles.countdownLabel, { color: colors.mutedForeground }]}>
            remaining
          </Text>
        </View>
      </View>

      {/* Prayer dots — show progress through the day */}
      <View style={styles.dotsRow}>
        {PRAYER_TIMES.map((p, i) => {
          const pMins = p.hours * 60 + p.minutes;
          const nowMins = now.getHours() * 60 + now.getMinutes();
          const isPast = pMins < nowMins;
          const isNext = p.name === prayer.name;
          return (
            <View key={p.name} style={styles.dotItem}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isPast
                      ? colors.primary
                      : isNext
                      ? accentColor
                      : colors.border,
                    width: isNext ? 10 : 6,
                    height: isNext ? 10 : 6,
                    borderRadius: isNext ? 5 : 3,
                  },
                ]}
              />
              <Text style={[styles.dotLabel, { color: isNext ? accentColor : colors.mutedForeground }]}>
                {p.name.substring(0, 3)}
              </Text>
            </View>
          );
        })}
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  imminentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  imminentText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prayerInfo: {
    flex: 1,
  },
  arabicName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  prayerName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  prayerTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 64,
    marginHorizontal: 18,
  },
  countdownContainer: {
    flex: 1,
    alignItems: 'center',
  },
  countdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  countdownValue: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  countdownLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  dotItem: {
    alignItems: 'center',
    gap: 5,
  },
  dot: {},
  dotLabel: {
    fontSize: 9,
    fontWeight: '500',
  },
});

import { PrayerName } from '@/types';

export interface PrayerTime {
  key: PrayerName;
  name: string;
  arabic: string;
  hours: number;
  minutes: number;
  emoji: string;
}

/** Static prayer times — single source of truth for all components. */
export const PRAYER_TIMES: PrayerTime[] = [
  { key: 'fajr',    name: 'Fajr',    arabic: 'الفجر',  hours: 5,  minutes: 17, emoji: '🌅' },
  { key: 'dhuhr',   name: 'Dhuhr',   arabic: 'الظهر',  hours: 12, minutes: 15, emoji: '☀️' },
  { key: 'asr',     name: 'Asr',     arabic: 'العصر',  hours: 15, minutes: 48, emoji: '🌤' },
  { key: 'maghrib', name: 'Maghrib', arabic: 'المغرب', hours: 18, minutes: 42, emoji: '🌇' },
  { key: 'isha',    name: 'Isha',    arabic: 'العشاء', hours: 20, minutes: 9,  emoji: '🌙' },
];

export function formatPrayerTime(h: number, m: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Short display string e.g. "5:17" used in the prayer tracker dots. */
export function formatPrayerTimeShort(h: number, m: number): string {
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${String(m).padStart(2, '0')}`;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type PrayerStatus = 'prayed' | 'masjid' | 'delayed' | 'missed';
export type WorkoutType = 'push' | 'pull' | 'legs' | 'cardio' | 'running' | 'walking' | 'sports';
export type GoalCategory = 'deen' | 'fitness' | 'career' | 'family' | 'marriage' | 'finance' | 'business' | 'character';
export type GoalType = 'daily' | 'weekly' | '90day' | 'longterm';
export type UserLevel = 'Builder' | 'Disciplined' | 'Consistent' | 'Leader' | 'Mentor';
export type AchievementLevel = 'bronze' | 'silver' | 'gold';

export interface PrayerLog {
  fajr: PrayerStatus | null;
  dhuhr: PrayerStatus | null;
  asr: PrayerStatus | null;
  maghrib: PrayerStatus | null;
  isha: PrayerStatus | null;
}

export interface DailyLog {
  date: string;
  prayers: PrayerLog;
  quranPages: number;
  quranMinutes: number;
  dhikrMorning: boolean;
  dhikrEvening: boolean;
  workoutDone: boolean;
  workoutType: WorkoutType | null;
  workoutMinutes: number;
  waterMl: number;
  sleepHours: number;
  caloriesKcal: number;
  proteinG: number;
  weightKg: number | null;
  tasbeehCount: number;
  islamicLearningMinutes: number;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  type: GoalType;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  level: AchievementLevel;
  unlockedAt: string | null;
}

export interface UserProfile {
  name: string;
  avatarUri: string | null;
  level: UserLevel;
  joinedAt: string;
}

export interface AppSettings {
  notifications: boolean;
  prayerReminders: boolean;
  language: 'en';
}

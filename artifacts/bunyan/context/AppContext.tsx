import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PrayerName, PrayerStatus, WorkoutType, DailyLog, Goal, Achievement,
  UserProfile, AppSettings, PrayerLog, UserLevel,
} from '@/types';
import { todayKey } from '@/utils/hijri';

const STORAGE_KEY = '@bunyan/state/v1';

function defaultPrayerLog(): PrayerLog {
  return { fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null };
}

export function defaultDailyLog(date: string): DailyLog {
  return {
    date,
    prayers: defaultPrayerLog(),
    quranPages: 0, quranMinutes: 0,
    dhikrMorning: false, dhikrEvening: false,
    workoutDone: false, workoutType: null, workoutMinutes: 0,
    waterMl: 0, sleepHours: 0,
    caloriesKcal: 0, proteinG: 0, weightKg: null,
    tasbeehCount: 0, islamicLearningMinutes: 0,
  };
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_prayer', title: 'First Step', description: 'Log your first prayer', iconName: 'star-outline', level: 'bronze', unlockedAt: null },
  { id: 'perfect_day', title: 'Perfect Day', description: 'Complete all 5 prayers in one day', iconName: 'checkmark-circle-outline', level: 'silver', unlockedAt: null },
  { id: 'fajr_7', title: 'Fajr Warrior', description: 'Pray Fajr 7 days in a row', iconName: 'moon-outline', level: 'gold', unlockedAt: null },
  { id: 'quran_10', title: 'Quran Journey', description: 'Read 10 pages of Quran', iconName: 'book-outline', level: 'bronze', unlockedAt: null },
  { id: 'hydrated', title: 'Well Hydrated', description: 'Drink 2L of water in one day', iconName: 'water-outline', level: 'bronze', unlockedAt: null },
  { id: 'first_workout', title: 'Iron Will', description: 'Complete your first workout', iconName: 'barbell-outline', level: 'bronze', unlockedAt: null },
  { id: 'dhikr_complete', title: 'Remembrance', description: 'Complete both morning & evening adhkar', iconName: 'heart-outline', level: 'bronze', unlockedAt: null },
  { id: 'scholar_60', title: 'Seeker of Knowledge', description: 'Log 60 minutes of Islamic learning', iconName: 'library-outline', level: 'silver', unlockedAt: null },
  { id: 'prayer_streak_7', title: '7-Day Streak', description: 'Pray all prayers for 7 consecutive days', iconName: 'flame-outline', level: 'gold', unlockedAt: null },
  { id: 'quran_20', title: 'First Juz', description: 'Read 20 pages of Quran total', iconName: 'book', level: 'silver', unlockedAt: null },
];

const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'Pray all 5 prayers', category: 'deen', target: 5, current: 0, unit: 'prayers', deadline: '', type: 'daily', createdAt: new Date().toISOString() },
  { id: 'g2', title: 'Read Quran daily', category: 'deen', target: 2, current: 0, unit: 'pages', deadline: '', type: 'daily', createdAt: new Date().toISOString() },
  { id: 'g3', title: 'Stay hydrated', category: 'fitness', target: 2000, current: 0, unit: 'ml', deadline: '', type: 'daily', createdAt: new Date().toISOString() },
  { id: 'g4', title: 'Workout 3x per week', category: 'fitness', target: 3, current: 0, unit: 'sessions', deadline: '', type: 'weekly', createdAt: new Date().toISOString() },
];

interface AppState {
  profile: UserProfile;
  dailyLogs: Record<string, DailyLog>;
  goals: Goal[];
  achievements: Achievement[];
  settings: AppSettings;
}

const INITIAL_STATE: AppState = {
  profile: { name: 'Brother', avatarUri: null, level: 'Builder', joinedAt: new Date().toISOString() },
  dailyLogs: {},
  goals: INITIAL_GOALS,
  achievements: INITIAL_ACHIEVEMENTS,
  settings: { notifications: true, prayerReminders: true, language: 'en' },
};

interface AppContextValue {
  state: AppState;
  isLoading: boolean;
  getTodayLog: () => DailyLog;
  getWeeklyLogs: () => DailyLog[];
  calculateDailyScore: (log: DailyLog) => number;
  getPrayerStreak: () => number;
  getFajrStreak: () => number;
  getQuranStreak: () => number;
  getWorkoutStreak: () => number;
  getTotalStats: () => { totalPrayers: number; totalQuranPages: number; totalWorkouts: number; totalWaterLiters: number };
  logPrayer: (prayer: PrayerName, status: PrayerStatus) => Promise<void>;
  logQuran: (pages: number, minutes: number) => Promise<void>;
  toggleDhikr: (type: 'morning' | 'evening') => Promise<void>;
  setTasbeeh: (count: number) => Promise<void>;
  logWorkout: (type: WorkoutType, minutes: number) => Promise<void>;
  addWater: (ml: number) => Promise<void>;
  logSleep: (hours: number) => Promise<void>;
  logNutrition: (calories: number, protein: number, weight?: number) => Promise<void>;
  logLearning: (minutes: number) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoalProgress: (id: string, current: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function computeLevel(totalPrayers: number): UserLevel {
  if (totalPrayers >= 1825) return 'Mentor';
  if (totalPrayers >= 365) return 'Leader';
  if (totalPrayers >= 100) return 'Consistent';
  if (totalPrayers >= 30) return 'Disciplined';
  return 'Builder';
}

function checkAchievements(s: AppState, fajrStreak: number, prayerStreak: number): AppState {
  const logs = Object.values(s.dailyLogs);
  const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const totalQuranPages = logs.reduce((sum, l) => sum + l.quranPages, 0);
  const totalLearning = logs.reduce((sum, l) => sum + l.islamicLearningMinutes, 0);

  const updated = s.achievements.map(a => {
    if (a.unlockedAt) return a;
    let unlock = false;
    switch (a.id) {
      case 'first_prayer':
        unlock = logs.some(l => Object.values(l.prayers).some(s => s !== null));
        break;
      case 'perfect_day':
        unlock = logs.some(l => prayers.every(p => l.prayers[p] === 'prayed' || l.prayers[p] === 'masjid'));
        break;
      case 'fajr_7':
        unlock = fajrStreak >= 7;
        break;
      case 'prayer_streak_7':
        unlock = prayerStreak >= 7;
        break;
      case 'quran_10':
        unlock = totalQuranPages >= 10;
        break;
      case 'quran_20':
        unlock = totalQuranPages >= 20;
        break;
      case 'hydrated':
        unlock = logs.some(l => l.waterMl >= 2000);
        break;
      case 'first_workout':
        unlock = logs.some(l => l.workoutDone);
        break;
      case 'dhikr_complete':
        unlock = logs.some(l => l.dhikrMorning && l.dhikrEvening);
        break;
      case 'scholar_60':
        unlock = totalLearning >= 60;
        break;
    }
    return unlock ? { ...a, unlockedAt: new Date().toISOString() } : a;
  });
  return { ...s, achievements: updated };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Track whether hydration has finished so in-flight mutations can be safely merged
  const hydratedRef = React.useRef(false);
  const pendingMutations = React.useRef<Array<(s: AppState) => AppState>>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(json => {
      if (json) {
        try {
          const saved = JSON.parse(json) as AppState;
          setState(() => {
            // Start from saved state and replay any mutations that arrived during hydration
            const base: AppState = {
              ...INITIAL_STATE,
              ...saved,
              achievements: saved.achievements?.length ? saved.achievements : INITIAL_ACHIEVEMENTS,
              goals: saved.goals?.length ? saved.goals : INITIAL_GOALS,
            };
            return pendingMutations.current.reduce((s, fn) => fn(s), base);
          });
        } catch (_) { /* ignore parse errors — start fresh */ }
      }
      pendingMutations.current = [];
      hydratedRef.current = true;
      setIsLoading(false);
    });
  }, []);

  const persist = useCallback((s: AppState) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }, []);

  const update = useCallback((updater: (prev: AppState) => AppState) => {
    if (!hydratedRef.current) {
      // Hydration not yet complete — queue the mutation so it is replayed
      // onto the restored state once AsyncStorage resolves.
      pendingMutations.current.push(updater);
    }
    setState(prev => {
      const next = updater(prev);
      // Only persist once hydration is done to avoid writing partial state
      if (hydratedRef.current) persist(next);
      return next;
    });
  }, [persist]);

  const updateTodayLog = useCallback((updater: (log: DailyLog) => DailyLog) => {
    const key = todayKey();
    update(prev => {
      const log = updater(prev.dailyLogs[key] ?? defaultDailyLog(key));
      const nextState = { ...prev, dailyLogs: { ...prev.dailyLogs, [key]: log } };
      // Recalculate level
      const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      const total = Object.values(nextState.dailyLogs).reduce((sum, l) =>
        sum + prayers.filter(p => l.prayers[p] === 'prayed' || l.prayers[p] === 'masjid').length, 0);
      const level = computeLevel(total);
      return { ...nextState, profile: { ...nextState.profile, level } };
    });
  }, [update]);

  const getTodayLog = useCallback((): DailyLog => {
    const key = todayKey();
    return state.dailyLogs[key] ?? defaultDailyLog(key);
  }, [state.dailyLogs]);

  const getWeeklyLogs = useCallback((): DailyLog[] => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      return state.dailyLogs[key] ?? defaultDailyLog(key);
    });
  }, [state.dailyLogs]);

  const calculateDailyScore = useCallback((log: DailyLog): number => {
    let score = 0;
    const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    for (const p of prayers) {
      const s = log.prayers[p];
      if (s === 'prayed' || s === 'masjid') score += 8;
      else if (s === 'delayed') score += 4;
    }
    if (log.quranPages >= 4) score += 15;
    else if (log.quranPages > 0) score += (log.quranPages / 4) * 15;
    if (log.dhikrMorning) score += 7.5;
    if (log.dhikrEvening) score += 7.5;
    if (log.workoutDone) score += 15;
    if (log.waterMl >= 2000) score += 10;
    else if (log.waterMl > 0) score += (log.waterMl / 2000) * 10;
    if (log.sleepHours >= 7) score += 5;
    return Math.min(Math.round(score), 100);
  }, []);

  const getPrayerStreak = useCallback((): number => {
    const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const log = state.dailyLogs[key];
      if (!log) break;
      if (prayers.every(p => log.prayers[p] === 'prayed' || log.prayers[p] === 'masjid')) streak++;
      else break;
    }
    return streak;
  }, [state.dailyLogs]);

  const getFajrStreak = useCallback((): number => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const log = state.dailyLogs[key];
      if (!log) break;
      if (log.prayers.fajr === 'prayed' || log.prayers.fajr === 'masjid') streak++;
      else break;
    }
    return streak;
  }, [state.dailyLogs]);

  const getQuranStreak = useCallback((): number => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const log = state.dailyLogs[key];
      if (!log) break;
      if (log.quranPages > 0) streak++;
      else break;
    }
    return streak;
  }, [state.dailyLogs]);

  const getWorkoutStreak = useCallback((): number => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const log = state.dailyLogs[key];
      if (!log) break;
      if (log.workoutDone) streak++;
      else break;
    }
    return streak;
  }, [state.dailyLogs]);

  const getTotalStats = useCallback(() => {
    const logs = Object.values(state.dailyLogs);
    const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    return {
      totalPrayers: logs.reduce((sum, l) => sum + prayers.filter(p => l.prayers[p] === 'prayed' || l.prayers[p] === 'masjid').length, 0),
      totalQuranPages: logs.reduce((sum, l) => sum + l.quranPages, 0),
      totalWorkouts: logs.filter(l => l.workoutDone).length,
      totalWaterLiters: Math.round(logs.reduce((sum, l) => sum + l.waterMl, 0) / 1000 * 10) / 10,
    };
  }, [state.dailyLogs]);

  const logPrayer = useCallback(async (prayer: PrayerName, status: PrayerStatus) => {
    updateTodayLog(log => ({ ...log, prayers: { ...log.prayers, [prayer]: status } }));
  }, [updateTodayLog]);

  const logQuran = useCallback(async (pages: number, minutes: number) => {
    updateTodayLog(log => ({ ...log, quranPages: log.quranPages + pages, quranMinutes: log.quranMinutes + minutes }));
  }, [updateTodayLog]);

  const toggleDhikr = useCallback(async (type: 'morning' | 'evening') => {
    updateTodayLog(log => ({
      ...log,
      dhikrMorning: type === 'morning' ? !log.dhikrMorning : log.dhikrMorning,
      dhikrEvening: type === 'evening' ? !log.dhikrEvening : log.dhikrEvening,
    }));
  }, [updateTodayLog]);

  const setTasbeeh = useCallback(async (count: number) => {
    updateTodayLog(log => ({ ...log, tasbeehCount: count }));
  }, [updateTodayLog]);

  const logWorkout = useCallback(async (type: WorkoutType, minutes: number) => {
    updateTodayLog(log => ({ ...log, workoutDone: true, workoutType: type, workoutMinutes: log.workoutMinutes + minutes }));
  }, [updateTodayLog]);

  const addWater = useCallback(async (ml: number) => {
    updateTodayLog(log => ({ ...log, waterMl: log.waterMl + ml }));
  }, [updateTodayLog]);

  const logSleep = useCallback(async (hours: number) => {
    updateTodayLog(log => ({ ...log, sleepHours: hours }));
  }, [updateTodayLog]);

  const logNutrition = useCallback(async (calories: number, protein: number, weight?: number) => {
    updateTodayLog(log => ({ ...log, caloriesKcal: calories, proteinG: protein, weightKg: weight ?? log.weightKg }));
  }, [updateTodayLog]);

  const logLearning = useCallback(async (minutes: number) => {
    updateTodayLog(log => ({ ...log, islamicLearningMinutes: log.islamicLearningMinutes + minutes }));
  }, [updateTodayLog]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    update(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }));
  }, [update]);

  const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    update(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
  }, [update]);

  const updateGoalProgress = useCallback(async (id: string, current: number) => {
    update(prev => ({ ...prev, goals: prev.goals.map(g => g.id === id ? { ...g, current } : g) }));
  }, [update]);

  const deleteGoal = useCallback(async (id: string) => {
    update(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  }, [update]);

  const value: AppContextValue = {
    state, isLoading,
    getTodayLog, getWeeklyLogs, calculateDailyScore,
    getPrayerStreak, getFajrStreak, getQuranStreak, getWorkoutStreak, getTotalStats,
    logPrayer, logQuran, toggleDhikr, setTasbeeh, logWorkout, addWater, logSleep,
    logNutrition, logLearning, updateProfile, addGoal, updateGoalProgress, deleteGoal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

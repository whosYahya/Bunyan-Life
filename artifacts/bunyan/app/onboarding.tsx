/**
 * OnboardingScreen — 6-slide horizontal pager for first-time users.
 *
 * Navigation:
 *   Continue → next slide
 *   Skip     → jump to last slide (slide 6)
 *   Slide 6: "Create My Account" → completeOnboarding() + /register
 *   Slide 6: "I already have an account" → completeOnboarding() + /login
 *
 * On either final action, hasCompletedOnboarding is set to true so the
 * onboarding is never shown again (even after logout).
 */

import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import OnboardingCard, { SlideData } from '@/components/onboarding/OnboardingCard';
import ProgressDots from '@/components/onboarding/ProgressDots';
import SkipButton from '@/components/onboarding/SkipButton';
import ContinueButton from '@/components/onboarding/ContinueButton';

const { width: W } = Dimensions.get('window');

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES: SlideData[] = [
  {
    id: '1',
    line1: 'Welcome to Bunyan',
    arabicAccent: 'مرحباً بك',
    subtitle:
      'Your Personal Operating System for Muslim Men — track Deen, Health, and Growth in one place.',
    iconName: 'home-outline',
    iconColor: '#1A6B45',
    glowColor: '#1A6B45',
    satellites: [
      { icon: 'moon-outline', angle: -45, color: '#C9A84C' },
      { icon: 'barbell-outline', angle: 30, color: '#3B82F6' },
      { icon: 'book-outline', angle: 135, color: '#22C55E' },
      { icon: 'heart-outline', angle: 210, color: '#EF4444' },
    ],
  },
  {
    id: '2',
    line1: 'Your Faith,',
    line2: 'Your Foundation',
    subtitle:
      'Log all 5 daily prayers, track Quran recitation, morning & evening adhkar, and Islamic learning — with reminders that respect your schedule.',
    iconName: 'moon-outline',
    iconColor: '#7C3AED',
    glowColor: '#7C3AED',
    satellites: [
      { icon: 'star-outline', angle: -40, color: '#C9A84C' },
      { icon: 'book-outline', angle: 50, color: '#22C55E' },
      { icon: 'alarm-outline', angle: 180, color: '#F59E0B' },
    ],
  },
  {
    id: '3',
    line1: 'Strengthen',
    line2: 'Every Dimension',
    subtitle:
      'Track water intake, workouts, sleep, nutrition, and weight. A strong body supports a strong spirit — your health is an amanah.',
    iconName: 'barbell-outline',
    iconColor: '#3B82F6',
    glowColor: '#3B82F6',
    satellites: [
      { icon: 'water-outline', angle: -50, color: '#06B6D4' },
      { icon: 'moon-outline', angle: 40, color: '#A78BFA' },
      { icon: 'nutrition-outline', angle: 160, color: '#22C55E' },
      { icon: 'heart-outline', angle: 240, color: '#EF4444' },
    ],
  },
  {
    id: '4',
    line1: 'Goals Aligned',
    line2: 'With Your Values',
    subtitle:
      'Set daily and long-term goals grounded in Islamic principles. Visualise your progress and celebrate every step of growth.',
    iconName: 'flag-outline',
    iconColor: '#C9A84C',
    glowColor: '#C9A84C',
    satellites: [
      { icon: 'trending-up-outline', angle: -35, color: '#22C55E' },
      { icon: 'checkmark-circle-outline', angle: 55, color: '#3B82F6' },
      { icon: 'ribbon-outline', angle: 200, color: '#F59E0B' },
    ],
  },
  {
    id: '5',
    line1: 'Rise Together',
    line2: 'In Silence',
    subtitle:
      'Your journey is personal. Bunyan helps you build discipline quietly — no social comparison, no performance. Just you and Allah.',
    iconName: 'person-outline',
    iconColor: '#10B981',
    glowColor: '#10B981',
    satellites: [
      { icon: 'shield-checkmark-outline', angle: -45, color: '#3B82F6' },
      { icon: 'eye-off-outline', angle: 45, color: '#6B7280' },
      { icon: 'lock-closed-outline', angle: 180, color: '#C9A84C' },
    ],
  },
  {
    id: '6',
    line1: 'Your Data.',
    line2: 'Your Amanah.',
    subtitle:
      'Everything stays on your device. No third-party tracking, no data selling — ever. Your personal records are a trust, and we honour that.',
    iconName: 'shield-checkmark-outline',
    iconColor: '#1A6B45',
    glowColor: '#1A6B45',
    satellites: [
      { icon: 'lock-closed-outline', angle: -40, color: '#C9A84C' },
      { icon: 'eye-off-outline', angle: 50, color: '#3B82F6' },
      { icon: 'server-outline', angle: 190, color: '#6B7280' },
    ],
  },
];

const LAST = SLIDES.length - 1;

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding } = useApp();

  const flatListRef = useRef<FlatList<SlideData>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollTo = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleContinue = () => {
    if (currentIndex < LAST) scrollTo(currentIndex + 1);
  };

  const handleSkip = () => scrollTo(LAST);

  const handleCreateAccount = async () => {
    await completeOnboarding();
    router.replace('/register');
  };

  const handleAlreadyHaveAccount = async () => {
    await completeOnboarding();
    router.replace('/login');
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLast = currentIndex === LAST;
  const isFirst = currentIndex === 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={s => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => <OnboardingCard slide={item} />}
        getItemLayout={(_, index) => ({ length: W, offset: W * index, index })}
        style={{ flex: 1 }}
      />

      <View
        style={[
          styles.chrome,
          { paddingBottom: insets.bottom + (Platform.OS === 'android' ? 16 : 12) },
        ]}
      >
        <View style={styles.dotRow}>
          <ProgressDots total={SLIDES.length} current={currentIndex} />
          {!isFirst && !isLast && <SkipButton onPress={handleSkip} />}
        </View>

        {isLast ? (
          <View style={styles.finalButtons}>
            <ContinueButton
              label="Create My Account"
              onPress={handleCreateAccount}
              icon="person-add-outline"
              primaryColor="#1A6B45"
            />
            <ContinueButton
              label="I already have an account"
              onPress={handleAlreadyHaveAccount}
              variant="secondary"
            />
          </View>
        ) : (
          <ContinueButton
            label={isFirst ? 'Get Started' : 'Continue'}
            onPress={handleContinue}
            icon={isFirst ? 'arrow-forward-outline' : undefined}
            primaryColor="#1A6B45"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D3D29',
  },
  chrome: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  finalButtons: {
    gap: 10,
  },
});

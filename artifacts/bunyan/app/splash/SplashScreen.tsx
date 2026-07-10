/**
 * BunyanSplash — Full-screen animated launch overlay.
 *
 * Shows for a minimum of 2 500 ms while the app hydrates from AsyncStorage.
 * Once BOTH the min-time has elapsed AND isAppReady is true, it fades out
 * and calls onDone so the caller can perform routing.
 *
 * Used by _layout.tsx as a position:absolute overlay so the navigation
 * stack is already rendered (and navigable) beneath it.
 */

import React, { useEffect, useRef } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

const BG = '#0D3D29';
const ACCENT = '#C9A84C';

/** Subtle interlocking-circles Islamic geometric background */
function GeometricPattern() {
  const r = 44;
  const spacing = r * 1.73; // √3 × r for hexagonal grid
  const cols = Math.ceil(W / spacing) + 3;
  const rows = Math.ceil(H / spacing) + 3;

  const nodes: { x: number; y: number; k: string }[] = [];
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2;
      nodes.push({
        x: col * spacing + offset,
        y: row * spacing * 0.87,
        k: `${row}-${col}`,
      });
    }
  }

  return (
    <Svg
      width={W}
      height={H}
      style={StyleSheet.absoluteFillObject}
      pointerEvents="none"
    >
      {nodes.map(n => (
        <Circle
          key={n.k}
          cx={n.x}
          cy={n.y}
          r={r}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={0.6}
          opacity={0.07}
        />
      ))}
    </Svg>
  );
}

interface Props {
  isAppReady: boolean;
  onDone: () => void;
}

export default function BunyanSplash({ isAppReady, onDone }: Props) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.82);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);

  const timerDoneRef = useRef(false);
  const isAppReadyRef = useRef(isAppReady);
  const finishedRef = useRef(false);

  // Keep ref current so timer callback always sees latest prop
  useEffect(() => {
    isAppReadyRef.current = isAppReady;
  }, [isAppReady]);

  const doFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    overlayOpacity.value = withTiming(0, { duration: 450 }, () => {
      runOnJS(onDone)();
    });
  };

  // Animate in + start minimum-time guard
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 650 });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 95 });
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 700 }));
    subtitleOpacity.value = withDelay(550, withTiming(1, { duration: 700 }));

    const t = setTimeout(() => {
      timerDoneRef.current = true;
      if (isAppReadyRef.current) doFinish();
    }, 2600);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the app finishes hydrating AFTER the timer
  useEffect(() => {
    if (isAppReady && timerDoneRef.current) doFinish();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAppReady]);

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, styles.root, { opacity: overlayOpacity }]}>
      <GeometricPattern />

      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoBg}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.View style={[styles.textBlock, { opacity: titleOpacity }]}>
        <Text style={styles.arabicName}>بنيان</Text>
        <Text style={styles.latinName}>BUNYAN</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text style={styles.tagline}>Build Yourself. Strengthen the Ummah.</Text>
      </Animated.View>

      {/* Gold accent line */}
      <Animated.View style={[styles.accentLine, { opacity: subtitleOpacity }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
    gap: 0,
  },
  logoWrap: {
    marginBottom: 28,
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: '#1A6B45',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A6B45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  logoImg: {
    width: 68,
    height: 68,
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 14,
  },
  arabicName: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 52,
  },
  latinName: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
    letterSpacing: 6,
    marginTop: 2,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  accentLine: {
    position: 'absolute',
    bottom: 60,
    width: 48,
    height: 2,
    borderRadius: 1,
    backgroundColor: ACCENT,
    opacity: 0.5,
  },
});

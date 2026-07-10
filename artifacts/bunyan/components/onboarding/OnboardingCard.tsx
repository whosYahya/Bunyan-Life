/**
 * OnboardingCard — A single full-screen onboarding slide.
 *
 * Each slide has:
 *   • A large illustrated "hero" area (icon + colored glow)
 *   • Headline (split into line1 / line2 for two-line titles)
 *   • Subtitle description
 *
 * Styling is self-contained; the parent OnboardingScreen handles
 * navigation chrome (dots, buttons).
 */

import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

export interface SlideData {
  id: string;
  line1: string;
  line2?: string;
  arabicAccent?: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  glowColor: string;
  /** Extra decorative icons shown around the main icon */
  satellites?: { icon: keyof typeof Ionicons.glyphMap; angle: number; color: string }[];
}

const { width: W, height: H } = Dimensions.get('window');
const HERO_SIZE = W * 0.72;

/** Radial glow ring drawn with SVG */
function GlowRing({ color }: { color: string }) {
  const s = HERO_SIZE;
  return (
    <Svg width={s} height={s} style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Circle cx={s / 2} cy={s / 2} r={s * 0.44} fill={color} opacity={0.08} />
      <Circle cx={s / 2} cy={s / 2} r={s * 0.34} fill={color} opacity={0.09} />
      <Circle cx={s / 2} cy={s / 2} r={s * 0.22} fill={color} opacity={0.12} />
    </Svg>
  );
}

/** Small satellite icons arranged around the main icon */
function Satellites({
  items,
}: {
  items: NonNullable<SlideData['satellites']>;
}) {
  return (
    <>
      {items.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const r = HERO_SIZE * 0.31;
        const cx = HERO_SIZE / 2 + r * Math.cos(rad) - 16;
        const cy = HERO_SIZE / 2 + r * Math.sin(rad) - 16;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: s.color + '22',
              borderWidth: 1,
              borderColor: s.color + '40',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={s.icon} size={16} color={s.color} />
          </View>
        );
      })}
    </>
  );
}

interface Props {
  slide: SlideData;
}

export default function OnboardingCard({ slide }: Props) {
  return (
    <View style={[styles.root, { width: W }]}>
      {/* Hero illustration */}
      <View style={styles.heroWrap}>
        <GlowRing color={slide.glowColor} />
        {/* Outer decorative ring */}
        <Svg
          width={HERO_SIZE}
          height={HERO_SIZE}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        >
          <Circle
            cx={HERO_SIZE / 2}
            cy={HERO_SIZE / 2}
            r={HERO_SIZE * 0.46}
            fill="none"
            stroke={slide.glowColor}
            strokeWidth={1}
            opacity={0.25}
            strokeDasharray="4 8"
          />
        </Svg>

        {/* Satellite icons */}
        {slide.satellites && <Satellites items={slide.satellites} />}

        {/* Central icon bubble */}
        <View style={[styles.iconBubble, { backgroundColor: slide.glowColor + '20', borderColor: slide.glowColor + '40' }]}>
          <View style={[styles.iconInner, { backgroundColor: slide.glowColor }]}>
            <Ionicons name={slide.iconName} size={42} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Text block */}
      <View style={styles.textBlock}>
        {slide.arabicAccent ? (
          <Text style={styles.arabicAccent}>{slide.arabicAccent}</Text>
        ) : null}
        <Text style={styles.headline}>{slide.line1}</Text>
        {slide.line2 ? (
          <Text style={[styles.headline, styles.headlineLine2]}>{slide.line2}</Text>
        ) : null}
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  heroWrap: {
    width: HERO_SIZE,
    height: HERO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  iconBubble: {
    width: 110,
    height: 110,
    borderRadius: 34,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 86,
    height: 86,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  textBlock: {
    alignItems: 'center',
    gap: 4,
  },
  arabicAccent: {
    fontSize: 15,
    color: '#C9A84C',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  headlineLine2: {
    color: '#C9A84C',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.58)',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 300,
  },
});

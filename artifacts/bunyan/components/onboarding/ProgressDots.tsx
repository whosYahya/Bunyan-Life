import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface Props {
  total: number;
  current: number;
  activeColor?: string;
  inactiveColor?: string;
}

export default function ProgressDots({
  total,
  current,
  activeColor = '#C9A84C',
  inactiveColor = 'rgba(255,255,255,0.25)',
}: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      {Array.from({ length: total }).map((_, i) => (
        <AnimatedDot
          key={i}
          active={i === current}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      ))}
    </View>
  );
}

function AnimatedDot({
  active,
  activeColor,
  inactiveColor,
}: {
  active: boolean;
  activeColor: string;
  inactiveColor: string;
}) {
  const style = useAnimatedStyle(() => ({
    width: withSpring(active ? 22 : 7, { damping: 12, stiffness: 120 }),
    height: 7,
    borderRadius: 3.5,
    backgroundColor: active ? activeColor : inactiveColor,
  }));

  return <Animated.View style={style} />;
}

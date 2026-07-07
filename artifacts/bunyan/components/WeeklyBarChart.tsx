import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  maxValue?: number;
  color?: string;
  height?: number;
}

// Extracted to avoid useAnimatedStyle in a loop
function BarItem({
  value,
  maxValue,
  color,
  isToday,
}: {
  value: number;
  maxValue: number;
  color: string;
  isToday: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const target = maxValue > 0 ? value / maxValue : 0;
    progress.value = withSpring(target, { damping: 14, stiffness: 90 });
  }, [value, maxValue]);

  const animStyle = useAnimatedStyle(() => ({
    height: `${Math.max(progress.value * 100, progress.value > 0 ? 6 : 0)}%`,
  }));

  return (
    <View style={{ flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Animated.View
        style={[
          {
            width: '80%',
            borderRadius: 5,
            backgroundColor: isToday ? color : color + '70',
          },
          animStyle,
        ]}
      />
    </View>
  );
}

export default function WeeklyBarChart({ data, maxValue, color, height = 64 }: Props) {
  const colors = useColors();
  const barColor = color ?? colors.primary;
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1);
  const todayIdx = data.length - 1;

  return (
    <View>
      <View style={{ height, flexDirection: 'row', gap: 4, alignItems: 'flex-end' }}>
        {data.map((item, i) => (
          <BarItem
            key={i}
            value={item.value}
            maxValue={max}
            color={barColor}
            isToday={i === todayIdx}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
        {data.map((item, i) => (
          <Text
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 10,
              color: i === todayIdx ? colors.primary : colors.mutedForeground,
              fontWeight: i === todayIdx ? '600' : '400',
            }}
          >
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

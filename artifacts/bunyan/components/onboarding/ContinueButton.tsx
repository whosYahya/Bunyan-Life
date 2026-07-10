import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  primaryColor?: string;
  textColor?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ContinueButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  primaryColor = '#1A6B45',
  textColor,
}: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 200 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const bg =
    variant === 'primary'
      ? primaryColor
      : variant === 'secondary'
      ? 'rgba(255,255,255,0.12)'
      : 'transparent';

  const border =
    variant === 'secondary' ? 'rgba(255,255,255,0.25)' : 'transparent';

  const fc =
    textColor ??
    (variant === 'primary'
      ? '#FFFFFF'
      : variant === 'secondary'
      ? 'rgba(255,255,255,0.85)'
      : 'rgba(255,255,255,0.55)');

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      disabled={loading}
      style={[
        animStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 16,
          paddingHorizontal: 28,
          borderRadius: 16,
          backgroundColor: bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: border,
          minHeight: 54,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fc} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={fc} />}
          <Text style={{ fontSize: 16, fontWeight: '700', color: fc, letterSpacing: 0.1 }}>
            {label}
          </Text>
        </>
      )}
    </AnimatedTouchable>
  );
}

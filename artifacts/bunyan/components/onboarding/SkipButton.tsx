import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface Props {
  onPress: () => void;
  color?: string;
}

export default function SkipButton({ onPress, color = 'rgba(255,255,255,0.45)' }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 16, right: 16 }}
      style={{ paddingHorizontal: 4, paddingVertical: 6 }}
    >
      <Text style={{ fontSize: 14, fontWeight: '600', color }}>Skip</Text>
    </TouchableOpacity>
  );
}

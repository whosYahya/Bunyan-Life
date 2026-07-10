import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface Props {
  name: string;
  dateStr: string;
  hijriStr: string;
  onNotificationPress?: () => void;
}

/**
 * Greeting component — shows the Islamic greeting السلام عليكم,
 * the user's name, and the current Gregorian + Hijri date.
 */
export default function Greeting({ name, dateStr, hijriStr, onNotificationPress }: Props) {
  const colors = useColors();

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <View style={{ flex: 1 }}>
        {/* Islamic greeting — elegant, not bold, slightly smaller than name */}
        <Text
          style={{
            fontSize: 17,
            color: colors.primary,
            fontStyle: 'italic',
            marginBottom: 3,
            letterSpacing: 0.3,
          }}
        >
          السلام عليكم
        </Text>

        {/* User name */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: colors.foreground,
            letterSpacing: -0.5,
          }}
        >
          {name}
        </Text>

        {/* Date row */}
        <Text
          style={{
            fontSize: 12,
            color: colors.mutedForeground,
            marginTop: 4,
          }}
        >
          {dateStr}{'  ·  '}{hijriStr}
        </Text>
      </View>

      {/* Notification bell */}
      <TouchableOpacity
        onPress={onNotificationPress}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.secondary,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
      </TouchableOpacity>
    </View>
  );
}

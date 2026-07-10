import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { loginAsGuest } = useApp();

  const handleGoogle = () => {
    Alert.alert(
      'Coming Soon',
      'Google sign-in will be available in the next update. Continue as Guest for now.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue as Guest', onPress: handleGuest },
      ]
    );
  };

  const handleApple = () => {
    Alert.alert(
      'Coming Soon',
      'Apple sign-in will be available in the next update. Continue as Guest for now.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue as Guest', onPress: handleGuest },
      ]
    );
  };

  const handleGuest = async () => {
    await loginAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
      {/* Logo area */}
      <View style={styles.logoSection}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.appName, { color: colors.foreground }]}>بنيان</Text>
        <Text style={[styles.appNameEn, { color: colors.primary }]}>BUNYAN</Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
          Build Yourself.{'\n'}Strengthen the Ummah.
        </Text>
      </View>

      {/* Auth buttons */}
      <View style={styles.buttonsSection}>
        {/* Google */}
        <TouchableOpacity
          onPress={handleGoogle}
          style={[styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <View style={[styles.socialIconBox, { backgroundColor: '#EA433510' }]}>
            <Ionicons name="logo-google" size={18} color="#EA4335" />
          </View>
          <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Continue with Google</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>

        {/* Apple — only shown on iOS */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            onPress={handleApple}
            style={[styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.8}
          >
            <View style={[styles.socialIconBox, { backgroundColor: colors.secondary }]}>
              <Ionicons name="logo-apple" size={18} color={colors.foreground} />
            </View>
            <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Continue with Apple</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}

        {/* Email */}
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          <Ionicons name="mail-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Continue with Email</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Guest */}
        <TouchableOpacity onPress={handleGuest} style={styles.guestBtn} activeOpacity={0.7}>
          <Text style={[styles.guestText, { color: colors.mutedForeground }]}>
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        By continuing, you agree to our{' '}
        <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms</Text>
        {' '}and{' '}
        <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  logo: {
    width: 96,
    height: 96,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 2,
  },
  appNameEn: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonsSection: {
    gap: 12,
    paddingBottom: 8,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  socialIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  guestText: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
    paddingTop: 8,
  },
});

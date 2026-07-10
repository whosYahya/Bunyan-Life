import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
  'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Karachi',
  'Asia/Riyadh', 'Asia/Dhaka', 'Asia/Jakarta', 'Asia/Kuala_Lumpur',
  'Africa/Cairo', 'Africa/Lagos', 'Australia/Sydney',
];

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim()) return Alert.alert('Missing field', 'Please enter your full name.');
    if (!email.trim()) return Alert.alert('Missing field', 'Please enter your email.');
    if (!password) return Alert.alert('Missing field', 'Please enter a password.');
    if (password.length < 6) return Alert.alert('Weak password', 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return Alert.alert('Password mismatch', 'Passwords do not match.');
    if (!agreedToTerms) return Alert.alert('Terms required', 'Please agree to the Terms & Privacy Policy.');

    setLoading(true);
    const { success, error } = await register({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration failed', error ?? 'Something went wrong. Please try again.');
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: colors.foreground,
    backgroundColor: colors.secondary,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.primary }]}>بسم الله</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Begin your journey of growth and discipline
          </Text>
        </View>

        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>FULL NAME</Text>
            <TextInput value={fullName} onChangeText={setFullName} placeholder="Your name" style={inputStyle} placeholderTextColor={colors.mutedForeground} />
          </View>

          {/* Username */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>USERNAME</Text>
            <TextInput value={username} onChangeText={setUsername} placeholder="@username" autoCapitalize="none" autoCorrect={false} style={inputStyle} placeholderTextColor={colors.mutedForeground} />
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>EMAIL</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={inputStyle} placeholderTextColor={colors.mutedForeground} />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>PASSWORD</Text>
            <View style={{ position: 'relative' }}>
              <TextInput value={password} onChangeText={setPassword} placeholder="Min 6 characters" secureTextEntry={!showPassword} style={[inputStyle, { paddingRight: 48 }]} placeholderTextColor={colors.mutedForeground} />
              <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>CONFIRM PASSWORD</Text>
            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat password" secureTextEntry style={inputStyle} placeholderTextColor={colors.mutedForeground} />
          </View>

          {/* Country (optional) */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>COUNTRY (OPTIONAL)</Text>
            <TextInput value={country} onChangeText={setCountry} placeholder="e.g. United States" style={inputStyle} placeholderTextColor={colors.mutedForeground} />
          </View>

          {/* Timezone */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>TIMEZONE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {TIMEZONES.slice(0, 8).map(tz => (
                <TouchableOpacity
                  key={tz}
                  onPress={() => setTimezone(tz)}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
                    backgroundColor: timezone === tz ? colors.primary : colors.secondary,
                    borderWidth: 1, borderColor: timezone === tz ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: timezone === tz ? '#fff' : colors.foreground }}>
                    {tz.split('/').pop()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Terms */}
          <TouchableOpacity
            onPress={() => setAgreedToTerms(a => !a)}
            style={styles.termsRow}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              { borderColor: agreedToTerms ? colors.primary : colors.border, backgroundColor: agreedToTerms ? colors.primary : 'transparent' },
            ]}>
              {agreedToTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={[styles.termsText, { color: colors.mutedForeground }]}>
              I agree to the{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms</Text>
              {' '}&{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Create Account */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={[styles.registerBtn, { backgroundColor: loading ? colors.muted : colors.primary }]}
            activeOpacity={0.85}
          >
            {loading
              ? <Text style={styles.registerBtnText}>Creating account…</Text>
              : <>
                  <Ionicons name="person-add-outline" size={18} color="#fff" />
                  <Text style={styles.registerBtnText}>Create Account</Text>
                </>
            }
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: colors.mutedForeground }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: 32 },
  header: { marginBottom: 28 },
  greeting: { fontSize: 16, fontStyle: 'italic', marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  form: { gap: 16 },
  field: { gap: 8 },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8 },
  eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  termsText: { flex: 1, fontSize: 13, lineHeight: 20 },
  registerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8, marginTop: 8 },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 14, fontWeight: '700' },
});

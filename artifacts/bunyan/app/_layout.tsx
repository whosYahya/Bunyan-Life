import React, { useCallback, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider, useApp } from '@/context/AppContext';
import BunyanSplash from '@/app/splash/SplashScreen';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

/**
 * AuthGuard — wraps the navigation stack.
 *
 * Shows the custom Bunyan splash overlay (min 2.6 s) while AsyncStorage
 * hydrates. Once both the min-time guard AND hydration are complete, it
 * reads the app state and routes the user to the right place:
 *
 *   hasCompletedOnboarding == false  →  /onboarding
 *   isLoggedIn == false              →  /welcome
 *   otherwise                        →  stays on /(tabs)
 *
 * The children (the Stack) are always rendered beneath the overlay so
 * router.replace() works the moment we're ready to navigate.
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state, isLoading } = useApp();
  const router = useRouter();

  const [splashDone, setSplashDone] = useState(false);

  // Keep a ref so the splash callback always reads the latest state,
  // even though it is called asynchronously after 2.6 s.
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const handleSplashDone = useCallback(() => {
    setSplashDone(true);
    const s = stateRef.current;
    if (!s.hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else if (!s.auth.isAuthenticated) {
      router.replace('/welcome');
    }
    // else: user is authenticated → stay on /(tabs)
  }, [router]);

  return (
    <>
      {children}
      {!splashDone && (
        <BunyanSplash isAppReady={!isLoading} onDone={handleSplashDone} />
      )}
    </>
  );
}

function RootLayoutNav() {
  return (
    <AuthGuard>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)"     options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="welcome"    options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="login"      options={{ headerShown: false }} />
        <Stack.Screen name="register"   options={{ headerShown: false }} />
      </Stack>
    </AuthGuard>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProvider>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </AppProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

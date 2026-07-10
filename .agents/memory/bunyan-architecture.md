---
name: Bunyan App Architecture
description: Key decisions on layout, state, routing, and component structure for the Bunyan Expo app at artifacts/bunyan/
---

## Stack
- Expo Router v6, React Native 0.81, AsyncStorage (no Supabase/backend), React Context
- Reanimated 4, react-native-svg, Ionicons, Inter font
- No Victory Native — custom bar charts via Reanimated with each bar as a separate component

## Folder structure
- `app/` — Expo Router flat-file routes: `(tabs)/`, `welcome.tsx`, `login.tsx`, `register.tsx`, `onboarding.tsx`, `splash/SplashScreen.tsx`
- `components/` — Shared UI: `ProgressRing`, `Greeting`, `UpcomingPrayerCard`, `HadithCard`, `onboarding/` (ContinueButton, OnboardingCard, ProgressDots, SkipButton)
- `context/AppContext.tsx` — All state; includes auth + onboarding flags
- `assets/data/` — `ayahs.json` (12), `hadiths.json` (13)
- `utils/appState.ts` — Storage key constants
- `hooks/useAppInitialization.ts` — Returns `{ isReady, decision }` for post-splash routing

## Navigation / launch flow
- Native splash hidden on font load; immediately replaced by `BunyanSplash` overlay (absolute, z:9999)
- `AuthGuard` in `_layout.tsx` mounts the Stack under the overlay; after min 2.6s + hydration, calls `handleSplashDone`
- Post-splash routing: `!hasCompletedOnboarding` → `/onboarding`; else `!isAuthenticated` → `/welcome`; else stay on `/(tabs)`
- Logout routes to `/login` (NOT `/welcome` — `hasCompletedOnboarding` is preserved)
- `completeOnboarding()` called when user picks "Create Account" or "Already Have Account" on onboarding slide 6

## State decisions
- `hasCompletedOnboarding: boolean` in AppState (persisted with main `@bunyan/state/v1` key)
- `auth: { isAuthenticated, email, authType }` in AppState
- Credentials stored separately under `@bunyan/credentials/v1`
- Hydration-race fix: pre-hydration mutations queued in `pendingMutations` ref and replayed

## Tab bar
- ClassicTabLayout with 5 tabs + absolutely-positioned FAB + QuickLogModal bottom sheet
- NativeTabs rejected (too complex with 5 tabs + FAB)

## useColors() typing
- Access `colors.dark` / `colors.light` directly (not via unsafe cast)

## Onboarding
- 6 slides, horizontal FlatList with pagingEnabled (no extra package needed)
- Components live in `components/onboarding/` (NOT under `app/` to avoid Expo Router treating them as routes)
- Route file is flat `app/onboarding.tsx` (directory structure caused "No route named onboarding" warning)
- Slide 6: "Create My Account" + "I already have an account" — both call `completeOnboarding()` before navigating

## Profile screen dev tools
- "Reset Onboarding" button calls `resetOnboarding()` — sets `hasCompletedOnboarding = false`
- "Sign Out" button calls `logout()` then `router.replace('/login')`

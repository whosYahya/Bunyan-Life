---
name: Bunyan App Architecture
description: Key architectural decisions for the Bunyan Expo mobile app
---

## App: Bunyan (بنيان) — Personal Operating System for Muslim Men
Located at `artifacts/bunyan/`, slug `bunyan`, previewPath `/`.

## Critical Decisions

**Tabs + FAB layout:** Use ClassicTabLayout (5 Tabs + absolute-positioned FAB). NativeTabs/liquid glass were rejected as too complex with the 5-tab + FAB requirement. FAB positioned at `bottom: insets.bottom + TAB_BAR_HEIGHT + 12`.

**No Victory Native:** Victory Native requires native builds incompatible with Expo Go. Custom bar charts via react-native-reanimated's `useAnimatedStyle`. Each bar MUST be its own component (`BarItem`) — never call `useAnimatedStyle` inside a `.map()`.

**State management:** AsyncStorage only (no backend/Supabase), all in `context/AppContext.tsx`. Key: `@bunyan/state/v1`.

**Score formula:** prayers(40pts) + quran(15) + dhikr(15) + workout(15) + water(10) + sleep(5) = 100 max.

**Colors:** Deep Emerald `#1A6B45` primary, Soft Gold `#C9A84C` accent, Warm White `#FAFAF8` background, Charcoal `#111410` dark mode. Both light and dark palettes in `constants/colors.ts`. `useColors()` returns `{ ...palette, radius: colors.radius }`.

**Web preview warnings:** `shadow*`, `pointerEvents`, `transform-origin` warnings in Expo web preview are expected and harmless — they don't affect native mobile.

**Why:**
Expo Go incompatibility with native packages was the primary constraint. Hydration-safe mutations and custom charts were needed to deliver a functional first build.

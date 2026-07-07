---
name: Bunyan Hydration Race Fix
description: Pattern for preventing AsyncStorage hydration from overwriting pre-hydration user mutations
---

## Problem
AsyncStorage.getItem is async. If a user triggers a state mutation before hydration resolves, the late `setState(saved)` call overwrites those mutations — data loss.

## Solution
In `context/AppContext.tsx`:
1. Track `hydratedRef = useRef(false)` and `pendingMutations = useRef<Array<(s: AppState) => AppState>>([])`.
2. In `update()`: if `!hydratedRef.current`, push the updater into `pendingMutations`. Always call `setState` optimistically for responsive UI. Only `persist()` after hydration is done.
3. In the hydration `useEffect`: after parsing saved state, replay `pendingMutations` via `reduce` onto the base restored state before setting it.

**Why:** Prevents silent data loss when users interact immediately on app open (common when coming back to a fresh JS bundle load).

**How to apply:** Any time AsyncStorage (or any async store) is the source of truth for initial state, apply this pattern.

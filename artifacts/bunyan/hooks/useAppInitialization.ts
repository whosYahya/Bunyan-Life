import { useApp } from '@/context/AppContext';
import type { RoutingDecision } from '@/utils/appState';

/**
 * useAppInitialization
 *
 * Reads the hydrated app state and returns the routing decision the splash
 * screen should act on once its minimum display time has elapsed.
 *
 * Logic (matches spec):
 *   hasCompletedOnboarding == false  → 'onboarding'
 *   isLoggedIn == false              → 'auth'
 *   otherwise                        → 'home'
 */
export function useAppInitialization(): {
  isReady: boolean;
  decision: RoutingDecision;
} {
  const { state, isLoading } = useApp();

  let decision: RoutingDecision = 'home';
  if (!state.hasCompletedOnboarding) {
    decision = 'onboarding';
  } else if (!state.auth.isAuthenticated) {
    decision = 'auth';
  }

  return { isReady: !isLoading, decision };
}

/**
 * appState.ts — Thin helpers for persistent app-level flags.
 * The primary state is managed by AppContext (AsyncStorage @bunyan/state/v1),
 * but these constants are exported so any module can reference the same keys.
 */

export const STORAGE_KEY_STATE = '@bunyan/state/v1';
export const STORAGE_KEY_CREDENTIALS = '@bunyan/credentials/v1';

/**
 * Routing decision returned by useAppInitialization.
 * Drives the post-splash navigation choice.
 */
export type RoutingDecision =
  | 'onboarding'   // first time — show onboarding
  | 'auth'         // onboarding done, not logged in
  | 'home';        // ready to show home dashboard

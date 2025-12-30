# Implementation Plan - Advanced PWA Browser APIs

This plan outlines the integration of three key browser APIs to enhance the
Pomodoro PWA experience: **Vibration API**, **App Badging API**, and **Screen
Wake Lock API**.

## 1. Vibration API Integration

**Goal**: Provide haptic feedback when a session completes.

- **Changes**:
  - Modify `sendNotification` in `src/hooks/usePomodoro.ts` to include a
    vibration pattern in the `Notification` options.
  - Explicitly call `navigator.vibrate()` for devices that might support
    vibration but not haptic-enabled notifications.
- **Vibration Pattern**: `[200, 100, 200]` (short pulses).

## 2. App Badging API Implementation

**Goal**: Display the remaining minutes on the application icon.

- **Changes**:
  - Create a new utility function `updateAppBadge(minutes: number | null)` in a
    new file `src/utils/pwa.ts`.
  - Integrated into `src/hooks/usePomodoro.ts`.
  - **Logic**:
    - When timer is running: Update badge every minute.
    - When timer finishes: Set badge to a special state (e.g., '!') or clear it.
    - When timer is reset: Clear the badge.

## 3. Screen Wake Lock API Implementation

**Goal**: Prevent the screen from sleeping while the timer is active to ensure
the user sees the countdown and the browser doesn't throttle the timer script.

- **Changes**:
  - Create `src/utils/wakeLock.ts` to manage the `WakeLockSentinel`.
  - Add `requestWakeLock` and `releaseWakeLock` functions.
  - Integration in `src/hooks/usePomodoro.ts`:
    - Call `requestWakeLock()` when `timerHandle().start()` is called.
    - Call `releaseWakeLock()` when the timer is paused, finished, or reset.
  - **Edge Case**: Re-acquire wake lock if the page becomes visible again (the
    sentinel is released automatically when the tab is hidden).

## 4. Proposed File Structure

- `src/utils/pwa.ts`: Combined utilities for Badging and Vibration.
- `src/utils/wakeLock.ts`: Specialized utility for the Wake Lock API.

## 5. Verification Steps

- [ ] Verify haptic feedback on a mobile device (PWA mode).
- [ ] Check app icon badge update on macOS/Windows/Android.
- [ ] Confirm screen stays on during a 1-minute test session.

# Implementation Plan - Pomodoro Polish

This plan addresses UX quirks and technical gaps identified in the project
audit.

## Phase 1: UX Improvements

- [x] **Modal Input UX**: Added "select on focus" to duration inputs to prevent
      number-concatenation frustration.
- [x] **Timer Labels**: Updated primary action button to show "Start" for fresh
      timers and "Resume" for paused ones.
- [x] **Progress Logic**: Fixed the `ProgressBar` to grow as time passes
      (representing progress made).
- [x] **Mode Switching**: Decoupled mode switching from auto-starting the timer
      to give users more control.

## Phase 2: Technical & Accessibility

- [x] **PWA & Meta Fixes**: Synced `theme-color` in `index.html` and
      `vite.config.ts` with the dark theme and updated PWA manifest.
- [x] **Audio Refinement**: Refined the Web Audio oscillator to a more pleasant
      "ping" chime.
- [x] **Keyboard Accessibility**: Implemented custom `focus-visible` states and
      button press feedback.
- [x] **Notification Permission UX**: Integrated permission requests into the
      primary interaction flow.

## Conclusion

All planned UX and technical improvements have been implemented and verified.

# Basic Pomodoro

A minimalist, industrial-style Pomodoro timer built with
[SolidJS](https://www.solidjs.com/) and [Vite](https://vitejs.dev/). This
application combines productivity with a high-contrast aesthetic inspired by
Teenage Engineering hardware.

![SolidJS](https://img.shields.io/badge/SolidJS-2c4f7c?style=flat&logo=solid&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-ready-009688)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

Basic Pomodoro is a focused time-management tool designed for clarity and
efficiency. It leverages the reactive power of SolidJS to provide a smooth,
low-overhead experience. The design philosophy emphasizes high contrast,
tactile-like interfaces, and an "industrial" look that minimizes distractions
while staying visually striking.

### Key Features

- **Focus & Break Cycles**: Seamlessly transition between Focus (25m), Short
  Break (5m), and Long Break (15m) modes.
- **Configurable Timers**: Full control over session durations via the
  configuration panel.
- **Progress Visualization**: A sleek, peripheral progress bar keeps you
  informed of your status at a glance.
- **PWA Ready**: Install the app on your mobile device or desktop for an
  offline-ready, native-like experience.
- **Audio Alerts**: Integrated notifications to signal when a session is
  complete.
- **Responsive Design**: Optimized for everything from mobile phones up to
  high-resolution monitors.

## Tech Stack

- **Frontend**: SolidJS for ultra-performant reactive UI.
- **Bundler**: Vite for lightning-fast development and optimized builds.
- **Logic**: TypeScript for type-safe state management and hooks.
- **Styling**: Modern CSS with custom properties and CSS Grid/Flexbox.
- **PWA**: `vite-plugin-pwa` for service worker management and manifest
  generation.
- **Testing**: Vitest and Solid Testing Library for robust unit and component
  tests.

## Development

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/basic-pom.git
   cd basic-pom
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:4000`.

### Testing

Run the test suite:

```bash
npm test
```

Generate coverage report:

```bash
npm run test:coverage
```

## Deployment

This project is configured for automated deployment via **GitHub Actions** and
**GitHub Pages**.

### Continuous Deployment

Every push to the `main` branch triggers the `.github/workflows/deploy.yml`
workflow, which:

1. Installs dependencies using `npm ci`.
2. Builds the production assets using `npm run build`.
3. Generates a `404.html` fallback for SPA routing on GitHub Pages.
4. Deploys the `dist/` directory to the `gh-pages` branch or directly to GitHub
   Pages environments.

### Manual Build

To build the project manually for local hosting or other providers:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

## Industrial Design Inspiration

The visual language of Basic Pomodoro is inspired by the bold, functionalist
aesthetics of companies like **Teenage Engineering**. It features:

- Modular "tile" components.
- High-contrast monochrome elements with deliberate "safety" orange/red accents.
- Clear typography and status indicators.

---

Built with precision and focus. MIT Licensed.

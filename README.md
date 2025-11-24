# Basic Pomodoro

A minimalist, industrial-style Pomodoro timer built with [SolidJS](https://www.solidjs.com/) and [Vite](https://vitejs.dev/).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![SolidJS](https://img.shields.io/badge/SolidJS-2c4f7c?style=flat&logo=solid&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

## Features

-   **Focus & Break Modes**: Easily switch between Focus (Work), Short Break, and Long Break modes.
-   **Customizable Timers**: Configure the duration for each mode to suit your workflow.
-   **Visual Progress**: A clean progress bar visualizes your remaining time.
-   **Industrial Design**: Inspired by Teenage Engineering, featuring a sleek, high-contrast interface.
-   **PWA Support**: Installable as a Progressive Web App (PWA) for offline use and native-like experience.
-   **Responsive**: Optimized for both desktop and mobile devices.

## Tech Stack

-   **Framework**: SolidJS
-   **Build Tool**: Vite
-   **Language**: TypeScript
-   **Styling**: CSS (Custom properties, responsive grid)
-   **Icons**: Phosphor Icons
-   **Testing**: Vitest

## Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm, pnpm, or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd basic-pom
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    pnpm install
    ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the app.

### Building for Production

Build the application for production:

```bash
npm run build
```

The output will be in the `dist` directory, ready for deployment.

### Testing

Run the test suite with Vitest:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

## License

This project is licensed under the MIT License.

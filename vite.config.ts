import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/pomo-solid/",
  plugins: [
    devtools(),
    solidPlugin(),
    VitePWA({
      base: "/pomo-solid/",
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Solid Pomodoro",
        short_name: "SolidPom",
        description: "A simple Pomodoro timer built with SolidJS.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/pomo-solid/",
        start_url: "/pomo-solid/",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/pomo-solid/index.html",
      },
    }),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: "esnext",
  },
});

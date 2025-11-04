import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    devtools(),
    solidPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Solid Pomodoro",
        short_name: "SolidPom",
        description: "A simple Pomodoro timer built with SolidJS.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
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
    }),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: "esnext",
  },
});

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B1412",
          soft: "#241B18",
          deep: "#100C0B",
        },
        // Kept under the `orange` name so every accent in the app follows the
        // palette from one place. It now reads as a muted rose-clay.
        orange: {
          DEFAULT: "#D9A79B",
          50: "#FBF4F1",
          100: "#F5E5DF",
          200: "#EED3CA",
          300: "#E6C1B6",
          400: "#DFB2A6",
          500: "#D9A79B",
          600: "#C08D81",
          700: "#9C6C62",
        },
        bone: {
          DEFAULT: "#F7F0EA",
          dim: "#E2D5CC",
          muted: "#A7948C",
        },
        blush: {
          DEFAULT: "#EFE3DC",
          soft: "#F6EEE8",
          deep: "#E3D4CB",
        },
        clay: "#4A3830",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
        widest2: "0.35em",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        expoIn: "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      animation: {
        marquee: "marquee 46s linear infinite",
        "marquee-slow": "marquee 80s linear infinite",
        "marquee-reverse": "marquee-reverse 64s linear infinite",
        "spin-slow": "spin 16s linear infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        "marquee-reverse": {
          from: { transform: "translate3d(-50%,0,0)" },
          to: { transform: "translate3d(0,0,0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border-light, #e2e8f0)",
        background: "var(--color-warm-ivory, #fdfbf7)",
        foreground: "var(--color-charcoal, #1d2327)",
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          foreground: "var(--text-secondary, #646970)",
        },
      },
    },
  },
  plugins: [],
}

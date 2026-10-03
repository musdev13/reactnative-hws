/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#0F172A",
          card: "#1E293B",
          elevated: "#334155",
        },
        primary: {
          DEFAULT: "#4F46E5",
          light: "#818CF8",
          dark: "#3730A3",
        },
        accent: {
          teal: "#14B8A6",
          amber: "#F59E0B",
          rose: "#F43F5E",
          emerald: "#10B981",
          success: "#10B981",
          danger: "#F43F5E",
        },
      },
    },
  },
  plugins: [],
};
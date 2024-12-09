/** @type {import('tailwindcss').Config} */
import scrollbar from "tailwind-scrollbar";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {},
  plugins: [scrollbar({ nocompatible: true })],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {},
  plugins: [
    // .prettierrc
    {
      tailwindConfig: "./styles/tailwind.config.js",
    },
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};

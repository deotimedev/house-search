/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        "house": ["HouseMDFont"],
        "sans": ["Poppins"]
      }
    },
  },
  plugins: [],
}


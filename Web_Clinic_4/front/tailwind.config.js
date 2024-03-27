/** @type {import('tailwindcss').Config} */
export default {
  content:["./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
          ],
  theme: {
    extend: {
      fontFamily: {
        'kodchasan': ['Kodchasan', 'sans-serif'],
        'sarabun': ['Sarabun', 'sans-serif'],
        'kanit': ['Kanit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


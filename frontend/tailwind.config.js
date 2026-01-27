/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  keyframes: {
    skeletonShimmer: {
      "0%": { transform: "translateX(-120%)" },
      "100%": { transform: "translateX(120%)" },
    },
    skeletonShimmer2: {
      "0%": { transform: "translateX(-160%)" },
      "100%": { transform: "translateX(160%)" },
    },
  },
  animation: {
    skeletonShimmer: "skeletonShimmer 1.8s ease-in-out infinite",
    skeletonShimmer2: "skeletonShimmer2 2.4s ease-in-out infinite",
  },
},


  },
  plugins: [],
}

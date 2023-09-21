import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        "colors": {
            "bs-header": "#000000"
        },
        "animation": {
            "logo-slide-down": "logo-slide-down 1s ease-out",
            "logo-slide-up": "logo-slide-up 1s ease-out",
            "gameplayer-slide-in": "gameplayer-slide-in 1s ease-out"
        }
    },
  },
  plugins: [],
} satisfies Config;

import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        "colors": {
            "shade-0": "#0D2230",
            "shade-1": "#0f2738",
            "shade-2": "#1A4361",
            "shade-3": "#1E4E71",
            "shade-4": "#225981",
            "shade-5": "#276591",
            "shade-6": "#2B70A1",
            "shade-7": "#2F7BB1",
            "shade-8": "#3386C1",
            "shade-9": "#3E90CC"
        },
        "animation": {
            "logo-slide-down": "logo-slide-down 1s ease-out",
            "logo-slide-up": "logo-slide-up 1s ease-out",
            "gameplayer-slide-in": "gameplayer-slide-in 1s ease-out",
            "left-to-right": "left-to-right 0.5s",
            "right-to-left": "right-to-left 0.5s"
        },
        gridTemplateColumns: {
          '48': 'repeat(48, minmax(0, 1fr))',
        },
        gridColumn: {
          'span-47': 'span 47 / span 47',
          'span-38': 'span 38 / span 38',
        }
    },
  },
  plugins: [],
} satisfies Config;

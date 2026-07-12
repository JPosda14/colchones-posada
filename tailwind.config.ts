import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        verde: "#2D6A4F",
        "verde-oscuro": "#1B4B36",
        "verde-claro": "#52B788",
        "verde-muy-claro": "#D8F3DC",
        crema: "#FAF7F2",
        "crema-oscura": "#F0EBE1",
        texto: "#1A1A1A",
        "texto-suave": "#5C5C5C",
        acento: "#E76F51",
        whatsapp: "#25D366",
      },
      fontSize: {
        "display-sm": ["clamp(2.5rem, 5vw, 3.5rem)", { lineHeight: "1.1" }],
        "display-md": ["clamp(3rem, 6vw, 4.5rem)", { lineHeight: "1.05" }],
        "display-lg": ["clamp(3.5rem, 8vw, 5.5rem)", { lineHeight: "1" }],
      },
      fontFamily: {
        heading: ["Alegreya", "serif"],
        body: ["Alegreya Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

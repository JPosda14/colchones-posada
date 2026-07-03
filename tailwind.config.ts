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
        "verde-claro": "#52B788",
        "verde-muy-claro": "#D8F3DC",
        crema: "#FAF7F2",
        "crema-oscura": "#F0EBE1",
        texto: "#1A1A1A",
        "texto-suave": "#6B6B6B",
        acento: "#E76F51",
        whatsapp: "#25D366",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

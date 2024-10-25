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
        background: "#111827", // Fondo principal
        foreground: "#1F2937", // Fondos de tarjetas/componentes
        text: "#F9FAFB", // Texto principal
        muted: "#9CA3AF", // Texto secundario
        accent: "#3B82F6", // Color de acento (azul)
      },
    },
  },
  plugins: [],
};
export default config;

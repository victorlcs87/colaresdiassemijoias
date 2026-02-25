import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#13ec80",
                whatsapp: "#25D366",
                "whatsapp-dark": "#128C7E",
                "background-light": "#f6f8f7",
                "background-dark": "#102219",
            },
            fontFamily: {
                display: ["Plus Jakarta Sans", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "1rem",
                lg: "2rem",
                xl: "3rem",
                full: "9999px",
            },
        },
    },
    plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "rgb(var(--primary))",
                    light: "rgb(var(--primary-light))",
                },
                accent: "rgb(var(--accent))",
                success: "rgb(var(--success))",
                danger: "rgb(var(--danger))",
                surface: "rgb(var(--surface))",
                card: "rgb(var(--card))",
                border: "rgb(var(--border))",
                text: {
                    primary: "rgb(var(--text-primary))",
                    muted: "rgb(var(--text-muted))",
                },
                sidebar: {
                    bg: "rgb(var(--sidebar-bg))",
                    text: "rgb(var(--sidebar-text))",
                },
            },
            fontFamily: {
                sans: ["var(--font-dm-sans)", "sans-serif"],
                display: ["var(--font-plus-jakarta)", "sans-serif"],
                mono: ["var(--font-jetbrains-mono)", "monospace"],
            },
            borderRadius: {
              card: "12px",
              button: "8px",
              badge: "999px",
            },
            boxShadow: {
              card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
}

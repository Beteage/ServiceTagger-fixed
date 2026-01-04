/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            brand: {
                DEFAULT: '#00C805', // "Robinhood" Neon Green
                dark: '#009B04',    // Darker Green for hover
                darker: '#006E03',  // Even darker
            },
            accent: {
                red: '#FF3B30',     // Bright Red
                orange: '#FF9900',  // Warning
                black: '#000000',   // Pure Black
                gray: '#6A727C',    // Slate Grey (Secondary Text)
                light: '#F5F8FA',   // Light Grey (Secondary BG)
            }
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'], // Enforce Inter
            mono: ['Roboto Mono', 'monospace'], // For financial data
        }
    },
    plugins: [],
}

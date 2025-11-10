/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
              "./src/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./design/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                /*
                 * Design System Colors from Figma
                 * Primary (prim) - Dark navy blues
                 * Secondary (sec) - Aqua, yellow, pink palette
                 * Background (bg) - Dark background
                 */

                // todo 'A0A1B3' this color is not included in the design system, but it is used in the design hero section text color
                // todo line hehight not included in the design system, but it is used in the design hero section text color
                // todo letter spacing not included in the design system, but it is used in the design hero section text color
                // todo work on font family, font size, and font weight

                // ABDEFF 0% prim blue gradient color
                //62C1FF

                primary: {
                    DEFAULT: "#0D1137", // prim - main dark navy
                    light: "#1370AD", // prim-2 - lighter blue
                },
                secondary: {
                    DEFAULT: "#97te4D7E0", // sec-1 - aqua
                    yellow: "#EFD27E", // sec-2 - yellow
                    pink: "#E438D5", // sec-3 - pink
                    gray: "#A0A1B3",
                },
                background: {
                    DEFAULT: "#141733", // bg - dark background
                },
                neutral: {
                    DEFAULT: "#374151", // Keep existing gray-700
                    50: "#F9FAFB",
                    100: "#F3F4F6",
                    200: "#E5E7EB",
                    300: "#D1D5DB",
                    400: "#9CA3AF",
                    500: "#6B7280",
                    600: "#4B5563",
                    700: "#374151",
                    800: "#1F2937",
                    900: "#111827",
                },
                // Alternative naming convention (more semantic)
                brand: {
                    navy: "#0D1137", // prim
                    blue: "#1370AD", // prim-2
                    aqua: "#94D7E0", // sec-1
                    yellow: "#EFD27E", // sec-2
                    pink: "#E438D5", // sec-3
                    dark: "#141733", // bg
                },
            },
            spacing: {
                xs: "0.25rem", // 4px
                sm: "0.5rem", // 8px
                md: "1rem", // 16px
                lg: "1.5rem", // 24px
                xl: "2rem", // 32px
                "2xl": "3rem", // 48px
                "3xl": "4rem", // 64px
            },
            fontSize: {
                // Display Text Styles (for headings, heroes, etc.)
                "display-xs": [
                    "24px",
                    { lineHeight: "32px", letterSpacing: "-2%" },
                ],
                "display-sm": [
                    "30px",
                    { lineHeight: "38px", letterSpacing: "-2%" },
                ],
                "display-md": [
                    "36px",
                    { lineHeight: "44px", letterSpacing: "-2%" },
                ],
                "display-lg": [
                    "48px",
                    { lineHeight: "60px", letterSpacing: "-2%" },
                ],
                "display-xl": [
                    "60px",
                    { lineHeight: "72px", letterSpacing: "-2%" },
                ],

                "display-2xl": [
                    "72px",
                    { lineHeight: "80px", letterSpacing: "-2%" },
                ],

                // Body Text Styles (for content, paragraphs, etc.)
                "body-xs": [
                    "12px",
                    { lineHeight: "20px", letterSpacing: "-2%" },
                ],
                "body-sm": [
                    "14px",
                    { lineHeight: "24px", letterSpacing: "-2%" },
                ],
                "body-md": [
                    "16px",
                    { lineHeight: "28px", letterSpacing: "-2%" },
                ],
                "body-lg": [
                    "18px",
                    { lineHeight: "30px", letterSpacing: "-2%" },
                ],
                "body-xl": [
                    "20px",
                    { lineHeight: "32px", letterSpacing: "-2%" },
                ],
                "body-2xl": [
                    "22px",
                    { lineHeight: "34px", letterSpacing: "-2%" },
                ],

                // Legacy sizes (keep for backward compatibility)
                xs: ["0.75rem", { lineHeight: "1rem" }], // 12px / 16px
                sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px / 20px
                base: ["1rem", { lineHeight: "1.5rem" }], // 16px / 24px
                lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px / 28px
                xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px / 28px
                "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px / 32px
                "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px / 36px
                "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px / 40px
            },
            fontFamily: {
                sans: ["Poppins", "system-ui", "sans-serif"],
                display: ["Poppins", "system-ui", "sans-serif"],
                gotham: ["Gotham", "Poppins", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};

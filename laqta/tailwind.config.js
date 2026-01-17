/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./design/**/*.{js,ts,jsx,tsx}",
        "./styles/**/*.css",
    ],
    theme: {
        // Extended breakpoints for ultra-wide screens
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            '3xl': '1920px',    // Full HD / Large monitors
            '4xl': '2560px',    // QHD / Ultra-wide monitors
            '5xl': '3440px',    // Ultra-wide 21:9 monitors
        },
        extend: {
            colors: {
                /*
                 * Design System Colors - Laqta Brand
                 * =================================
                 * Primary: Dark navy blues for headers and CTAs
                 * Secondary: Vibrant accent palette (aqua, yellow, pink)
                 * Form: Input field styling
                 * Accent: Interactive elements and highlights
                 * Neutral: Text and UI elements
                 */

                // Primary Colors
                primary: {
                    DEFAULT: "#0D1137", // Main dark navy
                    light: "#1370AD",   // Lighter blue
                },

                // Secondary Colors
                secondary: {
                    DEFAULT: "#94D7E0", // Aqua (fixed typo)
                    yellow: "#EFD27E",  // Yellow
                    pink: "#E438D5",    // Pink
                    gray: "#A0A1B3",    // Gray text
                },

                // Background Colors
                background: {
                    DEFAULT: "#141733", // Dark background
                    light: "#1F2937",   // Lighter dark background
                },

                // Form Colors (used extensively in inputs)
                form: {
                    text: "#D2D2D3",        // Form input text color
                    bg: "#141733",          // Form input background
                    placeholder: "#9CA3AF", // Placeholder text
                    border: "#4B5563",      // Input borders
                },

                // Accent Colors (interactive elements)
                accent: {
                    blue: "#54B3F1",    // Badges, borders, secondary buttons
                    social: "#1787ba",  // Social media icons
                    purple: "#7C3AED",  // Blog category fallback
                    success: "#93d5de", // Success states
                },

                // Gradient endpoint colors
                gradient: {
                    blue: {
                        start: "#1370AD",   // Primary gradient start
                        middle: "#62C1FF",  // Gradient middle
                        end: "#ABDEFF",     // Gradient end
                    },
                    blog: {
                        from: "#1e293b",    // Blog hero gradient
                        via: "#1e3a8a",
                        to: "#1e293b",
                    },
                },

                // Neutral/Gray Scale
                neutral: {
                    DEFAULT: "#374151",
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

                // Brand Colors (semantic aliases)
                brand: {
                    navy: "#0D1137",
                    blue: "#1370AD",
                    aqua: "#94D7E0",
                    yellow: "#EFD27E",
                    pink: "#E438D5",
                    dark: "#141733",
                },
            },

            // Spacing Scale (8px base unit)
            spacing: {
                xs: "0.25rem",   // 4px
                sm: "0.5rem",    // 8px
                md: "1rem",      // 16px
                lg: "1.5rem",    // 24px
                xl: "2rem",      // 32px
                "2xl": "3rem",   // 48px
                "3xl": "4rem",   // 64px
                "4xl": "6rem",   // 96px

                // Component-specific spacing
                "nav-height": "5rem",          // 80px - navigation height
                "nav-height-mobile": "3.5rem", // 56px - mobile nav height
                "nav-spacer": "5.5rem",        // 88px - space below fixed nav
                "card-min": "25rem",           // 400px - minimum card height
                "section-min": "34.375rem",    // 550px - minimum section height
            },

            // Max Width utilities
            maxWidth: {
                "container": "94.5rem",      // 1512px - fixed content width
                "content": "43.75rem",       // 700px - content max width
                "content-lg": "50rem",       // 800px - large content max width
                "content-xl": "56.25rem",    // 900px - extra large content max width
                "prose": "65ch",             // Readable line length
            },

            // Min Height utilities
            minHeight: {
                "card": "25rem",      // 400px
                "section-sm": "34.375rem", // 550px
                "section-md": "43.75rem",  // 700px
                "section-lg": "75rem",     // 1200px
                "form": "37.5rem",    // 600px
            },

            // Typography
            fontSize: {
                // Display Text Styles (for headings, heroes)
                "display-xs": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
                "display-sm": ["30px", { lineHeight: "38px", letterSpacing: "-0.02em" }],
                "display-md": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em" }],
                "display-lg": ["48px", { lineHeight: "60px", letterSpacing: "-0.02em" }],
                "display-xl": ["60px", { lineHeight: "72px", letterSpacing: "-0.02em" }],
                "display-2xl": ["72px", { lineHeight: "80px", letterSpacing: "-0.02em" }],

                // Body Text Styles (for content, paragraphs)
                "body-xs": ["12px", { lineHeight: "20px", letterSpacing: "-0.02em" }],
                "body-sm": ["14px", { lineHeight: "24px", letterSpacing: "-0.02em" }],
                "body-md": ["16px", { lineHeight: "28px", letterSpacing: "-0.02em" }],
                "body-lg": ["18px", { lineHeight: "30px", letterSpacing: "-0.02em" }],
                "body-xl": ["20px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
                "body-2xl": ["22px", { lineHeight: "34px", letterSpacing: "-0.02em" }],

                // Legacy sizes (backward compatibility)
                xs: ["0.75rem", { lineHeight: "1rem" }],
                sm: ["0.875rem", { lineHeight: "1.25rem" }],
                base: ["1rem", { lineHeight: "1.5rem" }],
                lg: ["1.125rem", { lineHeight: "1.75rem" }],
                xl: ["1.25rem", { lineHeight: "1.75rem" }],
                "2xl": ["1.5rem", { lineHeight: "2rem" }],
                "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
                "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
            },

            // Font Families
            fontFamily: {
                sans: ["Poppins", "system-ui", "sans-serif"],
                display: ["Poppins", "system-ui", "sans-serif"],
                gotham: ["Gotham", "Poppins", "system-ui", "sans-serif"],
                // Arabic fonts
                // Titles: Alexandria only
                // Content: RH-ZAK with Alexandria fallback
                arabic: ["RH-ZAK", "Alexandria", "system-ui", "sans-serif"],
                "arabic-title": ["Alexandria", "system-ui", "sans-serif"],
                "arabic-body": ["RH-ZAK", "Alexandria", "system-ui", "sans-serif"],
            },

            // Border Radius
            borderRadius: {
                "btn": "0.5rem",    // 8px - standard button radius
                "card": "1rem",     // 16px - card radius
                "input": "0.5rem",  // 8px - input radius
            },

            // Box Shadow
            boxShadow: {
                "btn-hover": "0 20px 25px -5px rgb(59 130 246 / 0.25)",
                "card": "0 4px 30px rgba(0, 0, 0, 0.1)",
                "glass": "0 4px 30px rgba(0, 0, 0, 0.1)",
            },

            // Background Image (gradients)
            backgroundImage: {
                "gradient-primary": "linear-gradient(to right, #1370AD, #62C1FF)",
                "gradient-hero-fade": "linear-gradient(to bottom, transparent, #000000)",
                "gradient-blog-hero": "linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)",
            },

            // Animation
            animation: {
                "fade-in": "fadeIn 0.8s ease-out forwards",
                "slide-up": "slideUp 0.8s ease-out forwards",
                "slide-down": "slideDown 0.8s ease-out forwards",
                "slide-right": "slideRight 0.8s ease-out forwards",
                "marquee": "marquee 15s linear infinite",
                "glow-breathe": "glowBreathe 3s ease-in-out infinite",
            },

            // Keyframes
            keyframes: {
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                slideUp: {
                    from: { opacity: "0", transform: "translateY(30px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                slideDown: {
                    from: { opacity: "0", transform: "translateY(-30px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                slideRight: {
                    from: { opacity: "0", transform: "translateX(-30px)" },
                    to: { opacity: "1", transform: "translateX(0)" },
                },
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
                glowBreathe: {
                    "0%, 100%": { opacity: "0.25", transform: "scale(4)" },
                    "50%": { opacity: "0.35", transform: "scale(4.2)" },
                },
            },

            // Backdrop Blur
            backdropBlur: {
                glass: "10.8px",
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

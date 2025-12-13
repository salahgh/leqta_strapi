/**
 * Design System Tokens - Laqta Frontend
 * =====================================
 * Single source of truth for all design tokens.
 * These values match tailwind.config.js and should be used
 * for any TypeScript/JavaScript that needs design values.
 *
 * Mobile-First Approach:
 * - All base values target mobile screens (< 640px)
 * - Progressive enhancement for larger screens
 * - Touch-friendly minimums (44px touch targets)
 */

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
    // Primary Colors
    primary: {
        DEFAULT: "#121850",
        light: "#1370AD",
    },

    // Secondary Colors
    secondary: {
        DEFAULT: "#94D7E0",
        yellow: "#EFD27E",
        pink: "#E438D5",
        gray: "#A0A1B3",
    },

    // Background Colors
    background: {
        DEFAULT: "#141733",
        light: "#1F2937",
    },

    // Form Colors
    form: {
        text: "#D2D2D3",
        bg: "#141733",
        placeholder: "#9CA3AF",
        border: "#4B5563",
    },

    // Accent Colors
    accent: {
        blue: "#54B3F1",
        social: "#1787ba",
        purple: "#7C3AED",
        success: "#93d5de",
    },

    // Gradient Endpoints
    gradient: {
        blue: {
            start: "#1370AD",
            middle: "#62C1FF",
            end: "#ABDEFF",
        },
        blog: {
            from: "#1e293b",
            via: "#1e3a8a",
            to: "#1e293b",
        },
    },

    // Neutral Scale
    neutral: {
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
} as const;

// =============================================================================
// GRADIENTS
// =============================================================================

export const gradients = {
    // Button gradients
    primaryButton: "linear-gradient(to right, #1370AD, #62C1FF)",
    successButton: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",

    // Hero gradients
    heroFade: "linear-gradient(to bottom, transparent, #000000)",
    blogHero: "linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)",

    // Contact gradients
    contactOuter:
        "linear-gradient(358deg, rgba(0,0,0,0.8) 0%, rgba(255,255,255,0.2) 100%)",
    contactInner:
        "linear-gradient(180deg, rgba(29,34,53,1) 0%, rgba(18,19,24,1) 100%)",

    // Service overlay
    serviceOverlay:
        "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",

    // Service card gradients (by color)
    service: {
        aqua: "linear-gradient(180deg, #94D7E0 0%, #000000 100%)",
        yellow: "linear-gradient(180deg, #EFD27E 0%, #000000 100%)",
        pink: "linear-gradient(180deg, #E438D5 0%, #000000 100%)",
        blue: "linear-gradient(180deg, #1370AD 0%, #000000 100%)",
    },

    // Text gradients
    textBlue: "linear-gradient(to right, #1370AD, #ABDEFF)",
} as const;

// =============================================================================
// GLASSMORPHISM
// =============================================================================

export const glass = {
    bg: "rgba(13, 17, 55, 0.64)",
    border: "rgba(13, 17, 55, 0.3)",
    blur: "blur(10.8px)",
    shadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
} as const;

// =============================================================================
// SPACING (8px base unit)
// =============================================================================

export const spacing = {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
} as const;

// Pixel values for JavaScript calculations
export const spacingPx = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
    "4xl": 96,
} as const;

// =============================================================================
// COMPONENT SIZES
// =============================================================================

export const componentSizes = {
    // Navigation
    nav: {
        height: "5rem", // 80px
        heightMobile: "3.5rem", // 56px
        heightScrolled: "4rem", // 64px
    },

    // Cards
    card: {
        minHeight: "25rem", // 400px
        padding: {
            sm: "1rem", // 16px
            md: "1.5rem", // 24px
            lg: "2rem", // 32px
        },
    },

    // Sections
    section: {
        minHeightSm: "34.375rem", // 550px
        minHeightMd: "43.75rem", // 700px
        minHeightLg: "75rem", // 1200px
    },

    // Containers
    container: {
        max: "94.625rem", // 1514px
        content: "43.75rem", // 700px
    },
} as const;

// =============================================================================
// BUTTON SIZES (Touch-friendly)
// =============================================================================

export const buttonSizes = {
    xs: {
        height: "2rem", // 32px (36px on mobile)
        paddingX: "0.75rem", // 12px
        fontSize: "0.75rem", // 12px
    },
    sm: {
        height: "2.5rem", // 40px
        paddingX: "1rem", // 16px
        fontSize: "0.875rem", // 14px
    },
    md: {
        height: "3rem", // 48px (44px on mobile)
        paddingX: "1.5rem", // 24px
        fontSize: "1rem", // 16px
    },
    lg: {
        height: "3.5rem", // 56px (48px on mobile)
        paddingX: "2rem", // 32px
        fontSize: "1.125rem", // 18px
    },
    xl: {
        height: "4rem", // 64px (56px on mobile)
        paddingX: "2.5rem", // 40px
        fontSize: "1.25rem", // 20px
    },
} as const;

// =============================================================================
// INPUT SIZES (Touch-friendly)
// =============================================================================

export const inputSizes = {
    sm: {
        height: "2.5rem", // 40px
        paddingX: "0.75rem", // 12px
        paddingY: "0.5rem", // 8px
    },
    md: {
        height: "3rem", // 48px (44px on mobile)
        paddingX: "1rem", // 16px
        paddingY: "0.75rem", // 12px
    },
    lg: {
        height: "3.5rem", // 56px (48px on mobile)
        paddingX: "1rem", // 16px
        paddingY: "0.875rem", // 14px
    },
} as const;

// =============================================================================
// BADGE SIZES
// =============================================================================

export const badgeSizes = {
    xs: {
        paddingX: "0.5rem", // 8px
        paddingY: "0.125rem", // 2px
        fontSize: "0.75rem", // 12px
    },
    sm: {
        paddingX: "0.75rem", // 12px
        paddingY: "0.25rem", // 4px
        fontSize: "0.875rem", // 14px
    },
    md: {
        paddingX: "1rem", // 16px
        paddingY: "0.375rem", // 6px
        fontSize: "1rem", // 16px
    },
    lg: {
        paddingX: "1.25rem", // 20px
        paddingY: "0.5rem", // 8px
        fontSize: "1rem", // 16px
    },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
    // Display sizes (headings)
    display: {
        "2xl": {
            fontSize: "72px",
            lineHeight: "80px",
            letterSpacing: "-0.02em",
        },
        xl: { fontSize: "60px", lineHeight: "72px", letterSpacing: "-0.02em" },
        lg: { fontSize: "48px", lineHeight: "60px", letterSpacing: "-0.02em" },
        md: { fontSize: "36px", lineHeight: "44px", letterSpacing: "-0.02em" },
        sm: { fontSize: "30px", lineHeight: "38px", letterSpacing: "-0.02em" },
        xs: { fontSize: "24px", lineHeight: "32px", letterSpacing: "-0.02em" },
    },

    // Body sizes (content)
    body: {
        "2xl": {
            fontSize: "22px",
            lineHeight: "34px",
            letterSpacing: "-0.02em",
        },
        xl: { fontSize: "20px", lineHeight: "32px", letterSpacing: "-0.02em" },
        lg: { fontSize: "18px", lineHeight: "30px", letterSpacing: "-0.02em" },
        md: { fontSize: "16px", lineHeight: "28px", letterSpacing: "-0.02em" },
        sm: { fontSize: "14px", lineHeight: "24px", letterSpacing: "-0.02em" },
        xs: { fontSize: "12px", lineHeight: "20px", letterSpacing: "-0.02em" },
    },

    // Font families
    fontFamily: {
        sans: "Poppins, system-ui, sans-serif",
        display: "Poppins, system-ui, sans-serif",
        gotham: "Gotham, Poppins, system-ui, sans-serif",
    },

    // Font weights
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
} as const;

export const breakpointsPx = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
    none: "0",
    sm: "0.25rem", // 4px
    DEFAULT: "0.5rem", // 8px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    btnHover: "0 20px 25px -5px rgb(59 130 246 / 0.25)",
    card: "0 4px 30px rgba(0, 0, 0, 0.1)",
    glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

export const zIndex = {
    dropdown: 50,
    sticky: 100,
    fixed: 100,
    modalBackdrop: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
} as const;

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transitions = {
    duration: {
        fast: "150ms",
        DEFAULT: "200ms",
        slow: "300ms",
    },
    easing: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Colors = typeof colors;
export type Gradients = typeof gradients;
export type Spacing = typeof spacing;
export type ButtonSizes = typeof buttonSizes;
export type InputSizes = typeof inputSizes;
export type BadgeSizes = typeof badgeSizes;
export type Typography = typeof typography;
export type Breakpoints = typeof breakpoints;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type ZIndex = typeof zIndex;
export type Transitions = typeof transitions;

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

const tokens = {
    colors,
    gradients,
    glass,
    spacing,
    spacingPx,
    componentSizes,
    buttonSizes,
    inputSizes,
    badgeSizes,
    typography,
    breakpoints,
    breakpointsPx,
    borderRadius,
    shadows,
    zIndex,
    transitions,
} as const;

export default tokens;

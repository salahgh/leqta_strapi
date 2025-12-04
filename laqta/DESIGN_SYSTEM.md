# Laqta Design System Documentation

This document outlines the design system used in the Laqta project, including colors, typography, spacing, and component styles. The design system follows **mobile-first responsive design** principles with touch-friendly minimums.

## Table of Contents

- [Colors](#colors)
- [Typography](#typography)
- [Spacing](#spacing)
- [Components](#components)
- [Utility Classes](#utility-classes)
- [Responsive Design](#responsive-design)
- [Design Tokens](#design-tokens)
- [Best Practices](#best-practices)

## Colors

The color palette is defined in `tailwind.config.js` and includes the following color schemes:

### Primary Colors

```javascript
primary: {
  DEFAULT: '#0D1137',  // Deep navy blue - main brand color
  light: '#1370AD',    // Bright blue - accents and links
},
```

### Background Colors

```javascript
background: '#141733',  // Dark background for forms and cards
```

### Brand Colors

```javascript
brand: {
  aqua: '#94D7E0',     // Aqua cyan - service cards, accents
  yellow: '#EFD27E',   // Warm yellow - highlights
  pink: '#E438D5',     // Vibrant pink - accents
},
```

### Form Colors

```javascript
form: {
  text: '#D2D2D3',     // Light gray text for form inputs
  bg: '#141733',       // Dark background for form inputs
},
```

### Accent Colors

```javascript
accent: {
  blue: '#54B3F1',     // Bright accent blue - badges, borders
  social: '#1787ba',   // Social icon backgrounds
  purple: '#7C3AED',   // Purple - blog category fallback
  success: '#93d5de',  // Success step accent
},
```

### Secondary/Neutral Colors

```javascript
'secondary-gray': '#C6BBBB',  // Secondary text color
neutral: {
  100: '#FBFBFB',
  200: '#F0F0F0',
  // ... up to 900
},
```

## Typography

### Font Families

```javascript
fontFamily: {
  sans: ['Poppins', 'sans-serif'],
  gotham: ['Gotham', 'sans-serif'],
},
```

- **Poppins**: Primary font used for most text
- **Gotham**: Used for headings and display text

### Font Sizes (Responsive)

```javascript
fontSize: {
  'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // 72px
  'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // 60px
  'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],     // 48px
  'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],  // 36px
  'display-sm': ['1.875rem', { lineHeight: '1.3' }],  // 30px
  'display-xs': ['1.5rem', { lineHeight: '1.4' }],    // 24px
  'body-xl': ['1.25rem', { lineHeight: '1.6' }],      // 20px
  'body-lg': ['1.125rem', { lineHeight: '1.6' }],     // 18px
  'body-md': ['1rem', { lineHeight: '1.5' }],         // 16px - minimum for iOS
  'body-sm': ['0.875rem', { lineHeight: '1.4' }],     // 14px
  'body-xs': ['0.75rem', { lineHeight: '1.4' }],      // 12px
},
```

## Spacing

The spacing system uses an **8px base unit** (industry standard). Custom utility classes provide responsive spacing:

### Section Spacing

```css
/* Vertical Section Padding */
.section-py-sm    { @apply py-6 sm:py-8 md:py-12; }                         /* 24→32→48px */
.section-py-md    { @apply py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20; }      /* 32→40→48→64→80px */
.section-py-lg    { @apply py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-32; }

/* Horizontal Section Padding */
.section-px       { @apply px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20; }
```

### Card Padding

```css
.card-p-sm        { @apply p-3 sm:p-4 md:p-6; }
.card-p-md        { @apply p-4 sm:p-5 md:p-6 lg:p-8; }
.card-p-lg        { @apply p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12; }
```

### Grid Gaps

```css
.grid-gap-xs      { @apply gap-2 sm:gap-3 md:gap-4; }
.grid-gap-sm      { @apply gap-3 sm:gap-4 md:gap-6; }
.grid-gap-md      { @apply gap-4 sm:gap-5 md:gap-6 lg:gap-8; }
.grid-gap-lg      { @apply gap-6 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12; }
```

### Stack Gaps

```css
.stack-gap-sm     { @apply space-y-2 sm:space-y-3 md:space-y-4; }
.stack-gap-md     { @apply space-y-3 sm:space-y-4 md:space-y-6; }
.stack-gap-lg     { @apply space-y-4 sm:space-y-6 md:space-y-8; }
```

## Components

### Buttons

Buttons are defined in `components/ui/Button.tsx` with the following system:

#### Sizes

```jsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

Button sizes use responsive heights with 44px minimum for touch targets:
- `btn-xs`: 36→32px (mobile larger)
- `btn-sm`: 40px always
- `btn-md`: 44→48px
- `btn-lg`: 48→56px
- `btn-xl`: 56→64px

#### Variants

```jsx
<Button variant="primary">Primary Button</Button>   // Gradient background
<Button variant="secondary">Secondary Button</Button> // Outline style
<Button variant="ghost">Ghost Button</Button>       // Transparent
```

#### Icons

```jsx
<Button leftIcon={<Rocket />}>With Left Icon</Button>
<Button rightIcon={<ArrowRight />}>With Right Icon</Button>
```

### Form Inputs

Form inputs are defined in `components/ui/FormInput.tsx`:

```jsx
<FormInput
  label="Email Address"
  name="email"
  type="email"
  placeholder="e.g. sarah@email.com"
  size="md"
  className="bg-form-bg text-form-text"
  value={value}
  onChange={onChange}
  error={error}
/>
```

#### Sizes

- `size="sm"`: 40px height (compact)
- `size="md"`: 44→48px height (default, touch-friendly)
- `size="lg"`: 48→56px height (large)

#### Textarea

```jsx
<FormInput
  as="textarea"
  label="Message"
  rows={4}
  className="bg-form-bg text-form-text min-h-[150px]"
/>
```

### Badges

Badges are defined in `components/ui/Badge.tsx`:

```jsx
<Badge size="sm" variant="default">Default Badge</Badge>
<Badge size="md" variant="accent">Accent Badge</Badge>
<Badge size="lg" variant="solid">Solid Badge</Badge>
<Badge size="sm" variant="outline">Outline Badge</Badge>
```

#### Sizes

- `badge-xs`: Tiny tags
- `badge-sm`: 10→12px padding
- `badge-md`: 12→16px padding
- `badge-lg`: 16→20px padding

### Service Cards

Service cards use a gradient variant system:

```jsx
<ServiceCard
  title="Service Title"
  description="Service description"
  gradientVariant="aqua"  // "aqua" | "yellow" | "pink" | "blue"
/>
```

## Utility Classes

### Gradient Backgrounds

```css
.bg-gradient-primary-button   /* Linear gradient for primary buttons */
.bg-gradient-hero-fade        /* Fade to black for hero overlays */
.bg-gradient-contact-outer    /* Contact section outer gradient */
.bg-gradient-contact-inner    /* Contact section inner gradient */
.bg-gradient-service-overlay  /* Service card overlay gradient */
.bg-gradient-blog-hero        /* Blog page hero gradient */
```

### Service Gradients

```css
.gradient-service-aqua        /* #94D7E0 → #000000 */
.gradient-service-yellow      /* #EFD27E → #000000 */
.gradient-service-pink        /* #E438D5 → #000000 */
.gradient-service-blue        /* #1370AD → #000000 */
```

### Glassmorphism

```css
.glassmorphism                /* Glass effect with blur and border */
```

### Navigation

```css
.nav-h                        /* h-14 sm:h-16 md:h-20 */
.nav-h-scrolled               /* h-12 sm:h-14 md:h-16 */
.nav-spacer                   /* Matches nav height */
.nav-spacer-scrolled          /* Matches scrolled nav height */
```

### Touch Targets

```css
.touch-target                 /* min-h-[44px] min-w-[44px] */
```

### Form Utilities

```css
.form-group                   /* space-y-3 sm:space-y-4 */
.form-label                   /* block text-white font-medium mb-1 */
.form-error                   /* text-red-400 text-xs sm:text-sm mt-1 */
.input-base                   /* Base input styles with focus states */
.input-sm / .input-md / .input-lg  /* Input sizes */
```

### Social Icons

```css
.social-icon-btn              /* Round social icon button with hover */
```

## Responsive Design

### Breakpoints

```javascript
screens: {
  sm: '640px',    // Small tablets
  md: '768px',    // Tablets
  lg: '1024px',   // Laptops
  xl: '1280px',   // Desktops
  '2xl': '1536px', // Large desktops
},
```

### Mobile-First Approach

All base values target mobile screens (< 640px). Use progressive enhancement:

```jsx
// Mobile-first responsive text
<h1 className="text-display-sm sm:text-display-md md:text-display-lg lg:text-display-xl">
  Responsive Heading
</h1>

// Mobile-first responsive spacing
<div className="section-px section-py-md">
  Content with responsive padding
</div>
```

### Container Widths

```css
.max-w-container              /* 94.625rem (1514px) */
```

## Design Tokens

Design tokens are centralized in `design/tokens.ts`:

```typescript
import { designTokens } from '@/design/tokens';

// Access colors
designTokens.colors.primary.DEFAULT  // '#0D1137'
designTokens.colors.accent.blue      // '#54B3F1'

// Access gradients
designTokens.gradients.primaryButton
designTokens.gradients.heroFade

// Access spacing
designTokens.spacing.md             // '1rem'

// Access typography
designTokens.typography.display.xl
designTokens.typography.body.md
```

## Best Practices

### Using Colors

- Use `bg-primary` for main dark backgrounds
- Use `bg-form-bg` and `text-form-text` for form inputs
- Use `text-accent-blue` for links and interactive elements
- Use `text-secondary-gray` for secondary text

### Using Typography

- Use display sizes for headings (`text-display-sm` through `text-display-2xl`)
- Use body sizes for paragraph text (`text-body-xs` through `text-body-xl`)
- Always use responsive typography (e.g., `text-display-sm md:text-display-lg`)

### Using Spacing

- Use section utilities (`section-px`, `section-py-md`) for page sections
- Use card utilities (`card-p-sm`, `card-p-md`) for card padding
- Use grid gaps (`grid-gap-sm`, `grid-gap-md`) for grid layouts
- Use stack gaps (`stack-gap-sm`, `stack-gap-md`) for vertical stacking

### Touch Targets

- All interactive elements should have minimum 44px touch target
- Use `touch-target` class or `btn-sm`/`btn-md` sizes
- Form inputs use `size="md"` by default (44px minimum)

### Form Styling

```jsx
// Recommended form input pattern
<FormInput
  label="Field Label"
  name="fieldName"
  size="sm"
  className="bg-form-bg text-form-text"
/>

// For select dropdowns
<select className="input-sm bg-form-bg text-form-text rounded-full w-full">
```

### Component Migration

When updating existing components, replace:

| Old Pattern | New Pattern |
|-------------|-------------|
| `style={{ backgroundColor: '#141733' }}` | `className="bg-form-bg"` |
| `style={{ color: '#D2D2D3' }}` | `className="text-form-text"` |
| `style={{ fontSize: 56 }}` | `className="text-display-xl"` |
| `variant="compact"` | `size="sm"` |
| `px-4 md:px-8 lg:px-16` | `section-px` |
| `space-y-4` | `form-group` or `stack-gap-sm` |

# Laqta Design System Documentation

This document outlines the design system used in the Laqta project, including colors, typography, spacing, and component styles.

## Table of Contents

- [Colors](#colors)
- [Typography](#typography)
- [Spacing](#spacing)
- [Components](#components)
- [Icons](#icons)
- [Responsive Design](#responsive-design)
- [Design Tokens](#design-tokens)
- [Best Practices](#best-practices)

## Colors

The color palette is defined in `tailwind.config.js` and includes the following color schemes:

### Primary Colors

```javascript
primary: {
  DEFAULT: '#7F56D9',
  light: '#F9F5FF',
  dark: '#53389E',
},
```

- **Primary Default**: Used for primary buttons, links, and accents
- **Primary Light**: Used for backgrounds, hover states, and subtle accents
- **Primary Dark**: Used for text on light backgrounds and hover states

### Secondary Colors

```javascript
secondary: {
  DEFAULT: '#F4EBFF',
  light: '#F9F5FF',
  dark: '#53389E',
},
```

- **Secondary Default**: Used for secondary buttons and accents
- **Secondary Light**: Used for backgrounds and subtle accents
- **Secondary Dark**: Used for text on light backgrounds

### Background Colors

```javascript
background: {
  DEFAULT: '#FFFFFF',
  light: '#F9FAFB',
  dark: '#101828',
},
```

- **Background Default**: Used for main page backgrounds
- **Background Light**: Used for alternate sections and cards
- **Background Dark**: Used for dark mode backgrounds

### Neutral Colors

```javascript
neutral: {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
},
```

- **Neutral 50-200**: Used for backgrounds, borders, and dividers
- **Neutral 300-500**: Used for secondary text, icons, and disabled states
- **Neutral 600-900**: Used for primary text and headings

### Brand Colors

```javascript
brand: {
  purple: '#7F56D9',
  blue: '#2970FF',
  cyan: '#06AED4',
  orange: '#FF5722',
  yellow: '#F79009',
  green: '#12B76A',
  red: '#F04438',
},
```

- **Purple**: Primary brand color
- **Blue**: Used for links and information
- **Cyan**: Used for accents and highlights
- **Orange**: Used for warnings and attention
- **Yellow**: Used for caution and notifications
- **Green**: Used for success and positive states
- **Red**: Used for errors and negative states

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

### Font Sizes

```javascript
fontSize: {
  'display-2xl': ['4.5rem', { lineHeight: '5.625rem', letterSpacing: '-0.02em' }],
  'display-xl': ['3.75rem', { lineHeight: '4.5rem', letterSpacing: '-0.02em' }],
  'display-lg': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em' }],
  'display-md': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
  'display-sm': ['1.875rem', { lineHeight: '2.375rem' }],
  'display-xs': ['1.5rem', { lineHeight: '2rem' }],
  'body-xl': ['1.25rem', { lineHeight: '1.875rem' }],
  'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
  'body-md': ['1rem', { lineHeight: '1.5rem' }],
  'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
  'body-xs': ['0.75rem', { lineHeight: '1.125rem' }],
},
```

- **Display Sizes**: Used for headings and large text
- **Body Sizes**: Used for body text and smaller elements

### Font Weights

The project uses the standard Tailwind font weights:

- **font-thin**: 100
- **font-extralight**: 200
- **font-light**: 300
- **font-normal**: 400
- **font-medium**: 500
- **font-semibold**: 600
- **font-bold**: 700
- **font-extrabold**: 800
- **font-black**: 900

## Spacing

The spacing scale is defined in `tailwind.config.js` and includes the following values:

```javascript
spacing: {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.25rem',   // 20px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '2.5rem', // 40px
  '4xl': '3rem',   // 48px
  '5xl': '4rem',   // 64px
  '6xl': '5rem',   // 80px
},
```

These spacing values are used for margins, paddings, gaps, and other layout properties.

## Components

### Buttons

Buttons are defined in the `Button.tsx` component and have the following variants and sizes:

#### Variants

- **Primary**: Gradient background with white text
  ```jsx
  <Button variant="primary">Primary Button</Button>
  ```

- **Secondary**: White background with primary text and border
  ```jsx
  <Button variant="secondary">Secondary Button</Button>
  ```

#### Sizes

- **Small (sm)**: Smaller padding and font size
  ```jsx
  <Button size="sm">Small Button</Button>
  ```

- **Medium (md)**: Default size
  ```jsx
  <Button size="md">Medium Button</Button>
  ```

- **Large (lg)**: Larger padding and font size
  ```jsx
  <Button size="lg">Large Button</Button>
  ```

#### Icons

Buttons can include left and right icons:

```jsx
<Button leftIcon={<Icon />}>Button with Left Icon</Button>
<Button rightIcon={<Icon />}>Button with Right Icon</Button>
```

### Form Inputs

Form inputs are defined in the `FormInput.tsx` component and support both text inputs and textareas:

```jsx
<FormInput
  label="Email Address"
  name="email"
  placeholder="e.g. sarah.benyamina@email.com"
  value={formik.values.email}
  onChange={formik.handleChange}
  error={formik.touched.email && formik.errors.email}
/>
```

```jsx
<FormInput
  as="textarea"
  label="Message"
  name="message"
  placeholder="Your message here"
  value={formik.values.message}
  onChange={formik.handleChange}
  error={formik.touched.message && formik.errors.message}
/>
```

### Cards

The project uses various card components, including `PlanCard.jsx` for service plans:

```jsx
<PlanCard
  title="Basic Plan"
  features={["Feature 1", "Feature 2", "Feature 3"]}
  equipment={["Equipment 1", "Equipment 2"]}
  price="$99"
/>
```

## Icons

The project uses Lucide React for icons. Icons are imported from the `lucide-react` package:

```jsx
import { Rocket, Menu, X, ChevronDown } from 'lucide-react';
```

Icons are typically used with a size and color:

```jsx
<Rocket className="h-4 w-4 text-primary" />
```

## Responsive Design

The project uses Tailwind's responsive utilities for responsive design. The breakpoints are defined in `tailwind.config.js`:

```javascript
screens: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
},
```

Responsive classes are used throughout the project:

```jsx
<div className="text-sm md:text-base lg:text-lg">Responsive Text</div>
```

## Design Tokens

The project has a basic design token system in `design/tokens.ts`:

```typescript
export const colors = {
  primary: {
    default: '#7F56D9',
    light: '#F9F5FF',
    dark: '#53389E',
  },
  // Other colors...
};

export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
};

export const typography = {
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  // Other typography properties...
};
```

These tokens should be used instead of hardcoded values for better consistency and maintainability.

## Best Practices

### Using Colors

- Use the primary color for main actions and accents
- Use the secondary color for less important actions and accents
- Use neutral colors for text and backgrounds
- Use brand colors for specific meanings (success, error, etc.)

### Using Typography

- Use display sizes for headings and large text
- Use body sizes for body text and smaller elements
- Use the appropriate font weight for emphasis
- Maintain a consistent hierarchy with typography

### Using Spacing

- Use the spacing scale for all margins, paddings, and gaps
- Maintain consistent spacing between related elements
- Use larger spacing for section separations

### Using Components

- Use the provided components instead of creating new ones
- Follow the component API for props and variants
- Maintain consistency in component usage

### Responsive Design

- Design for mobile first, then add responsive classes for larger screens
- Test on different screen sizes
- Use the appropriate breakpoints for different devices

## Future Improvements

### Design Token Implementation

The design token system should be expanded and fully implemented across all components. This would involve:

1. Expanding the tokens in `design/tokens.ts`
2. Creating a comprehensive set of design tokens for all design properties
3. Updating components to use design tokens instead of hardcoded values
4. Documenting the design token system

### Component Library

A more comprehensive component library should be developed, including:

1. More variants for existing components
2. Additional components for common UI patterns
3. Better documentation for component usage
4. Storybook integration for component development and documentation

### Design System Documentation

The design system documentation should be expanded to include:

1. More detailed guidelines for component usage
2. Examples of common patterns and layouts
3. Accessibility guidelines
4. Performance considerations
# Laqta Project Documentation

## Project Overview

Laqta is a modern web application built with Next.js, React, and Tailwind CSS. It serves as a marketing website for a creative agency that offers various services including content marketing and production.

## Tech Stack

- **Framework**: Next.js 15.3.3
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.0
- **Form Handling**: Formik 2.4.6 with Yup 1.6.1 for validation
- **Icons**: Lucide React 0.522.0
- **Development Tools**: TypeScript, ESLint, Prettier

## Project Structure

### Directory Organization

```
├── app/                  # Next.js App Router pages and layouts
│   ├── about/            # About page components
│   ├── brands/           # Brands page
│   ├── contact/          # Contact page
│   ├── PartenerShipForm/ # Partnership form page
│   ├── PrivacyPolicy/    # Privacy policy page
│   ├── services/         # Services page components
│   ├── work/             # Work showcase page
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Homepage component
├── components/           # Reusable components
│   ├── icons/            # SVG icons
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── ui/               # UI components
├── design/               # Design tokens and theme
├── public/               # Static assets
│   ├── icons/            # Icon assets
│   └── images/           # Image assets
└── styles/               # Global styles
```

## Component Architecture

### Page Structure

Each page follows a similar structure:

1. **Navigation** - The site header with navigation links
2. **Page-specific sections** - Content sections relevant to the page
3. **Footer** - Common footer with links and newsletter subscription

### Component Types

- **Layout Components**: Components that define the structure of the page (Navigation, Footer)
- **Section Components**: Larger components that represent a full section of a page (HeroSection, ContactUs)
- **UI Components**: Smaller, reusable components (Button, FormInput, Logo)

## Styling Approach

### Tailwind Configuration

The project uses a customized Tailwind configuration with:

- Custom color palette with primary, secondary, and neutral colors
- Custom spacing scale
- Custom typography scale with display and body text styles
- Custom font families

### Design Tokens

The project has a basic design token system in `design/tokens.ts`, though it's not consistently used throughout the application.

## Key Features

### Responsive Design

The application is designed to be responsive across different screen sizes using Tailwind's responsive utilities.

### Form Handling

Forms are implemented using Formik with Yup validation schemas, providing a consistent approach to form handling and validation.

### Multi-language Support

The application includes a language selector component, though the full internationalization implementation is not visible in the examined files.

## Component Documentation

### UI Components

#### Button

A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' (default) or 'secondary'
- `size`: 'sm', 'md' (default), or 'lg'
- `leftIcon`: Optional icon component to display on the left
- `rightIcon`: Optional icon component to display on the right
- `darkMode`: Boolean to adjust styling for dark backgrounds

**Usage:**
```jsx
<Button 
  variant="primary" 
  size="md" 
  rightIcon={<Rocket className="ml-2 h-4 w-4" />}
>
  Get Started
</Button>
```

#### FormInput

A form input component that supports both text inputs and textareas.

**Props:**
- `label`: Input label text
- `name`: Input name attribute
- `type`: Input type (default: 'text')
- `as`: 'input' (default) or 'textarea'
- `error`: Error message to display

**Usage:**
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

### Section Components

#### HeroSection

The main hero section displayed on the homepage.

**Usage:**
```jsx
<HeroSection />
```

#### Navigation

The main navigation component with responsive behavior.

**Props:**
- `className`: Additional CSS classes

**Usage:**
```jsx
<Navigation />
```

## Form Validation

Form validation is implemented using Yup schemas. Example from PersonalInfoForm:

```javascript
const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "First name can only contain letters")
    .required("First name is required"),
  // Additional field validations...
});
```

## Known Issues and TODOs

The codebase contains several TODO comments that should be addressed:

1. In `app/page.tsx`: "todo adujust the size of the navigation bar all items should have the same height"
2. In `tailwind.config.js`: Several TODOs related to design system implementation
3. In `components/sections/Footer.tsx`: "todo button shadows"

## Enhancement Recommendations

### Code Structure and Organization

1. **Standardize Component File Extensions**: Convert all components to TypeScript (TSX) for better type safety
2. **Consolidate Navigation Components**: and `Navigation.jsx` into a single component
3. **Implement Design System**: Fully implement the design token system across all components

### Performance Optimizations

1. **Image Optimization**: Replace standard `<img>` tags with Next.js `Image` component
2. **Component Splitting**: Break down large components into smaller, more focused ones
3. **Font Loading**: Use Next.js font optimization with `next/font`

### Accessibility Improvements

1. **ARIA Attributes**: Add appropriate ARIA roles and labels to interactive elements
2. **Keyboard Navigation**: Improve focus states for keyboard users
3. **Color Contrast**: Ensure sufficient contrast between text and backgrounds

### Feature Enhancements

1. **State Management**: Implement a global state management solution
2. **Internationalization**: Complete the i18n implementation
3. **Dark Mode**: Add dark mode support using Tailwind's dark mode feature
4. **API Integration**: Connect forms to actual API endpoints

## Development Guidelines

### Coding Standards

1. Use TypeScript for all new components
2. Follow the existing component structure for new components
3. Use Tailwind classes instead of inline styles when possible
4. Implement proper error handling for forms and API calls

### Git Workflow

1. Create feature branches for new features or bug fixes
2. Write descriptive commit messages
3. Review code before merging to main branch

## Conclusion

The Laqta project is a well-structured Next.js application with a modern UI design. By addressing the enhancement recommendations and known issues, the project can be further improved in terms of code quality, performance, and user experience.
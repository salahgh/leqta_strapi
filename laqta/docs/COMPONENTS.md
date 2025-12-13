# Laqta Components Documentation

This document provides detailed information about the components used in the Laqta project.

## Table of Contents

- [Layout Components](#layout-components)
  - [Navigation](#navigation)
  - [Navbar](#navbar)
  - [Footer](#footer)
- [Section Components](#section-components)
  - [HeroSection](#herosection)
  - [AboutSection](#aboutsection)
  - [ServicesSection](#servicessection)
  - [ContactUs](#contactus)
- [UI Components](#ui-components)
  - [Button](#button)
  - [FormInput](#forminput)
  - [PlanCard](#plancard)
  - [EmailSubscriptionForm](#emailsubscriptionform)
- [Form Components](#form-components)
  - [PersonalInfoForm](#personalinfoform)
  - [ProjectInfoStep](#projectinfostep)
  - [PaymentInfoForm](#paymentinfoform)
  - [StepperComponent](#steppercomponent)

## Layout Components

### Navigation

**File Path**: `components/layout/Navigation.jsx`

**Description**: A responsive navigation component with desktop and mobile views. It includes a scroll-triggered background change, dynamic active link highlighting, a language selector, and a "Get Started" button.

**Props**:
- `className`: Additional CSS classes

**Features**:
- Responsive design with mobile drawer
- Scroll-triggered background change
- Dynamic active link highlighting
- Language selector
- Escape key listener for mobile drawer

**Usage Example**:
```jsx
<Navigation className="fixed top-0 left-0 right-0 z-50" />
```

### Navbar



**Description**: A simpler navigation bar with links to different sections of the website.

**Props**:
- None

**Features**:
- Dynamic active link highlighting based on current pathname
- Links to Home, Services, Our Work, Partners, About, and Contact

**Usage Example**:
```jsx
<Navbar />
```

### Footer

**File Path**: `components/layout/Footer.tsx`

**Description**: A responsive footer with a logo, newsletter subscription form, company links, utility pages, and social media icons.

**Props**:
- None

**Features**:
- Newsletter subscription form
- Company links
- Utility pages links
- Social media icons
- Copyright information

**Usage Example**:
```jsx
<Footer />
```

## Section Components

### HeroSection

**File Path**: `components/sections/HeroSection.jsx`

**Description**: The main hero section displayed on the homepage. It includes a heading with gradient text, a description, and call-to-action buttons.

**Props**:
- None

**Features**:
- Gradient text heading
- Description text
- "Get Started" and "Contact Us" buttons
- Decorative elements (Avatar, Rocket icon, Logo)

**Usage Example**:
```jsx
<HeroSection />
```

### AboutSection

**File Path**: `components/sections/AboutSection.jsx`

**Description**: A section that provides information about the company.

**Props**:
- None

**Usage Example**:
```jsx
<AboutSection />
```

### ServicesSection

**File Path**: `components/sections/ServicesSection.jsx`

**Description**: A section that showcases the services offered by the company.

**Props**:
- None

**Usage Example**:
```jsx
<ServicesSection />
```

### ContactUs

**File Path**: `components/sections/ContactUs.tsx`

**Description**: A multi-step contact form with steps for personal information, project information, payment information, and a success step.

**Props**:
- None

**Features**:
- Multi-step form with progress tracking
- Form validation using Formik and Yup
- Navigation buttons for step progression

**Usage Example**:
```jsx
<ContactUs />
```

## UI Components

### Button

**File Path**: `components/ui/Button.tsx`

**Description**: A versatile button component with multiple variants and sizes.

**Props**:
- `variant`: 'primary' (default) or 'secondary'
- `size`: 'sm', 'md' (default), or 'lg'
- `leftIcon`: Optional icon component to display on the left
- `rightIcon`: Optional icon component to display on the right
- `darkMode`: Boolean to adjust styling for dark backgrounds
- `className`: Additional CSS classes
- `...props`: All other props are passed to the underlying button element

**Features**:
- Multiple variants (primary, secondary)
- Multiple sizes (sm, md, lg)
- Support for left and right icons
- Dark mode support

**Usage Example**:
```jsx
<Button 
  variant="primary" 
  size="md" 
  rightIcon={<Rocket className="ml-2 h-4 w-4" />}
>
  Get Started
</Button>
```

### FormInput

**File Path**: `components/ui/FormInput.tsx`

**Description**: A form input component that supports both text inputs and textareas.

**Props**:
- `label`: Input label text
- `name`: Input name attribute
- `type`: Input type (default: 'text')
- `as`: 'input' (default) or 'textarea'
- `placeholder`: Input placeholder text
- `value`: Input value
- `onChange`: Change event handler
- `error`: Error message to display
- `className`: Additional CSS classes

**Features**:
- Support for both input and textarea elements
- Label display
- Error message display
- Customizable styling

**Usage Example**:
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

### PlanCard

**File Path**: `components/ui/PlanCard.jsx`

**Description**: A card component for displaying service plans with features, equipment, and pricing.

**Props**:
- `title`: Plan title
- `features`: Array of plan features
- `equipment`: Array of equipment included
- `price`: Plan price
- `className`: Additional CSS classes

**Usage Example**:
```jsx
<PlanCard
  title="Basic Plan"
  features={["Feature 1", "Feature 2", "Feature 3"]}
  equipment={["Equipment 1", "Equipment 2"]}
  price="$99"
/>
```

### EmailSubscriptionForm

**File Path**: `components/ui/EmailSubscriptionForm.tsx`

**Description**: A form for email newsletter subscription.

**Props**:
- None

**Features**:
- Email input with validation
- Subscription status feedback
- Submit button

**Usage Example**:
```jsx
<EmailSubscriptionForm />
```

## Form Components

### PersonalInfoForm

**File Path**: `components/forms/PersonalInfoForm.tsx`

**Description**: A form for collecting personal information in the contact form.

**Props**:
- `onSubmit`: Function to call when the form is submitted
- `initialValues`: Initial form values

**Features**:
- Form validation using Formik and Yup
- Fields for first name, last name, email, phone, and message

**Usage Example**:
```jsx
<PersonalInfoForm
  onSubmit={handleSubmit}
  initialValues={{
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  }}
/>
```

### ProjectInfoStep

**File Path**: `components/forms/ProjectInfoStep.tsx`

**Description**: A form for collecting project information in the contact form.

**Props**:
- `onSubmit`: Function to call when the form is submitted
- `initialValues`: Initial form values

**Usage Example**:
```jsx
<ProjectInfoStep
  onSubmit={handleSubmit}
  initialValues={{
    projectType: "",
    budget: "",
    timeline: "",
    description: ""
  }}
/>
```

### PaymentInfoForm

**File Path**: `components/forms/PaymentInfoForm.tsx`

**Description**: A form for collecting payment information in the contact form.

**Props**:
- `onSubmit`: Function to call when the form is submitted
- `initialValues`: Initial form values

**Usage Example**:
```jsx
<PaymentInfoForm
  onSubmit={handleSubmit}
  initialValues={{
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  }}
/>
```

### StepperComponent

**File Path**: `components/ui/StepperComponent.tsx`

**Description**: A component for displaying the progress of a multi-step form.

**Props**:
- `currentStep`: The current active step
- `steps`: Array of step labels

**Usage Example**:
```jsx
<StepperComponent
  currentStep={1}
  steps={["Personal Info", "Project Info", "Payment Info", "Success"]}
/>
```

## Best Practices for Component Usage

1. **Consistent Props**: When creating new components, follow the existing pattern of props naming and structure.

2. **TypeScript**: Use TypeScript for all new components to ensure type safety.

3. **Responsive Design**: Ensure all components are responsive using Tailwind's responsive utilities.

4. **Accessibility**: Include appropriate ARIA attributes and ensure keyboard navigation works correctly.

5. **Component Composition**: Prefer composition over inheritance when building complex components.

6. **Error Handling**: Implement proper error handling for forms and API calls.

7. **Testing**: Write tests for components to ensure they work as expected.

## Component Enhancement Recommendations

1. **Standardize Component File Extensions**: Convert all components to TypeScript (TSX) for better type safety.

2. **Consolidate Navigation Components**:  and `Navigation.jsx` into a single component.

3. **Implement Design System**: Fully implement the design token system across all components.

4. **Component Documentation**: Add JSDoc comments to all components for better code documentation.

5. **Storybook Integration**: Implement Storybook for component development and documentation.

6. **Accessibility Improvements**: Add ARIA attributes and improve keyboard navigation.

7. **Performance Optimizations**: Implement React.memo for pure components and useCallback for event handlers.
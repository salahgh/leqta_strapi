# Laqta - Creative Agency Website

![Laqta Logo](/public/images/laqta.svg)

A modern, responsive website for Laqta, a full-service content marketing & production company based in Algiers. Built with Next.js, React, and Tailwind CSS.

## Features

- Modern UI with responsive design
- Multi-step form for contact and project inquiries
- Services showcase with pricing plans
- Team and company information pages
- Newsletter subscription
- Multi-language support

## Tech Stack

- **Framework**: Next.js 15.3.3
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.0
- **Form Handling**: Formik with Yup validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/laqta.git
   cd laqta
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
├── app/                  # Next.js App Router pages
├── components/           # Reusable components
│   ├── icons/            # SVG icons
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── ui/               # UI components
├── design/               # Design tokens and theme
├── public/               # Static assets
└── styles/               # Global styles
```

## Available Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Documentation

For detailed documentation about the project architecture, components, and enhancement recommendations, see the [DOCUMENTATION.md](./DOCUMENTATION.md) file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern creative agency websites
- Tailwind CSS for the utility-first CSS framework
- Next.js team for the amazing framework
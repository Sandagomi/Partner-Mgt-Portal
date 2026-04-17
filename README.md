# Partner Management Portal

A modern, full-featured partner management system built with React, TypeScript, and Tailwind CSS. This portal enables efficient management of partners, brands, and sub-brands with an intuitive dashboard interface.

## Features

- **Dashboard** - Overview of key metrics and analytics
- **Partner Management** - Create, view, and manage partner information
- **Brands & Sub-brands** - Organize and track brand hierarchies
- **Authentication** - Secure login system with protected routes
- **Responsive Design** - Mobile-friendly interface that works on all devices
- **Modern UI Components** - Built with shadcn/ui and Radix UI

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui & Radix UI
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest

## Getting Started

### Prerequisites
- Node.js 18+ or bun
- npm or bun package manager

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Build

```bash
npm run build
```

### Testing

```bash
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
```

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page components for routing
- `src/lib/` - Utilities, types, and store management
- `src/hooks/` - Custom React hooks
- `public/` - Static assets

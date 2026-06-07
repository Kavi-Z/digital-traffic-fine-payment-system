# Frontend Web Application Documentation

## Overview

The frontend is a modern React application built with TypeScript, Vite, and TanStack Router. It provides a responsive web interface for the traffic management system.

## Technology Stack

- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Router**: TanStack Router
- **Package Manager**: Bun
- **UI Library**: shadcn/ui components
- **Styling**: CSS Tailwind
- **3D Graphics**: Three.js (for 3D components)

## Project Structure

```
frontend_web/
├── src/
│   ├── routes/              # Page components and routing
│   │   ├── __root.tsx       # Root layout
│   │   ├── admin.tsx        # Admin dashboard page
│   │   ├── dispute.tsx      # Dispute management page
│   │   ├── index.tsx        # Home page
│   │   ├── login.tsx        # Login page
│   │   ├── officer.tsx      # Officer dashboard
│   │   ├── pay.tsx          # Payment page
│   │   └── search.tsx       # Search page
│   ├── components/          # Reusable components
│   │   ├── admin/           # Admin-specific components
│   │   ├── common/          # Common/shared components
│   │   └── ui/              # UI component library
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx  # Authentication context
│   │   └── LanguageContext.tsx # Language/i18n context
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and API calls
│   ├── data/                # Mock data
│   ├── styles/              # Global styles
│   ├── router.tsx           # Router configuration
│   └── routeTree.gen.ts     # Generated route tree
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── bunfig.toml              # Bun configuration
```

## Key Directories Explained

### `/routes`
Contains all page-level components that correspond to different routes:
- **__root.tsx**: Root layout wrapper for all pages
- **index.tsx**: Home/landing page
- **login.tsx**: User login page
- **admin.tsx**: Admin dashboard with SriLankaMap3D component
- **officer.tsx**: Officer portal
- **dispute.tsx**: Dispute management interface
- **pay.tsx**: Payment processing page
- **search.tsx**: Search functionality

### `/components`
Reusable React components:
- **admin/**: Admin-specific components (e.g., SriLankaMap3D)
- **common/**: Shared components (CreditCard3D, PoliceBadge3D, Policeman3D, StepIndicator)
- **ui/**: UI component library (buttons, forms, dialogs, etc.)

### `/contexts`
React Context API providers for global state:
- **AuthContext**: Manages user authentication state
- **LanguageContext**: Manages application language/localization

### `/hooks`
Custom React hooks:
- **useCountUp**: Animation hook for counting up numbers
- **use-mobile**: Mobile responsiveness detection hook

### `/lib`
Utility functions and services:
- **api.ts**: API client and HTTP calls to backend
- **utils.ts**: General utility functions

## Routes and Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | index.tsx | Home/Landing page |
| `/login` | login.tsx | User authentication |
| `/admin` | admin.tsx | Admin dashboard with map visualization |
| `/officer` | officer.tsx | Police officer portal |
| `/dispute` | dispute.tsx | Dispute management |
| `/pay` | pay.tsx | Payment processing |
| `/search` | search.tsx | Search functionality |

## Component Architecture

### Page Components
Each route has a corresponding page component that:
- Manages its own local state
- Displays data from the backend API
- Contains layout-specific logic

### Common Components
Reusable components that can be used across multiple pages:
- **CreditCard3D**: 3D credit card visualization
- **PoliceBadge3D**: 3D police badge
- **Policeman3D**: 3D police officer character
- **StepIndicator**: Multi-step form indicator
- **SriLankaMap3D**: 3D map of Sri Lanka

### UI Components
shadcn/ui components (accordion, alert, button, card, form, dialog, etc.) for consistent UI patterns.

## State Management

### Authentication Context
Handles:
- User login/logout
- Session management
- User role and permissions
- Auth token storage

### Language Context
Handles:
- Language selection
- i18n translations
- Language persistence

## API Integration

### Backend Communication
- **File**: `src/lib/api.ts`
- Base URL: Configured for backend API endpoints
- Methods: GET, POST, PUT, DELETE
- Error handling: Centralized error management
- Request/Response interceptors for auth tokens

### API Endpoints Used
(See [API.md](./API.md) for full endpoint documentation)

## Styling

- **Framework**: Tailwind CSS
- **Global Styles**: `src/styles/css`
- **Component Styles**: Inline Tailwind classes and CSS modules
- **Theme**: Configured via component libraries

## Development Workflow

### Setting Up Development Environment
```bash
# Navigate to frontend directory
cd frontend_web

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run linting
bun run lint
```

### Available Scripts
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

## Build Configuration

### Vite Configuration
- **File**: `vite.config.ts`
- Hot Module Replacement (HMR) enabled
- Optimized for development and production builds
- Asset handling and optimization

### TypeScript Configuration
- **File**: `tsconfig.json`
- Strict mode enabled
- ES2020 target
- Path aliases configured

### ESLint Configuration
- **File**: `eslint.config.js`
- TypeScript support
- React best practices
- Code quality rules

## 3D Components

### Technologies
- **Three.js**: 3D graphics rendering
- **React Three Fiber**: React wrapper for Three.js
- **Drei**: Utilities for Three.js

### Available 3D Components
1. **SriLankaMap3D** (`components/admin/`)
   - Interactive 3D map of Sri Lanka
   - Used in admin dashboard
   
2. **CreditCard3D** (`components/common/`)
   - 3D credit card visualization
   - Used in payment pages
   
3. **PoliceBadge3D** (`components/common/`)
   - 3D police badge display
   - Used in officer pages
   
4. **Policeman3D** (`components/common/`)
   - 3D police officer character
   - Used in various pages

## Performance Optimization

- Code splitting at route level
- Lazy loading of components
- Image optimization
- CSS optimization with Tailwind
- Bundle analysis and optimization

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement

## Troubleshooting

### Common Issues

**Issue**: Port 5173 already in use
```bash
bun run dev -- --port 3000
```

**Issue**: Module not found
```bash
bun install
bun run build
```

**Issue**: 3D components not rendering
- Check WebGL support in browser
- Verify Three.js is installed
- Check browser console for errors

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Setup Guide](./SETUP.md)
- [Backend Documentation](./BACKEND.md)

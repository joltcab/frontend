# JoltCab - Ride Hailing Platform

## Overview

JoltCab is a professional ride-hailing platform developed by iHOSTcast. It's a full-stack web application built with React and Vite that connects to a backend API for managing ride bookings, driver assignments, payments, and real-time location tracking. The platform includes AI-powered features for dynamic pricing, driver matching, and customer support through chatbots.

**Deployment**: Migrated to Replit (October 30, 2025)
- Frontend and backend running on Replit environment
- Frontend: Port 5000 (webview)
- Backend: Port 8000 (internal)
- Local development with live backend connection

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Replit Environment Setup

**Workflows**:
1. **dev** - Frontend development server
   - Command: `VITE_API_URL=http://localhost:8000/api/v1 npm run dev`
   - Port: 5000 (webview)
   - Output: User-facing web interface

2. **backend** - Node.js/Express API server
   - Command: `cd backend && npm run dev`
   - Port: 8000 (internal)
   - Output: Console logs

**Environment Variables** (Replit Secrets):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `VITE_API_URL` - Frontend API endpoint (overridden in workflow)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID for admin authentication
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret for admin authentication

**Important**: The `VITE_API_URL` secret is overridden in the frontend workflow command to use `http://localhost:8000/api/v1` for local backend connection.

### Frontend Architecture

**Framework**: React 18 with Vite build tool
- **Rationale**: Vite provides fast development experience with Hot Module Replacement (HMR) and optimized production builds
- **Routing**: SPA (Single Page Application) with client-side routing
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Animation**: Framer Motion for UI animations

**Component Structure**:
- Uses "New York" style from shadcn/ui
- Path aliases configured for clean imports (`@/components`, `@/lib`, etc.)
- Component composition through Radix UI primitives

**Build Configuration**:
- Development server runs on port 5000 with host binding (0.0.0.0)
- Production builds output to `dist` directory
- Vite configured to allow all hosts for Replit iframe compatibility

### Backend Integration

**API Architecture**: RESTful Node.js/Express API
- Replit Local: `http://localhost:8000/api/v1` (active)
- Production Fallback: `https://admin.joltcab.com/api/v1`
- Railway Fallback: `https://0ei9df5g.up.railway.app/api/v1`

**API Client Strategy**: JoltCab API client replacing Base44 SDK
- **Problem**: Application was initially built with Base44 SDK but requires direct backend integration
- **Solution**: Created unified JoltCab API client (`joltcab-api.js`) that maintains SDK-like interface
- **Migration**: All references updated from `api-client.js` to `joltcab-api.js` (October 30, 2025)
- **Benefit**: Clean migration path while preserving existing code structure

**Authentication System**:
- JWT-based token authentication
- Token stored in localStorage
- Authorization header pattern: `Bearer {token}`
- Admin credentials: `admin@joltcab.com` / `@Odg4383@`
- **Google OAuth** (October 30, 2025):
  - Admin panel supports Google Sign-In
  - OAuth flow: `/api/v1/auth/google` → Google consent → `/api/v1/auth/google/callback`
  - Callback page: `src/pages/GoogleCallback.jsx`
  - Admin role verification enforced
  - Backend controller: `backend/src/controllers/oauth.controller.js`

**Core API Modules**:
1. **Authentication**: Login, registration, OAuth flows, password reset
2. **Ride Management**: Booking, tracking, cancellation, history
3. **User Management**: Drivers, passengers, corporate accounts, hotel profiles
4. **Payment Processing**: Stripe integration, wallet system, payouts
5. **Real-time Features**: WebSocket for live location tracking (`wss://admin.joltcab.com`)
6. **AI Services**: Dynamic pricing, driver matching, support chatbot
7. **WhatsApp Integration**: Booking and notifications through WhatsApp API

### Data Models

**Key Entities**:
- **Users**: Driver profiles, corporate profiles, hotel profiles, dispatcher profiles
- **Rides**: Booking data, status tracking, fare calculation
- **Payments**: Wallets, transactions, payment methods, promo codes
- **Geography**: Countries, cities, zones, zone pricing
- **Content**: Blog posts, documents, reviews
- **Support**: Tickets, chat messages, verification data

**Data Flow Pattern**: 
- API clients export entity-specific methods
- Entities module (`src/api/entities.js`) provides typed access to backend models
- Functions module (`src/api/functions.js`) exposes business logic operations

### Real-time Communication

**WebSocket Integration**:
- Purpose: Live driver location tracking, ride status updates
- Connection: WSS protocol to backend
- Use cases: Driver GPS tracking, passenger ride monitoring, dispatcher coordination

### Third-party Integrations Module

**Integration Framework** (`src/api/integrations.js`):
- **Core Services**: LLM invocation, email sending, file uploads, image generation
- **File Management**: Public/private file uploads with signed URLs
- **AI Capabilities**: Data extraction from uploaded documents
- Pattern: Service-oriented architecture for external dependencies

### Feature Flags

**Enabled Features** (configurable in `src/config/app.js`):
- AI-powered driver matching
- Dynamic pricing algorithms
- WhatsApp booking system
- Real-time tracking
- Identity verification workflows
- Payment processing

### Design System

**Theming Approach**:
- CSS custom properties for color system
- Dark mode support through class-based toggling
- Neutral base color palette
- Consistent border radius system (lg, md, sm)

**Color Schema**:
- Primary: Purple gradient (#667eea to #764ba2)
- Semantic colors: success, warning, error, info
- HSL-based color tokens for dynamic theming

### Development Workflow

**Environment Configuration**:
- Environment variables prefixed with `VITE_`
- API URL configurable per environment
- WebSocket URL separate from HTTP API
- Environment flag for production/development distinction

**Code Quality**:
- ESLint with React plugins
- React 18 best practices enforced
- JSX runtime configuration
- Path resolution with jsconfig.json

## External Dependencies

### Core Framework Dependencies

- **React 18.2**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing (implied by SPA structure)
- **TanStack Query 5.90**: Server state management and data fetching

### UI Component Libraries

- **Radix UI**: Unstyled accessible component primitives (16+ components including dialog, dropdown, popover, select, tabs, etc.)
- **shadcn/ui**: Pre-styled Radix UI components
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **Embla Carousel**: Carousel component

### Form Handling

- **React Hook Form**: Form state management
- **Hookform Resolvers**: Validation integration
- **Zod**: Schema validation (implied by resolvers)

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with Autoprefixer
- **class-variance-authority**: Variant-based component styling
- **clsx & tailwind-merge**: Conditional class name utilities

### Utility Libraries

- **date-fns**: Date manipulation and formatting
- **moment**: Alternative date library (legacy support)
- **cmdk**: Command menu component
- **input-otp**: OTP input component
- **next-themes**: Theme management (dark/light mode)

### Backend Services

- **JoltCab Backend API**: Custom ride-hailing platform backend
  - Hosted on Railway and custom domain
  - RESTful API architecture
  - WebSocket support for real-time features

- **Stripe**: Payment processing
  - Payment intents
  - Refunds
  - Webhook handling

- **WhatsApp Business API**: Customer communication
  - Booking confirmations
  - Ride notifications
  - Support messaging

- **AI/ML Services** (through backend):
  - LLM provider for chatbot support
  - Dynamic pricing algorithms
  - Driver matching optimization
  - Image generation capabilities

### Development Tools

- **ESLint**: Code linting
  - React plugin
  - React Hooks plugin
  - React Refresh plugin
- **Globals**: Browser environment globals

### Deployment Platforms

- **Vercel**: Primary hosting platform
  - SPA routing configuration
  - CORS header management
  - Environment variable injection

- **Railway**: Alternative backend hosting
  - API deployment
  - Database hosting (implied)

### Storage & File Management

- **Supabase Storage**: File hosting (referenced in favicon URL)
  - Public file storage
  - Signed URL generation for private files
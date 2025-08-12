# Overview

This is a React-based web application built with Express.js backend that implements a real-time payment visualization system called "GoGoLamp". The application receives payment webhooks from Stripe, processes them, and displays real-time payment activity through Socket.IO connections. It features a modern UI built with shadcn/ui components and uses PostgreSQL with Drizzle ORM for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Vite** as the build tool for fast development and optimized production builds
- **TanStack Query** for server state management and API data fetching
- **Wouter** for lightweight client-side routing
- **Socket.IO client** for real-time communication with the backend
- **shadcn/ui** component library built on Radix UI primitives for consistent, accessible UI components
- **Tailwind CSS** for utility-first styling with custom design system variables
- **Framer Motion** for smooth animations and transitions

## Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **Socket.IO** for real-time bidirectional communication
- **In-memory storage** with interface design for easy database migration
- **Stripe webhook integration** for payment processing events
- **Session management** using connect-pg-simple for PostgreSQL session storage
- **Development/production environment** handling with Vite integration in dev mode

## Database Layer
- **Drizzle ORM** with PostgreSQL dialect for type-safe database operations
- **Neon Database** serverless PostgreSQL for cloud hosting
- **Schema-first approach** with shared TypeScript types between client and server
- **Database migrations** managed through Drizzle Kit

## Real-time Communication
- **WebSocket connections** via Socket.IO for instant payment notifications
- **Event-driven architecture** where payment webhooks trigger real-time updates
- **Connection state management** for tracking active client connections

## Payment Integration
- **Stripe webhook endpoint** for receiving payment events
- **Payment validation** and data transformation before storage
- **Real-time broadcast** of payment events to connected clients

## Development Workflow
- **Shared types** in `/shared` directory for consistent data models
- **Path aliases** configured for clean imports (@/, @shared/)
- **TypeScript strict mode** for enhanced type safety
- **ESModule format** throughout the application

# External Dependencies

## Core Framework Dependencies
- **React ecosystem**: React 18, React DOM, React Router (Wouter)
- **Build tools**: Vite with React plugin, TypeScript, ESBuild for production builds
- **Development tools**: TSX for TypeScript execution, Replit development plugins

## UI and Styling
- **shadcn/ui**: Complete component library with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS and Autoprefixer
- **Framer Motion**: Animation library for smooth UI transitions
- **Lucide React**: Icon library for consistent iconography

## Backend Services
- **Express.js**: Web framework with JSON and URL-encoded body parsing
- **Socket.IO**: Real-time communication library for WebSocket connections
- **Stripe**: Payment processing with webhook support and React integration

## Database and ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migration support
- **Neon Database**: Serverless PostgreSQL database service
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation resolvers
- **Zod**: Schema validation for runtime type checking

## Development and Testing
- **TypeScript**: Static type checking and enhanced developer experience
- **Replit integration**: Development environment plugins and error handling
- **Environment variables**: Database URL and Stripe API keys configuration
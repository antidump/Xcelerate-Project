# Overview

Xcelerate is a modern meme token launchpad built on X Layer (OKX zkEVM L2) blockchain. It's a full-stack web application that enables users to create, trade, and discover meme tokens through a bonding curve mechanism. Tokens automatically graduate to DEX liquidity pools once they reach an 80 OKB trading volume threshold. The platform features real-time trading, portfolio management, and comprehensive analytics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19 with TypeScript in strict mode
- **Styling**: Tailwind CSS with shadcn/ui component library using the "new-york" style
- **State Management**: TanStack React Query for server state and caching
- **Web3 Integration**: Wagmi + RainbowKit for wallet connections and blockchain interactions
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI transitions
- **Design System**: Dark theme with glassmorphism effects, neutral color palette with CSS variables

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with planned PostgreSQL migration
- **API Design**: RESTful endpoints following `/api/*` pattern
- **Build Process**: Vite for development, esbuild for production bundling

## Database Schema Design
The application uses a relational database structure with the following core entities:
- **Users**: Wallet address-based authentication
- **Tokens**: ERC20 tokens with bonding curve parameters
- **Trades**: Buy/sell transaction records
- **Holdings**: User token balances with P&L tracking
- **Platform Stats**: Aggregated analytics and metrics

Key design decisions include using decimal types for precise financial calculations and UUIDs for primary keys to avoid enumeration attacks.

## Blockchain Integration
- **Target Network**: X Layer (Chain ID 196) with OKB as native currency
- **Smart Contracts**: Token factory, bonding curve, and liquidity management
- **Trading Mechanism**: Automated Market Maker (AMM) with bonding curves
- **Graduation Logic**: Automatic DEX listing at 80 OKB trading volume
- **Fee Structure**: Multi-tier fee distribution (platform, creator, stakers, liquidity providers)

## Authentication & Authorization
- **Wallet-Based Auth**: No traditional login system, uses Web3 wallet signatures
- **User Creation**: Automatic user record creation on first wallet connection
- **Session Persistence**: Browser-based session management
- **Authorization**: Address-based ownership validation for token operations

# External Dependencies

## Blockchain & Web3
- **Wagmi**: Web3 React hooks for Ethereum interactions
- **RainbowKit**: Wallet connection UI and management
- **Viem**: TypeScript library for Ethereum interactions
- **Neon Database**: Serverless PostgreSQL database provider

## UI & Design
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Framer Motion**: Animation library for smooth transitions
- **Embla Carousel**: Carousel component library

## Data Management
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form validation and management
- **Zod**: TypeScript-first schema validation
- **Drizzle ORM**: Type-safe database ORM

## Development & Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Static type checking
- **ESLint/Prettier**: Code linting and formatting
- **PostCSS**: CSS processing
- **esbuild**: Fast JavaScript bundler for production

## Infrastructure
- **Replit**: Development and hosting platform
- **PostgreSQL**: Primary database (Neon serverless)
- **Connect PG Simple**: PostgreSQL session store
- **Express Session**: Session middleware
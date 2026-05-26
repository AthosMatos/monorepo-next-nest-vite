# Monorepo: Next.js + NestJS + Vite

A full-stack monorepo combining Next.js, NestJS, and Vite with shared packages and centralized tooling.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

This monorepo contains three complementary applications and several shared packages managed with **pnpm workspaces** and **Turbo**:

### Applications

- **API** ([`apps/api`](apps/api)) - NestJS backend server with WebSocket support
- **Site** ([`apps/site`](apps/site)) - Next.js server-side rendered application (port 3002)
- **Web** ([`apps/web`](apps/web)) - Vite-powered React single-page application with real-time Socket.io support

### Shared Packages

- **Logger** ([`packages/logger`](packages/logger)) - Shared logging utility used across apps
- **UI** ([`packages/ui`](packages/ui)) - Reusable React components (counter-button, link)
- **Config: ESLint** ([`packages/config-eslint`](packages/config-eslint)) - Centralized ESLint configuration
- **Config: TypeScript** ([`packages/config-typescript`](packages/config-typescript)) - Centralized TypeScript configuration

### Constants

- **API Events** ([`consts/api`](consts/api)) - Shared event and type constants for API communication

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8.15.6 (package manager)
- **Turbo**: v2.9.14 (monorepo orchestration)

Verify your setup:

```bash
node --version    # Should be >= 18
pnpm --version    # Should be >= 8.15.6
```

## Installation

1. **Clone the repository** (if not already done):

```bash
git clone <repository-url>
cd monorepo-next-nest-vite
```

2. **Install dependencies**:

```bash
pnpm install
```

This command will:
- Install all root-level dependencies
- Install dependencies for all apps and packages
- Link packages within the monorepo
- Create necessary symlinks for workspace packages

## Quick Start

### Start all applications in development mode:

```bash
pnpm dev
```

This runs the dev task for all apps with their default configurations:
- **API**: Runs on default NestJS port (usually 3000)
- **Site**: Runs on port 3002
- **Web**: Runs on Vite's default port (usually 5173)

### Or start individual applications:

```bash
# Start only the API
pnpm dev --filter api

# Start only the Site
pnpm dev --filter site

# Start only the Web app
pnpm dev --filter web
```

## Available Scripts

All commands are run from the root directory and orchestrated by Turbo for caching and parallel execution.

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode with hot reload |
| `pnpm build` | Build all apps and packages for production |
| `pnpm lint` | Run ESLint across all apps and packages |
| `pnpm format` | Format all TypeScript, TSX, and Markdown files with Prettier |
| `pnpm test` | Run tests across all apps and packages |
| `pnpm check-types` | Type-check all TypeScript files |
| `pnpm clean` | Clean all build artifacts and caches |

### App-Specific Scripts

**API** (`apps/api`):
- `dev` - Start in watch mode
- `start` - Run production build
- `start:prod` - Run built distribution
- `test` / `test:watch` / `test:cov` / `test:e2e` - Various Jest testing modes
- `lint` - Run and fix ESLint issues
- `format` - Format with Prettier

**Site** (`apps/site`):
- `dev` - Start Next.js dev server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `check-types` - Type-check with TypeScript

**Web** (`apps/web`):
- `dev` - Start Vite dev server
- `build` - Build for production
- `preview` - Preview production build locally
- `lint` / `lint:fix` - Run/fix ESLint
- `format` / `format:check` - Format with Prettier

## Project Structure

```
monorepo-next-nest-vite/
├── apps/                          # Application packages
│   ├── api/                        # NestJS backend server
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts             # Application entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   ├── site/                       # Next.js SSR application
│   │   ├── src/
│   │   │   └── app/                # Next.js App Router
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       └── styles.css
│   │   ├── public/
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── tsconfig.json
│   └── web/                        # Vite React SPA
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.css
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
├── packages/                       # Shared packages
│   ├── config-eslint/              # ESLint configuration (extends to all apps)
│   │   ├── index.js
│   │   ├── next.js                 # Next.js-specific config
│   │   ├── vite.js                 # Vite-specific config
│   │   └── react.js                # React-specific config
│   ├── config-typescript/          # TypeScript configuration (extends to all apps)
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── vite.json
│   │   └── react-*.json
│   ├── logger/                     # Logging utility (@monorepo/logger)
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── dist/                   # Built output (CJS and ESM)
│   │   └── package.json
│   ├── ui/                         # UI components (@monorepo/ui)
│   │   ├── src/
│   │   │   ├── counter-button/     # React button component
│   │   │   └── link/               # React link component
│   │   ├── dist/                   # Built output (CJS and ESM)
│   │   └── package.json
│   └── scripts/                    # Utility scripts
│       └── generate-exports.mjs    # Auto-generate package exports
├── consts/                         # Shared constants
│   └── api/
│       └── apiEvents.ts            # API event constants
├── package.json                    # Root package configuration
├── pnpm-workspace.yaml             # pnpm workspace configuration
├── turbo.json                      # Turbo monorepo configuration
├── pnpm-lock.yaml                  # Dependency lock file
└── README.md                       # This file
```

## Architecture

### Monorepo Strategy

This project uses **pnpm workspaces** for dependency management and **Turbo** for task orchestration:

- **pnpm workspaces**: Efficient dependency hoisting and workspace package linking
- **Turbo**: Intelligent task caching, parallel execution, and dependency management

### Task Dependencies

Turbo defines task dependencies in [`turbo.json`](turbo.json):

```
build
├── requires: ^build (dependencies must build first)
├── outputs: dist/, .next/, .vercel/, build/
└── caches results for next run

lint
├── requires: ^build and ^lint
└── runs after building and linting dependencies

check-types
├── requires: ^build and ^check-types
└── enforces type safety across monorepo

dev
├── requires: ^build
├── persistent: true
└── no caching (real-time development)

test
└── no dependencies, runs independently
```

### Application Integration

```
┌─────────────────┐
│   Web (Vite)    │────────┐
│   React SPA     │        │
│   Port ~5173    │        │
└─────────────────┘        │
                           ├──► Socket.io
                           │
┌─────────────────┐        │
│ Site (Next.js)  │        │
│ SSR App         │────────┤
│ Port 3002       │        │
└─────────────────┘        │
                           │
┌─────────────────┐        │
│  API (NestJS)   │◄───────┘
│  Backend        │
│  Port ~3000     │
└─────────────────┘
     ▲       │
     │       ▼
┌──────────────────────┐
│   Shared Packages    │
│ - logger             │
│ - ui components      │
│ - constants (events) │
└──────────────────────┘
```

## Development

### Running the Development Environment

Start all apps simultaneously (recommended for full-stack development):

```bash
pnpm dev
```

Monitor Turbo's parallel execution in the terminal UI.

### Working on Individual Apps

To focus on a specific app:

```bash
# API development
cd apps/api
pnpm dev

# Site development
cd apps/site
pnpm dev

# Web development
cd apps/web
pnpm dev
```

From the root, you can also:

```bash
pnpm dev --filter=api
pnpm build --filter=site
pnpm lint --filter=web
```

### Using Shared Packages

All apps have access to shared packages via workspace imports:

```typescript
// In any app, import from shared packages:
import { logger } from "@monorepo/logger";
import { CounterButton } from "@monorepo/ui/counter-button";
import { apiEvents } from "consts/api";
```

The packages are automatically linked during `pnpm install` and built before apps build.

### Code Style and Formatting

Before committing:

```bash
pnpm format       # Auto-format all files
pnpm lint         # Check and fix linting issues
pnpm check-types  # Verify TypeScript compilation
```

These commands run across the entire monorepo.

## Building

### Build for Production

Build all apps and packages:

```bash
pnpm build
```

This will:
1. Build all packages (logger, ui, configs)
2. Build all applications (api, site, web) with task dependencies respected
3. Output production artifacts:
   - API: `dist/`
   - Site: `.next/`
   - Web: `dist/`

### Build Specific Apps

```bash
pnpm build --filter=api
pnpm build --filter=site
pnpm build --filter=web
```

### Running Production Builds

**API**:
```bash
cd apps/api
pnpm start:prod
```

**Site**:
```bash
cd apps/site
pnpm start
```

**Web**:
```bash
cd apps/web
pnpm preview
```

## Testing

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
cd apps/api
pnpm test:watch
```

### Generate Coverage Reports

```bash
cd apps/api
pnpm test:cov
```

## Contributing

### Before Submitting Changes

1. **Format code**:
   ```bash
   pnpm format
   ```

2. **Lint and fix issues**:
   ```bash
   pnpm lint
   ```

3. **Type-check**:
   ```bash
   pnpm check-types
   ```

4. **Run tests** (if applicable):
   ```bash
   pnpm test
   ```

### Commit Guidelines

- Use clear, descriptive commit messages
- Format your code before committing (run `pnpm format`)
- Ensure no lint errors (run `pnpm lint`)
- Include tests for new features

### Adding New Packages

To create a new shared package:

1. Create a directory in `packages/`:
   ```bash
   mkdir packages/my-package
   ```

2. Add a `package.json` with workspace naming convention:
   ```json
   {
     "name": "@monorepo/my-package",
     "version": "0.0.0",
     "private": true
   }
   ```

3. Update `pnpm-workspace.yaml` if using a new directory pattern

4. Run `pnpm install` to link the new package

### Adding New Apps

To add a new application:

1. Create in `apps/`:
   ```bash
   mkdir apps/my-app
   ```

2. Initialize with framework tooling (e.g., `pnpm create next-app`, `npm init vite`, `nest new`)

3. Ensure `package.json` includes required scripts: `dev`, `build`, `lint`

4. Configure to use shared configs and packages

5. Run `pnpm install` to register the new app

## Troubleshooting

### Dependencies not installing

```bash
# Clear cache and reinstall
pnpm install --force
```

### Build failures

```bash
# Clean all build artifacts and try again
pnpm clean
pnpm build
```

### Type errors in IDE

```bash
# Regenerate TypeScript types
pnpm check-types
```

### Monorepo linking issues

```bash
# Rebuild workspace links
pnpm install --shamefully-hoist
```

## License

UNLICENSED

## Support

For questions or issues, please refer to individual app READMEs in their respective directories.

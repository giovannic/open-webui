# SC Web - Development Guide

This folder is a git submodule pointing to a fork of Open WebUI integrated with
the Shared Context (SC) system. This guide covers SC-specific development setup.

## Overview

The web UI is a SvelteKit application with Vite dev server, providing hot
module reloading (HMR) for development. It's deployed as a git submodule from
the `feat/web` branch of the Open WebUI fork.

## Prerequisites

- Node.js 22.x (see `.nvmrc`)
- npm or yarn
- nvm (recommended for Node version management)
- SC Server running on `localhost:3000`
- Git (for submodule management)

## Setup

### 1. Initialize Submodule (if needed)

From the root `/sc` directory:

```bash
git submodule update --init web
```

### 2. Navigate to Web Directory

```bash
cd /Users/gc1610/projects/sc/web
```

### 3. Use Correct Node Version

```bash
nvm use 22
```

Or install Node 22 if not already installed:

```bash
nvm install 22
```

### 4. Install Dependencies

```bash
npm install --legacy-peer-deps
```

Note: `--legacy-peer-deps` is required due to the large number of peer
dependencies in the project.

## Development

### Start Dev Server

```bash
export NODE_OPTIONS=--max-old-space-size=4096
npm run dev
```

- **Memory flag**: Required to prevent out-of-memory errors during build
- **Port**: Typically `http://localhost:5173` (check terminal output)
- **HMR**: Hot module reloading enabled - changes auto-refresh
- **Host flag**: Added via `npm run dev` to allow external connections

### Available Development Scripts

```bash
npm run dev              # Start dev server with HMR
npm run build            # Production build
npm run build:watch      # Rebuild on file changes
npm run preview          # Preview production build locally
npm run lint             # Run linters (frontend, types, backend)
npm run format           # Format code with Prettier
npm run test:frontend    # Run Vitest
npm run cy:open         # Open Cypress E2E test runner
```

### Memory Management

The memory flag is essential for this project:

```bash
export NODE_OPTIONS=--max-old-space-size=4096
```

Add to your shell profile if using frequently:

```bash
# Add to ~/.zshrc or ~/.bashrc
export NODE_OPTIONS=--max-old-space-size=4096
```

## Debugging

### Browser DevTools

1. Open browser to `http://localhost:5173` (or shown URL)
2. Open DevTools (F12 or Cmd+Option+I)
3. **Sources tab**: Set breakpoints in TypeScript/Svelte code
4. **Console**: View logs and errors
5. **Network**: Inspect API calls to SC Server

### Svelte Debugging

- Use Svelte DevTools browser extension (recommended)
- Inspect reactive variables and component state
- Available for Chrome and Firefox

### API Inspection

Monitor calls to SC Server endpoints:

1. Open DevTools **Network** tab
2. Filter by `localhost:3000`
3. Inspect request/response headers and bodies
4. Check timestamps and request timing

## Git Submodule Workflow

### Understanding the Submodule

The web folder is a git submodule pointing to:
- Repository: `https://github.com/giovannic/open-webui`
- Branch: `feat/web` (SC-specific customizations)

### Making Changes

1. **Modify files** in `web/` folder
2. **Test locally** with `npm run dev`
3. **Commit in submodule**:
   ```bash
   cd web
   git add .
   git commit -m "Description of changes"
   git push origin feat/web
   ```

4. **Update SC repo** to reference new submodule commit:
   ```bash
   cd /Users/gc1610/projects/sc
   git add web
   git commit -m "Update web submodule reference"
   git push
   ```

### Updating from Upstream

To pull latest changes from the fork:

```bash
cd web
git pull origin feat/web
cd ..
npm install  # Update dependencies if needed
```

## Integration with SC System

### SC Server Connection

The web UI connects to SC Server for all context operations:

```
Web UI (SvelteKit + Svelte)
    ↓ (HTTP REST calls)
SC Server (Express + Node.js)
    ↓
PostgreSQL Database
```

### API Integration Points

- **Context Creation**: POST `/contexts`
- **Context Reading**: GET `/contexts/:id/context`
- **Entry Addition**: POST `/contexts/:id/context`
- **README Updates**: PUT `/contexts/:id/readme`
- **Real-time Updates**: WebSocket at `/contexts/:id/subscribe`

All integration code is in the `/src` folder (SvelteKit structure).

## Building for Production

### Development Build

```bash
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

Output goes to `.svelte-kit/` and `build/` directories.

### Watch Mode Build

Useful for incremental production builds:

```bash
export NODE_OPTIONS=--max-old-space-size=4096
npm run build:watch
```

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

## Environment Variables

If needed for SC Server configuration, create `.env`:

```
VITE_SC_SERVER_URL=http://localhost:3000
```

Usage in code:

```typescript
const serverUrl = import.meta.env.VITE_SC_SERVER_URL ||
                  'http://localhost:3000';
```

## Testing

### Frontend Unit Tests

```bash
npm run test:frontend
```

Uses Vitest for TypeScript/Svelte component testing.

### End-to-End Tests

```bash
npm run cy:open
```

Opens Cypress interactive test runner.

Run tests headless:

```bash
npm run cy:run  # If script exists
```

## Troubleshooting

### Out of Memory During Build

```bash
export NODE_OPTIONS=--max-old-space-size=4096
```

If still failing, try 8GB:

```bash
export NODE_OPTIONS=--max-old-space-size=8192
```

### Port Already in Use

Default port 5173. To use different port:

```bash
npm run dev -- --port 5174
```

### Submodule Out of Sync

Reset to tracked commit:

```bash
cd /Users/gc1610/projects/sc
git submodule update --init
```

### Node Version Mismatch

Verify correct version:

```bash
node --version  # Should be v22.x.x
nvm use 22
node --version
```

### Dependencies Not Installing

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Development Workflow Summary

### Quick Start (from repo root)

```bash
# Terminal 1: Start SC Server
cd server && npm run dev

# Terminal 2: Start Web UI
cd web
nvm use 22
export NODE_OPTIONS=--max-old-space-size=4096
npm run dev

# Terminal 3: (Optional) Start MCP Server
cd mcp && npm run dev
```

Then open `http://localhost:5173` in browser.

### Making Changes

1. Edit files in `web/src/`
2. Save - changes auto-reload in browser (HMR)
3. Test in browser DevTools
4. Commit when ready (in submodule repo)

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | SvelteKit | 2.5.27 |
| UI | Svelte | 5.x |
| Build Tool | Vite | 5.4.14 |
| Styling | Tailwind CSS | 4.0 |
| Language | TypeScript | Latest |
| Testing | Vitest + Cypress | Latest |
| Runtime | Node.js | 22.x |

## Performance Notes

- HMR is very fast for Svelte components (usually <500ms)
- Full rebuild takes 1-2 minutes (hence watch mode is useful)
- 4GB Node memory flag prevents OOM during builds
- Production builds are optimized with code splitting and tree-shaking

## Contributing

When making changes to SC web integration:

1. Follow TypeScript strict mode
2. Keep line length under 80 characters
3. Run linter and tests before committing
4. Document changes in commit message

## Additional Resources

- [Svelte Docs](https://svelte.dev/docs)
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Vite Docs](https://vitejs.dev/)
- [Open WebUI Docs](https://docs.openwebui.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

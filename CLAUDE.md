# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun run dev              # Start Electron app in development mode

# Testing
bun test                 # Run all tests with Bun test runner
bun test src/__tests__/common.test.ts  # Run specific test file

# Building
bun run package          # Generate platform-specific executable
bun run make             # Generate platform-specific installer

# Linting
bun run lint             # Run Ultracite (Biome) checks
```

## Architecture

Shutdown Scheduler is an Electron desktop app that schedules shutdown/reboot tasks using native OS schedulers.

### Process Structure (Electron)

- **Main Process** (`src/main.ts`): Creates browser window, handles IPC communication, manages app lifecycle
- **Preload Script** (`src/preload.ts`): Bridge between main and renderer processes, contains all task scheduling logic
- **Renderer Process** (`src/frontend/`): React UI with TanStack Query for state management

### Platform-Specific Scheduling

The app uses native OS schedulers for reliability (tasks persist even when app is closed):

| Platform         | One-time Tasks | Recurring Tasks |
| ---------------- | -------------- | --------------- |
| macOS/Linux/Unix | `at` command   | `cron` jobs     |

Task state is persisted to `taskDatabase.json` in the user data directory.

### Key Files

- `src/common.ts`: Shared constants and types (`DayOfWeek`, `taskNamePrefix`)
- `src/preload.ts`: Core scheduling API exposed via `contextBridge` as `window.bridge`
- `src/frontend/app.tsx`: Main React component with TanStack Query mutations/queries
- `forge.config.ts`: Electron Forge configuration for building/packaging

### IPC Bridge API (`window.bridge`)

```typescript
getTasks()           // List all scheduled tasks
createTask({...})    // Schedule new shutdown/reboot
deleteTask({...})    // Remove specific task
deleteAllTasks()     // Remove all tasks
enableTask({...})    // Enable disabled task
disableTask({...})   // Disable task
```

### Path Aliases

Uses `@/*` for imports from `./src/*` (configured in `tsconfig.json`).

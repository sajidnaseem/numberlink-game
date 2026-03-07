# Numberlink Game

A React Native (Expo) Numberlink puzzle app with Redux Toolkit state management, RTK Query data fetching, and TypeScript across app code.

## Features

- Level list loaded from a mock API
- Dynamic NxN Numberlink gameplay with drag-to-draw paths
- Win detection (all pairs connected and board fully filled)
- In-game timer and score submission
- Per-level scoreboard (`GET /scores?levelId=...`) shown in game UI
- Hint action powered by level solution lookup
- Redux DevTools support (remote devtools)

## Tech Stack

- Expo + React Native
- Redux Toolkit + RTK Query
- React Redux
- Prism mock server + Swagger UI (Docker)

## Project Structure

- `App.tsx` - root app shell and screen switching
- `src/screens/LevelListScreen.tsx` - level selection UI
- `src/screens/GameScreen.tsx` - gameplay screen composition and wiring
- `src/components/GameGrid.tsx` - drag interaction and grid rendering
- `src/components/LevelScoreboard.tsx` - reusable scoreboard panel
- `src/components/WinCard.tsx` - reusable post-win UI card
- `src/hooks/useGameTimer.ts` - timer and completion-time logic
- `src/hooks/useScoreSubmission.ts` - score submit side effects and retry
- `src/hooks/useHint.ts` - hint request/apply flow and alerts
- `src/utils/gameLogic.ts` - core Numberlink rules and win checks
- `src/store/api/` - RTK Query API slices for levels and scores
- `src/store/index.ts` - Redux store setup and typed exports (`RootState`, `AppDispatch`)
- `src/store/api/schemas.ts` - shared API domain/request/response TypeScript types
- `mock-api/openapi.yaml` - API contract used by mock server

## Architecture Decisions

- **UI flow kept simple:** `App.tsx` switches between list and game screens via Redux-selected state instead of adding a navigation library. This keeps dependencies low for a 2-screen app.
- **State split by responsibility:**
  - gameplay paths live in Redux (`gameSlice`) so grid and game screen share a single source of truth
  - server data (levels/scores) uses RTK Query for caching, loading/error states, and mutation lifecycle
- **Rules isolated in pure utils:** move legality and win checks are centralized in `src/utils/gameLogic.ts`, making gameplay behavior independent from React rendering concerns.
- **GameGrid handles gesture mechanics only:** drag handling and cell hit-testing live in `src/components/GameGrid.tsx`; business rules remain in utility functions.
- **Business logic extracted into custom hooks:** timer flow (`useGameTimer`), score submission (`useScoreSubmission`), and hints (`useHint`) are separated from `GameScreen` rendering code.
- **Reusable common components:** scoreboard and win UI are extracted into `LevelScoreboard` and `WinCard` to keep the screen component clean and easier to maintain.
- **Optimistic win UX:** completion time is frozen immediately, then score submission runs asynchronously so network latency does not block the win state.
- **Contract-first backend mock:** Prism serves `mock-api/openapi.yaml` so frontend API behavior is aligned to a documented schema.

## Solver Approach

- The app does not currently run a local search/backtracking solver.
- `solveLevel(level)` computes a deterministic `levelId` from the level payload and calls `GET /levels/{levelId}`.
- If the response includes `solution.paths`, that server-provided full solution is treated as the source of truth.
- The hint action applies one guided move from that solution using `applyHintMove(...)`.
- If no solution is available (or request fails), the app shows a "Board unsolvable" / failure message and continues without mutating board state.

## Tradeoffs and Incomplete Areas

- **Backend level availability:** the frontend supports dynamic board sizes, but your active mock data may still primarily provide 5x5 levels.
- **Hint coupling to backend:** hints depend on API-provided solutions; offline/local solving is not implemented.
- **No persistence for play session:** current paths/timer are in-memory only (no local storage/restore after app restart).
- **Limited gameplay tooling:** no undo stack, checkpointing, or move history yet.
- **Minimal error/retry surface:** score submission has retry and scoreboard has load/error states, but level loading and hint fetch still rely on basic alert/error UI.
- **Testing/documentation gaps:** automated tests for rules, hints, and screen flows are not included yet.

## Prerequisites

- Node.js 18+ (recommended)
- npm
- Docker Desktop (for mock API)
- Expo Go app or simulator/emulator

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the mock API:

```bash
npm run backend:start
```

3. Start the app:

```bash
npm start
```

4. Open in your target platform:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go on a physical device

## API Base URL Notes

The app reads base URL from `src/config/api.js`:

- iOS simulator default: `http://localhost:4010`
- Android emulator default: `http://10.0.2.2:4010`
- Physical device: set your machine LAN IP via env var:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:4010 npm start
```

## Available Scripts

- `npm start` - start Expo dev server
- `npm run android` - launch Expo in Android mode
- `npm run ios` - launch Expo in iOS mode
- `npm run web` - run Expo web target
- `npm run backend:start` - start mock API stack
- `npm run backend:stop` - stop mock API stack
- `npm run devtools` - start remote Redux DevTools server on port 8000
- `npx tsc --noEmit` - run TypeScript type-checking

## TypeScript Notes

- TypeScript config lives in `tsconfig.json` (extends Expo base config).
- App, screens, components, hooks, utils, and Redux store/API layers are migrated to `.ts`/`.tsx`.
- `index.js` remains as the Expo entry file and imports `App` from `App.tsx`.

## Mock API Endpoints

Main API base: `http://localhost:4010`

- `GET /levels`
- `GET /levels/{levelId}`
- `POST /levels`
- `GET /scores`
- `GET /scores?levelId={id}`
- `POST /scores`

Swagger docs are available through the Docker stack at the `/docs` route.

## Gameplay Rules (Implemented)

- Grid size comes from `level.size`
- Connect each color pair from one endpoint to the other
- Move orthogonally only (up/down/left/right)
- Paths cannot overlap or cross
- Puzzle is solved only when:
  - every pair is connected, and
  - all grid cells are filled

## Troubleshooting

- **No levels shown**: ensure mock API is running with `npm run backend:start`
- **Android cannot reach API**: use `10.0.2.2` or set `EXPO_PUBLIC_API_BASE_URL`
- **Physical device cannot reach API**: use your computer LAN IP and same Wi-Fi network

## Stop Services

```bash
npm run backend:stop
```


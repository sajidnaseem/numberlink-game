# Quick Start

## Start the Mock API Server

```bash
docker-compose up -d
```

## Stop the Server

```bash
docker-compose down
```

## API Endpoints

Base URL: `http://localhost:4010`

### Levels

- `GET /levels` - List available levels
- `GET /levels?difficulty=easy&limit=10` - Filter by difficulty
- `POST /levels` - Create a new level
- `GET /levels/{levelId}` - Get a specific level

### Scores

- `GET /scores` - Get all scores
- `GET /scores?levelId={id}` - Get scores for a specific level
- `POST /scores` - Submit a score

## Documentation

Interactive API docs with examples and schemas: `http://localhost:4010/docs`

## Using from the Expo app

- **Browser / iOS Simulator:** `http://localhost:4010` works.
- **Android Emulator:** The app uses `http://10.0.2.2:4010` in dev (see `src/config/api.js`).
- **Physical device:** Set your machine’s LAN IP, e.g. in `.env`: `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:4010`, then restart Expo.

If `GET /levels?difficulty=easy` fails from the app, ensure the mock server is running (`docker-compose up -d`) and use the correct base URL for your environment.


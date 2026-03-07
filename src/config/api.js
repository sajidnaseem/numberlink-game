/**
 * API base URL for the Numberlink mock API (mock-api/openapi.yaml).
 *
 * - Run the mock server first:
 *   cd mock-api && docker-compose up -d
 *
 * - From your computer's browser or curl: http://localhost:4010/levels?difficulty=easy
 *
 * - From the Expo app:
 *   - iOS Simulator: localhost works
 *   - Android Emulator: use 10.0.2.2 to reach your machine (set below)
 *   - Physical device: use your computer's LAN IP (e.g. 192.168.1.100)
 *
 * Override with EXPO_PUBLIC_API_BASE_URL if you use .env (e.g. EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4010).
 */
import { Platform } from 'react-native';

const getDefaultBaseUrl = () => {
  // Android emulator: 10.0.2.2 is the host machine's localhost
  if (Platform.OS === 'android' && __DEV__) {
    return 'http://10.0.2.2:4010';
  }
  return 'http://localhost:4010';
};

// EXPO_PUBLIC_* is available in Expo at build time
export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) ||
  getDefaultBaseUrl();

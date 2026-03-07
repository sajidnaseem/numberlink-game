import { API_BASE_URL } from '../config/api';
import type { Level, Solution } from '../store/api/schemas';
import { getLevelId } from './levelId';

export async function solveLevel(level: Level, baseUrl?: string): Promise<Solution | null> {
  if (!level?.pairs?.length) return null;
  const url = baseUrl ?? getApiBaseUrl();
  const levelId = await getLevelId(level);
  const res = await fetch(`${url.replace(/\/$/, '')}/levels/${encodeURIComponent(levelId)}`, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  });
  if (!res.ok) return null;
  const data: unknown = await res.json();
  const solution = (data as { solution?: Solution | null } | null)?.solution ?? null;
  return solution && typeof solution === 'object' && solution.paths ? solution : null;
}

function getApiBaseUrl(): string {
  return API_BASE_URL || 'http://localhost:4010';
}

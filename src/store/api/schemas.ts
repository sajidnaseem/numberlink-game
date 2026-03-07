/**
 * API request/response shapes aligned with mock-api/openapi.yaml.
 * Do not change these without updating the OpenAPI schema.
 *
 * Schema: mock-api/openapi.yaml (Numberlink Take-Home Mock API v1.0.0)
 * Base URL: http://localhost:4010
 */

export const DIFFICULTY = ['easy', 'medium', 'hard'] as const;

export type Difficulty = (typeof DIFFICULTY)[number];

/** x,y in [0,size-1] */
export type Cell = {
  x: number;
  y: number;
};

export type Pair = {
  /** 1-10 chars, e.g. "A", "B" */
  id: string;
  /** Hex, e.g. "#e74c3c" */
  color: string;
  start: Cell;
  end: Cell;
};

export type Level = {
  size: number;
  difficulty: Difficulty;
  /** 2-8 items */
  pairs: Pair[];
};

export type LevelListItem = {
  levelId: string;
  size: number;
  difficulty: Difficulty;
  pairCount: number;
  /** date-time */
  createdAt: string;
};

export type LevelListResponse = {
  levels: LevelListItem[];
  total: number;
};

export type LevelMeta = {
  levelId: string;
  /** date-time */
  createdAt: string;
};

export type CreateLevelRequest = {
  level: Level;
  notes?: string;
};

export type CreateLevelResponse = {
  meta: {
    levelId: string;
    createdAt: string;
  };
};

export type Solution = {
  /** pairId -> ordered cells (incl. endpoints) */
  paths: Record<string, Cell[]>;
};

export type GetLevelResponse = {
  meta: LevelMeta;
  level: Level;
  solution?: Solution;
};

export type CreateScoreRequest = {
  levelId: string;
  /** non-negative */
  durationMs: number;
  /** non-negative */
  moves?: number;
  /** max 32 chars */
  playerName?: string;
};

export type ScoreEntry = {
  scoreId: string;
  levelId: string;
  durationMs: number;
  moves?: number;
  playerName?: string;
  /** date-time */
  createdAt: string;
};

export type ScoreOrder = 'asc' | 'desc';

export type ScoreboardResponse = {
  scores: ScoreEntry[];
  total: number;
};

export type CreateScoreResponse = {
  score: ScoreEntry;
};

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

import type { Cell, Level } from '../store/api/schemas';

const DEFAULT_SIZE = 5;

export type PathCell = {
  x: number | string;
  y: number | string;
};

export type Paths = Record<string, PathCell[]>;

export function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function getLevelSize(level: Level | null | undefined): number {
  const n = Number(level?.size);
  return Number.isInteger(n) && n > 1 ? n : DEFAULT_SIZE;
}

export function neighbors(x: number, y: number, size: number): Cell[] {
  const n: Cell[] = [];
  if (x > 0) n.push({ x: x - 1, y });
  if (x < size - 1) n.push({ x: x + 1, y });
  if (y > 0) n.push({ x, y: y - 1 });
  if (y < size - 1) n.push({ x, y: y + 1 });
  return n;
}

export function getEndpointMap(level: Level): Map<string, { pairId: string; color: string }> {
  const map = new Map<string, { pairId: string; color: string }>();
  for (const p of level.pairs) {
    map.set(cellKey(p.start.x, p.start.y), { pairId: p.id, color: p.color });
    map.set(cellKey(p.end.x, p.end.y), { pairId: p.id, color: p.color });
  }
  return map;
}

export function getPathCellMap(paths: Paths | null | undefined): Map<string, { pairId: string }> {
  const map = new Map<string, { pairId: string }>();
  if (!paths) return map;
  for (const [pairId, cells] of Object.entries(paths)) {
    if (!Array.isArray(cells)) continue;
    for (const c of cells) {
      map.set(cellKey(Number(c.x), Number(c.y)), { pairId });
    }
  }
  return map;
}

export function canExtendTo(
  level: Level,
  paths: Paths,
  pairId: string,
  x: number,
  y: number
): boolean {
  const size = getLevelSize(level);
  const endpointMap = getEndpointMap(level);
  const pathMap = getPathCellMap(paths);
  const pair = level.pairs.find((p) => p.id === pairId);
  if (!pair) return false;
  const path = paths[pairId];
  if (!path || path.length === 0) return false;
  const last = path[path.length - 1];

  const k = cellKey(x, y);
  const endpoint = endpointMap.get(k);
  const existing = pathMap.get(k);
  const isAdjacentToLast = neighbors(Number(last.x), Number(last.y), size).some(
    (c) => c.x === x && c.y === y
  );

  if (endpoint && endpoint.pairId === pairId) {
    return isAdjacentToLast;
  }
  if (existing && existing.pairId !== pairId) return false;
  if (existing && existing.pairId === pairId) {
    if (Number(last.x) === x && Number(last.y) === y) return true;
    if (path.length < 2) return false;
    const prev = path[path.length - 2];
    return Number(prev.x) === x && Number(prev.y) === y;
  }

  return isAdjacentToLast;
}

function cellEq(a: PathCell, b: PathCell): boolean {
  return Number(a.x) === Number(b.x) && Number(a.y) === Number(b.y);
}

function getPathForPair(paths: Paths | null | undefined, pairId: string): PathCell[] | null {
  if (paths == null || typeof paths !== 'object') return null;
  const path = paths[pairId] ?? paths[String(pairId)];
  if (path && Array.isArray(path)) return path;
  for (const key of Object.keys(paths)) {
    if (String(key) === String(pairId) && Array.isArray(paths[key])) return paths[key];
  }
  return null;
}

export function checkWin(level: Level | null | undefined, paths: Paths | null | undefined): boolean {
  const size = getLevelSize(level);
  if (!level?.pairs?.length || !paths || typeof paths !== 'object') return false;
  const filled = new Set<string>();
  for (const p of level.pairs) {
    const path = getPathForPair(paths, p.id);
    if (!path || path.length < 2) return false;
    const first = path[0];
    const last = path[path.length - 1];
    const firstIsStart = cellEq(first, p.start);
    const firstIsEnd = cellEq(first, p.end);
    const lastIsStart = cellEq(last, p.start);
    const lastIsEnd = cellEq(last, p.end);
    const connected = (firstIsStart && lastIsEnd) || (firstIsEnd && lastIsStart);
    if (!connected) return false;
    for (const c of path) {
      filled.add(cellKey(Number(c.x), Number(c.y)));
    }
  }
  return filled.size === size * size;
}

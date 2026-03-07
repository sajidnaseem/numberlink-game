import type { Cell, Level, Solution } from '../store/api/schemas';
import { checkWin } from './gameLogic';

type Paths = Record<string, Cell[]>;

type HintMove = {
  pairId: string;
  cell: Cell;
};

function cellEq(a: Cell, b: Cell): boolean {
  return a.x === b.x && a.y === b.y;
}

export function getNextHintMove(
  level: Level,
  paths: Paths,
  solution: Solution
): HintMove | null {
  if (!level?.pairs || !solution?.paths) return null;
  if (checkWin(level, paths)) return null;

  for (const pair of level.pairs) {
    const pairId = pair.id;
    const sol = solution.paths[pairId];
    if (!sol || sol.length < 2) continue;

    const path = paths[pairId] || [];
    if (path.length >= sol.length) continue;

    let nextCell: Cell | null = null;

    if (path.length === 0) {
      nextCell = sol[1];
    } else {
      const matchForward = path.every((c, i) => cellEq(c, sol[i]));
      if (matchForward) {
        nextCell = sol[path.length];
      } else {
        const matchBackward = path.every((c, i) => cellEq(c, sol[sol.length - 1 - i]));
        if (matchBackward) {
          nextCell = sol[sol.length - 1 - path.length];
        }
      }
    }

    if (nextCell) return { pairId, cell: nextCell };
  }

  return null;
}

export function applyHintMove(
  level: Level,
  paths: Paths,
  solution: Solution
): Paths | null {
  const move = getNextHintMove(level, paths, solution);
  if (!move) return null;

  const { pairId, cell } = move;
  const path = paths[pairId] || [];
  const sol = solution.paths[pairId];

  let newPath: Cell[];
  if (path.length === 0) {
    newPath = [sol[0], cell];
  } else {
    newPath = [...path, cell];
  }

  return { ...paths, [pairId]: newPath };
}

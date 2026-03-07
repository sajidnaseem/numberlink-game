import test from 'node:test';
import assert from 'node:assert/strict';

import { checkWin, getLevelSize, type Paths } from './gameLogic';
import type { Level } from '../store/api/schemas';

const level3x3: Level = {
  size: 3,
  difficulty: 'easy',
  pairs: [
    {
      id: 'A',
      color: '#ff0000',
      start: { x: 0, y: 0 },
      end: { x: 2, y: 0 },
    },
    {
      id: 'B',
      color: '#00ff00',
      start: { x: 0, y: 1 },
      end: { x: 2, y: 1 },
    },
    {
      id: 'C',
      color: '#0000ff',
      start: { x: 0, y: 2 },
      end: { x: 2, y: 2 },
    },
  ],
};

test('getLevelSize returns fallback when size is invalid', () => {
  const invalidLevel = {
    ...level3x3,
    size: 1,
  };

  assert.equal(getLevelSize(invalidLevel), 5);
  assert.equal(getLevelSize(null), 5);
});

test('checkWin returns true when all pairs are connected and board is full', () => {
  const solvedPaths: Paths = {
    A: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    B: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    C: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
  };

  assert.equal(checkWin(level3x3, solvedPaths), true);
});

test('checkWin returns false when any cell is unfilled', () => {
  const notFullyFilled: Paths = {
    A: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    B: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    C: [
      { x: 0, y: 2 },
      { x: 2, y: 2 },
    ],
  };

  assert.equal(checkWin(level3x3, notFullyFilled), false);
});

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import {
  getEndpointMap,
  getPathCellMap,
  canExtendTo,
  cellKey,
  getLevelSize,
} from '../utils/gameLogic';
import type { Cell, Level } from '../store/api/schemas';

type Paths = Record<string, Cell[]>;

type GameGridProps = {
  level: Level;
  paths: Paths;
  onPathsChange: (paths: Paths) => void;
  disabled: boolean;
};

type CellProps = {
  x: number;
  y: number;
  level: Level;
  paths: Paths;
  cellSize: number;
};

type GridLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function CellView({ x, y, level, paths, cellSize }: CellProps) {
  const endpointMap = getEndpointMap(level);
  const pathMap = getPathCellMap(paths);
  const k = cellKey(x, y);
  const endpoint = endpointMap.get(k);
  const pathInfo = pathMap.get(k);
  const pair = endpoint
    ? level.pairs.find((p) => p.id === endpoint.pairId)
    : pathInfo
      ? level.pairs.find((p) => p.id === pathInfo.pairId)
      : null;
  const color = pair ? pair.color : '#e8e8e8';
  const isEndpoint = Boolean(endpoint);

  return (
    <View
      style={[
        styles.cell,
        {
          width: cellSize - 2,
          height: cellSize - 2,
          backgroundColor: color,
          borderRadius: isEndpoint ? cellSize / 2 : 4,
        },
      ]}
    />
  );
}

export default function GameGrid({ level, paths, onPathsChange, disabled }: GameGridProps) {
  const gridSize = getLevelSize(level);
  const cellSize = Math.min(64, (Dimensions.get('window').width - 48) / gridSize);
  const gridPx = cellSize * gridSize;
  const [gridLayout, setGridLayout] = useState<GridLayout | null>(null);
  const layoutRef = useRef<Partial<GridLayout>>({});
  const activePairRef = useRef<string | null>(null);
  const lastCellRef = useRef<Cell | null>(null);
  const pathsRef = useRef<Paths>(paths);
  pathsRef.current = paths;

  useEffect(() => {
    if (!paths || Object.keys(paths).length === 0) {
      activePairRef.current = null;
      lastCellRef.current = null;
    }
  }, [paths]);

  const PAD = 2;
  const getCellFromPosition = (pageX: number, pageY: number): Cell | null => {
    const layout = gridLayout || layoutRef.current;
    if (layout == null || layout.x == null || layout.y == null) return null;
    const rx = pageX - layout.x - PAD;
    const ry = pageY - layout.y - PAD;
    if (rx < 0 || ry < 0 || rx >= gridPx || ry >= gridPx) return null;
    const col = Math.floor(rx / cellSize);
    const row = Math.floor(ry / cellSize);
    if (col >= gridSize || row >= gridSize) return null;
    return { x: col, y: row };
  };

  const beginFromEndpoint = (
    cell: Cell,
    endpoint: { pairId: string; color: string },
    currentPaths: Paths
  ) => {
    activePairRef.current = endpoint.pairId;
    const existingPath = currentPaths[endpoint.pairId] || [];
    if (existingPath.length > 0) {
      const first = existingPath[0];
      const last = existingPath[existingPath.length - 1];
      const atFirst = first.x === cell.x && first.y === cell.y;
      const atLast = last.x === cell.x && last.y === cell.y;

      if (atFirst || atLast) {
        lastCellRef.current = cell;
        return;
      }
    }

    const newPaths = { ...currentPaths, [endpoint.pairId]: [{ x: cell.x, y: cell.y }] };
    onPathsChange(newPaths);
    lastCellRef.current = cell;
  };

  const handleCell = (pageX: number, pageY: number) => {
    if (disabled) return;
    const cell = getCellFromPosition(pageX, pageY);
    if (!cell) return;

    const currentPaths = pathsRef.current;
    const endpointMap = getEndpointMap(level);
    const k = cellKey(cell.x, cell.y);
    const endpoint = endpointMap.get(k);

    if (activePairRef.current == null) {
      if (endpoint) {
        beginFromEndpoint(cell, endpoint, currentPaths);
      }
      return;
    }

    const pairId = activePairRef.current;
    if (endpoint && endpoint.pairId !== pairId) {
      beginFromEndpoint(cell, endpoint, currentPaths);
      return;
    }

    if (canExtendTo(level, currentPaths, pairId, cell.x, cell.y)) {
      const currentPath = currentPaths[pairId] || [];
      const last = lastCellRef.current;
      if (last && last.x === cell.x && last.y === cell.y) return;
      const isBacktrack = currentPath.length >= 2 &&
        currentPath[currentPath.length - 2].x === cell.x &&
        currentPath[currentPath.length - 2].y === cell.y;
      if (isBacktrack) {
        const next = [...currentPath.slice(0, -1)];
        if (next.length === 0) {
          activePairRef.current = null;
          lastCellRef.current = null;
          const { [pairId]: _removed, ...rest } = currentPaths;
          onPathsChange(rest);
        } else {
          const newPaths = { ...currentPaths, [pairId]: next };
          onPathsChange(newPaths);
          lastCellRef.current = next[next.length - 1];
        }
        return;
      }

      const isOtherEndpoint = endpoint && endpoint.pairId === pairId;
      const newPath = [...currentPath, { x: cell.x, y: cell.y }];
      const newPaths = { ...currentPaths, [pairId]: newPath };
      onPathsChange(newPaths);
      lastCellRef.current = cell;
      if (isOtherEndpoint) {
        activePairRef.current = null;
        lastCellRef.current = null;
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { pageX, pageY } = e.nativeEvent;
        handleCell(pageX, pageY);
      },
      onPanResponderMove: (e) => {
        const { pageX, pageY } = e.nativeEvent;
        handleCell(pageX, pageY);
      },
      onPanResponderRelease: () => {
        // Keep active pair between drags; user can continue path after lifting.
      },
    })
  ).current;

  const gridRef = useRef<View | null>(null);
  const measureGrid = () => {
    gridRef.current?.measureInWindow((fx, fy, w, h) => {
      layoutRef.current = { x: fx, y: fy, width: w, height: h };
      setGridLayout(layoutRef.current as GridLayout);
    });
  };

  return (
    <View
      ref={gridRef}
      style={[styles.grid, { width: gridPx + 4, height: gridPx + 4 }]}
      onLayout={measureGrid}
      {...panResponder.panHandlers}
    >
      {Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => (
          <CellView
            key={`${col}-${row}`}
            x={col}
            y={row}
            level={level}
            paths={paths}
            cellSize={cellSize}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ccc',
    padding: 2,
    borderRadius: 8,
  },
  cell: {
    margin: 1,
  },
});

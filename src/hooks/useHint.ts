import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { Cell, Level } from '../store/api/schemas';
import { solveLevel } from '../utils/solveLevel';
import { applyHintMove } from '../utils/hintLogic';

type Paths = Record<string, Cell[]>;

type UseHintParams = {
  level: Level | null | undefined;
  paths: Paths;
  won: boolean;
  onApplyPaths: (paths: Paths) => void;
};

export function useHint({ level, paths, won, onApplyPaths }: UseHintParams) {
  const [hintLoading, setHintLoading] = useState(false);

  const requestHint = useCallback(async () => {
    if (!level || won || hintLoading) return;
    setHintLoading(true);
    try {
      const solution = await solveLevel(level);
      if (!solution) {
        Alert.alert(
          'Board unsolvable',
          'No solution is available for this level (or the server could not be reached).'
        );
        return;
      }
      const newPaths = applyHintMove(level, paths, solution);
      if (!newPaths) {
        Alert.alert(
          'No hint',
          'You’re already done, or your current path doesn’t match the solution. Try Reset and use hints from the start.'
        );
        return;
      }
      onApplyPaths(newPaths);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Could not get hint. Check your connection.';
      Alert.alert('Hint failed', message);
    } finally {
      setHintLoading(false);
    }
  }, [level, won, hintLoading, paths, onApplyPaths]);

  return { hintLoading, requestHint };
}

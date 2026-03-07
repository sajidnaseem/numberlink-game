import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import GameGrid from '../components/GameGrid';
import LevelScoreboard from '../components/LevelScoreboard';
import WinCard from '../components/WinCard';
import { checkWin } from '../utils/gameLogic';
import { useGetLevelQuery } from '../store/api';
import { selectPaths, setPaths, resetPaths } from '../store/gameSlice';
import { useGameTimer } from '../hooks/useGameTimer';
import { useScoreSubmission } from '../hooks/useScoreSubmission';
import { useHint } from '../hooks/useHint';
import type { Cell, Level } from '../store/api/schemas';

type GameScreenProps = {
  levelId: string | null;
  onBack: () => void;
};

type Paths = Record<string, Cell[]>;

/** Format milliseconds as m:ss */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function GameScreen({ levelId, onBack }: GameScreenProps) {
  const dispatch = useDispatch();
  const paths = useSelector(selectPaths) as Paths;
  const { data, isLoading, error } = useGetLevelQuery(levelId ?? '', { skip: !levelId });

  const level = (data?.level ?? null) as Level | null;
  const won = useMemo(() => Boolean(level && checkWin(level, paths)), [level, paths]);
  const { displayTimeMs, completedDurationMs, resetTimer } = useGameTimer(level, won);
  const {
    submitLoading,
    submitError,
    submitSuccess,
    retrySubmit,
    resetSubmission,
  } = useScoreSubmission({
    levelId,
    won,
    completedDurationMs,
  });
  const { hintLoading, requestHint } = useHint({
    level,
    paths,
    won,
    onApplyPaths: (newPaths) => dispatch(setPaths(newPaths)),
  });

  const handleReset = () => {
    dispatch(resetPaths());
    resetTimer();
    resetSubmission();
  };
  const handlePlayAgain = () => handleReset();

  const handlePathsChange = (newPaths: Paths) => dispatch(setPaths(newPaths));

  if (isLoading || !levelId) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading level…</Text>
      </View>
    );
  }

  if (error || !level) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Could not load level.</Text>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Back to levels</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            {level.difficulty} · {level.pairs?.length ?? 0} pairs
          </Text>
          <Text style={styles.timer}>
            {formatTime(displayTimeMs)}
          </Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.hintButton, hintLoading && styles.hintButtonDisabled]}
          onPress={requestHint}
          disabled={won || hintLoading}
        >
          {hintLoading ? (
            <ActivityIndicator size="small" color="#f1c40f" />
          ) : (
            <Text style={styles.hintButtonText}>Hint</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridWrap}>
        <GameGrid
          level={level}
          paths={paths}
          onPathsChange={handlePathsChange}
          disabled={won}
        />
      </View>

      <LevelScoreboard levelId={levelId} />

      {won && (
        <WinCard
          timeLabel={formatTime(displayTimeMs)}
          submitLoading={submitLoading}
          submitSuccess={submitSuccess}
          submitError={submitError}
          onRetrySubmit={retrySubmit}
          onBack={onBack}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 56,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 24,
  },
  loadingText: {
    color: '#eee',
    marginTop: 12,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  hintButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1c40f',
  },
  hintButtonDisabled: {
    opacity: 0.7,
  },
  hintButtonText: {
    color: '#f1c40f',
    fontSize: 15,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 8,
    paddingLeft: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    color: '#eee',
    fontSize: 16,
    fontWeight: '600',
  },
  timer: {
    color: '#95a5a6',
    fontSize: 14,
    marginTop: 2,
  },
  gridWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});

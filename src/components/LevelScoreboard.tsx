import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useListScoresQuery } from '../store/api';
import type { ScoreEntry } from '../store/api/schemas';

type LevelScoreboardProps = {
  levelId: string | null;
  limit?: number;
};

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LevelScoreboard({ levelId, limit = 5 }: LevelScoreboardProps) {
  const {
    data: scoreboardData,
    isLoading,
    isError,
  } = useListScoresQuery(
    { levelId: levelId ?? '', limit, order: 'asc' },
    { skip: !levelId }
  );

  const scoreboard = (scoreboardData?.scores ?? []) as ScoreEntry[];

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Top Scores</Text>
      {isLoading ? (
        <Text style={styles.hint}>Loading scores…</Text>
      ) : isError ? (
        <Text style={styles.error}>Could not load scores.</Text>
      ) : scoreboard.length === 0 ? (
        <Text style={styles.hint}>No scores yet for this level.</Text>
      ) : (
        scoreboard.map((entry, idx) => (
          <View key={entry.scoreId} style={styles.row}>
            <Text style={styles.rank}>{idx + 1}.</Text>
            <Text style={styles.name} numberOfLines={1}>
              {entry.playerName?.trim() || 'Anonymous'}
            </Text>
            <Text style={styles.time}>{formatTime(entry.durationMs)}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 24,
    marginBottom: 8,
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  title: {
    color: '#eee',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  hint: {
    color: '#95a5a6',
    fontSize: 13,
  },
  error: {
    color: '#e67e22',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rank: {
    color: '#95a5a6',
    width: 24,
    fontSize: 13,
  },
  name: {
    color: '#eee',
    flex: 1,
    fontSize: 13,
    marginRight: 8,
  },
  time: {
    color: '#2ecc71',
    fontWeight: '600',
    fontSize: 13,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  type ListRenderItem,
} from 'react-native';
import { useListLevelsQuery } from '../store/api';
import type { LevelListItem } from '../store/api/schemas';

type LevelListScreenProps = {
  onSelectLevel: (levelId: string) => void;
};

export default function LevelListScreen({ onSelectLevel }: LevelListScreenProps) {
  const { data, isLoading, isFetching, refetch } = useListLevelsQuery({
    limit: 50,
  });

  const levels = (data?.levels ?? []) as LevelListItem[];

  const renderItem: ListRenderItem<LevelListItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelectLevel(item.levelId)}
      activeOpacity={0.7}
    >
      <View style={styles.cardRow}>
        <Text style={styles.cardDifficulty}>{item.difficulty}</Text>
        <Text style={styles.cardPairs}>{item.pairCount} pairs</Text>
      </View>
      <Text style={styles.cardId} numberOfLines={1}>
        {item.levelId}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading levels…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Numberlink</Text>
      <Text style={styles.subtitle}>Pick a level</Text>

      <FlatList
        data={levels}
        keyExtractor={(item) => item.levelId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#3498db"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No levels yet.</Text>
            <Text style={styles.emptyHint}>Start the mock API (see QUICKSTART).</Text>
          </View>
        }
      />
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
  },
  loadingText: {
    color: '#b8b8b8',
    marginTop: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 24,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardDifficulty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
    textTransform: 'capitalize',
  },
  cardPairs: {
    fontSize: 14,
    color: '#95a5a6',
  },
  cardId: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#b8b8b8',
    fontSize: 16,
  },
  emptyHint: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});

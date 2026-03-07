import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './src/store';
import { store } from './src/store';
import { selectSelectedLevelId, setSelectedLevel, clearLevel } from './src/store/gameSlice';
import LevelListScreen from './src/screens/LevelListScreen';
import GameScreen from './src/screens/GameScreen';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedLevelId = useSelector((state: RootState) => selectSelectedLevelId(state));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {selectedLevelId == null ? (
        <LevelListScreen onSelectLevel={(id) => dispatch(setSelectedLevel(id))} />
      ) : (
        <GameScreen
          levelId={selectedLevelId}
          onBack={() => dispatch(clearLevel())}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cell } from './api/schemas';
import type { RootState } from './index';

type Paths = Record<string, Cell[]>;

type GameState = {
  selectedLevelId: string | null;
  paths: Paths;
};

const initialState: GameState = {
  selectedLevelId: null,
  paths: {},
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setSelectedLevel(state, action: PayloadAction<string>) {
      state.selectedLevelId = action.payload;
      state.paths = {};
    },
    setPaths(state, action: PayloadAction<Paths>) {
      state.paths = action.payload;
    },
    resetPaths(state) {
      state.paths = {};
    },
    clearLevel(state) {
      state.selectedLevelId = null;
      state.paths = {};
    },
  },
});

export const { setSelectedLevel, setPaths, resetPaths, clearLevel } = gameSlice.actions;

export const selectSelectedLevelId = (state: RootState) => state.game.selectedLevelId;
export const selectPaths = (state: RootState) => state.game.paths;

export default gameSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import devToolsEnhancer from 'remote-redux-devtools';
import { baseApi } from './api/baseApi';
import gameReducer from './gameSlice';

const isDev = process.env.NODE_ENV !== 'production';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: false,
  ...(isDev
    ? {
        enhancers: (getDefaultEnhancers: any) =>
          getDefaultEnhancers().concat(
            devToolsEnhancer({
              name: 'Numberlink Game',
              realtime: true,
              hostname: 'localhost',
              port: 8000,
            }) as any
          ),
      }
    : {}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

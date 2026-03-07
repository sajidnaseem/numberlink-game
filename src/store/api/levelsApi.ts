import { baseApi } from './baseApi';
import type {
  CreateLevelRequest,
  CreateLevelResponse,
  Difficulty,
  GetLevelResponse,
  LevelListResponse,
} from './schemas';

type ListLevelsParams = {
  difficulty?: Difficulty;
  limit?: number;
};

export const levelsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listLevels: build.query<LevelListResponse, ListLevelsParams | undefined>({
      query: (args) => {
        const { difficulty, limit } = args ?? {};
        const params = new URLSearchParams();
        if (difficulty != null) params.set('difficulty', difficulty);
        if (limit != null) params.set('limit', String(limit));
        const q = params.toString();
        return q ? `levels?${q}` : 'levels';
      },
      providesTags: (result) =>
        result?.levels
          ? [
              ...result.levels.map(({ levelId }) => ({ type: 'Level' as const, id: levelId })),
              { type: 'Levels' as const, id: 'LIST' },
            ]
          : [{ type: 'Levels' as const, id: 'LIST' }],
    }),

    getLevel: build.query<GetLevelResponse, string>({
      query: (levelId) => `levels/${encodeURIComponent(levelId)}`,
      providesTags: (_result, _err, levelId) => [{ type: 'Level', id: levelId }],
    }),

    createLevel: build.mutation<CreateLevelResponse, CreateLevelRequest>({
      query: (body) => ({
        url: 'levels',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Levels', id: 'LIST' }],
    }),
  }),
});

export const {
  useListLevelsQuery,
  useGetLevelQuery,
  useCreateLevelMutation,
} = levelsApi;

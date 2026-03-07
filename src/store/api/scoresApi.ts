import { baseApi } from './baseApi';
import type {
  CreateScoreRequest,
  CreateScoreResponse,
  ScoreboardResponse,
  ScoreOrder,
} from './schemas';

type ListScoresParams = {
  levelId?: string;
  limit?: number;
  order?: ScoreOrder;
};

export const scoresApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listScores: build.query<ScoreboardResponse, ListScoresParams | undefined>({
      query: (args) => {
        const { levelId, limit, order } = args ?? {};
        const params = new URLSearchParams();
        if (levelId != null) params.set('levelId', levelId);
        if (limit != null) params.set('limit', String(limit));
        if (order != null) params.set('order', order);
        const q = params.toString();
        return q ? `scores?${q}` : 'scores';
      },
      providesTags: (result) =>
        result?.scores
          ? [
              ...result.scores.map(({ scoreId }) => ({ type: 'Scores' as const, id: scoreId })),
              { type: 'Scores' as const, id: 'LIST' },
            ]
          : [{ type: 'Scores' as const, id: 'LIST' }],
    }),

    submitScore: build.mutation<CreateScoreResponse, CreateScoreRequest>({
      query: (body) => ({
        url: 'scores',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Scores', id: 'LIST' }],
    }),
  }),
});

export const {
  useListScoresQuery,
  useSubmitScoreMutation,
} = scoresApi;

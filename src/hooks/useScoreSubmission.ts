import { useCallback, useEffect, useRef } from 'react';
import { useSubmitScoreMutation } from '../store/api';

type UseScoreSubmissionParams = {
  levelId: string | null | undefined;
  won: boolean;
  completedDurationMs: number | null | undefined;
};

export function useScoreSubmission({
  levelId,
  won,
  completedDurationMs,
}: UseScoreSubmissionParams) {
  const [submitScore, submitState] = useSubmitScoreMutation();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!won || !levelId || submittedRef.current) return;
    if (completedDurationMs == null) return;
    submittedRef.current = true;
    submitScore({ levelId, durationMs: completedDurationMs }).catch(() => {
      submittedRef.current = false;
    });
  }, [won, levelId, completedDurationMs, submitScore]);

  const retrySubmit = useCallback(() => {
    if (!levelId || completedDurationMs == null) return;
    submittedRef.current = true;
    submitState.reset();
    submitScore({ levelId, durationMs: completedDurationMs }).catch(() => {
      submittedRef.current = false;
    });
  }, [levelId, completedDurationMs, submitScore, submitState]);

  const resetSubmission = useCallback(() => {
    submittedRef.current = false;
    submitState.reset();
  }, [submitState]);

  return {
    submitLoading: submitState.isLoading,
    submitError: submitState.isError,
    submitSuccess: submitState.isSuccess,
    retrySubmit,
    resetSubmission,
  };
}

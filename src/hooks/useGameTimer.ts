import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Level } from '../store/api/schemas';

type UseGameTimerResult = {
  displayTimeMs: number;
  completedDurationMs: number | null;
  resetTimer: () => void;
};

export function useGameTimer(level: Level | null | undefined, won: boolean): UseGameTimerResult {
  const startTimeRef = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [completedTimeMs, setCompletedTimeMs] = useState<number | null>(null);
  const completedTimeMsRef = useRef<number | null>(null);

  if (level && !won && startTimeRef.current === null) {
    startTimeRef.current = Date.now();
  }

  useEffect(() => {
    if (!level || won) return;
    const interval = setInterval(() => {
      if (startTimeRef.current != null) {
        setElapsedMs(Date.now() - startTimeRef.current);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [level, won]);

  useLayoutEffect(() => {
    if (!won || completedTimeMsRef.current != null) return;
    if (startTimeRef.current == null) return;
    const ms = Math.round(Date.now() - startTimeRef.current);
    completedTimeMsRef.current = ms;
    setCompletedTimeMs(ms);
  }, [won]);

  const displayTimeMs = won
    ? (
      completedTimeMs ??
      completedTimeMsRef.current ??
      (startTimeRef.current != null ? Math.round(Date.now() - startTimeRef.current) : 0)
    )
    : elapsedMs;

  const resetTimer = () => {
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setCompletedTimeMs(null);
    completedTimeMsRef.current = null;
  };

  return {
    displayTimeMs,
    completedDurationMs: completedTimeMsRef.current,
    resetTimer,
  };
}

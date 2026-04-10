import { useAppSelector } from "../hooks";
import { useMemo } from "react";

export function useJamSessions() {
  return useAppSelector(({ jamSessions }) => jamSessions);
}

export function useCompletedJamSessions() {
  const jamSessions = useJamSessions();
  return useMemo(
    () =>
      jamSessions
        .filter((session) => session.duration !== undefined)
        .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0)),
    [jamSessions],
  );
}

export function useUpcomingJamSessions() {
  const jamSessions = useJamSessions();
  return useMemo(
    () => jamSessions.filter((session) => session.duration === undefined),
    [jamSessions],
  );
}

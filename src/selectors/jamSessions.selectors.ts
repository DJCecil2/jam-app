import { useAppSelector } from "../hooks";
import { useMemo } from "react";
import { sortJamMembers } from "../reducers/jamSession.reducer";

export function useJamSessions() {
  return useAppSelector(({ jamSessions, instruments }) =>
    jamSessions.map((session) => ({
      ...session,
      completed: session.completed ?? false,
      members: sortJamMembers(session.members, instruments),
    })),
  );
}

export function useCompletedJamSessions() {
  const jamSessions = useJamSessions();
  return useMemo(
    () =>
      jamSessions
        .filter((session) => session.completed)
        .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0)),
    [jamSessions],
  );
}

export function useUpcomingJamSessions() {
  const jamSessions = useJamSessions();
  return useMemo(
    () => jamSessions.filter((session) => !session.completed),
    [jamSessions],
  );
}

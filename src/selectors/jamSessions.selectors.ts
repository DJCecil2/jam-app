import { useAppSelector } from "../hooks.ts";
import { useMemo } from "react";

export function useJamSessions() {
  return useAppSelector(({ jamSessions }) => jamSessions);
}

export function useCompletedJamSessions() {
  const jamSessions = useJamSessions();
  return useMemo(
    () => jamSessions.filter((session) => session.duration !== undefined),
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

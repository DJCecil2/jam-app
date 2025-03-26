import { useAppSelector } from "../hooks.ts";

export function useJamSessions() {
  return useAppSelector(({ jamSessions }) => jamSessions);
}

import { useAppSelector } from "../hooks.ts";
import { useMemo } from "react";

export function useMusicians() {
  return useAppSelector(({ musicians }) => musicians);
}

export function useMusiciansWithInstrument(instrumentId: string) {
  const musicians = useMusicians();

  return useMemo(
    () => musicians.filter((m) => m.instrumentIds.includes(instrumentId)),
    [musicians, instrumentId],
  );
}

export function useMusician(musicianId: string) {
  const musician = useAppSelector(({ musicians }) =>
    musicians.find((m) => m.id === musicianId),
  );

  if (!musician) throw new Error(`Musician with id ${musicianId} not found`);

  return musician;
}

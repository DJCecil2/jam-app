import { useAppSelector } from "../hooks";
import { useMemo } from "react";

export function useMusicians() {
  return useAppSelector(({ musicians }) =>
    musicians.filter((m) => !m.isDeleted),
  );
}

export function useMusiciansWithInstrument(instrumentId: string) {
  const musicians = useMusicians();

  return useMemo(
    () => musicians.filter((m) => m.instrumentIds.includes(instrumentId)),
    [musicians, instrumentId],
  );
}

export function useMusician(musicianId: string, includeDeleted = false) {
  const musician = useAppSelector(({ musicians }) =>
    musicians.find(
      (m) => m.id === musicianId && (includeDeleted || !m.isDeleted),
    ),
  );

  if (!musician) throw new Error(`Musician with id ${musicianId} not found`);

  return musician;
}

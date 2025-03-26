import { useAppSelector } from "../hooks.ts";

export function useMusiciansWithInstrument(instrumentId: string) {
  return useAppSelector(({ musicians }) =>
    musicians.filter((m) => m.instrumentIds.includes(instrumentId)),
  );
}

export function useMusician(musicianId: string) {
  const musician = useAppSelector(({ musicians }) =>
    musicians.find((m) => m.id === musicianId),
  );

  if (!musician) throw new Error(`Musician with id ${musicianId} not found`);

  return musician;
}

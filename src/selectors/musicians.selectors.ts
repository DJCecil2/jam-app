import { useAppSelector } from "../hooks.ts";

export function useMusiciansWithInstrument(instrumentId: string) {
  return useAppSelector(({ musicians }) =>
    musicians.filter((m) => m.instrumentIds.includes(instrumentId)),
  );
}

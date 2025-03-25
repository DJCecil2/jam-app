import { useAppSelector } from "../hooks.ts";

export function useInstruments() {
  return useAppSelector(({ instruments }) => instruments);
}

export function useInstrumentOptionsList() {
  return useInstruments().map(({ id, label }) => ({
    value: id,
    label,
  }));
}

export function useInstrument(instrumentId: string) {
  const instrument = useAppSelector(({ instruments }) =>
    instruments.find((i) => i.id === instrumentId),
  );

  if (!instrument)
    throw new Error(`Instrument with id ${instrumentId} not found`);

  return instrument;
}

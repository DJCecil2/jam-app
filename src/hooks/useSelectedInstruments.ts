import { useInstruments } from "../selectors/instruments.selectors";
import { useCallback, useState } from "react";

export default function useSelectedInstruments(selectedDefaults?: string[]) {
  const instruments = useInstruments();
  const getDefaultValue = useCallback(
    () =>
      instruments.reduce(
        (acc, instrument) => ({
          ...acc,
          [instrument.id]: selectedDefaults?.includes(instrument.id) || false,
        }),
        {},
      ),
    [instruments, selectedDefaults],
  );

  const [selectedInstruments, setSelectedInstruments] = useState<{
    [key: string]: boolean;
  }>(getDefaultValue);

  const resetValue = useCallback(() => {
    setSelectedInstruments(getDefaultValue());
  }, [getDefaultValue]);

  return [selectedInstruments, setSelectedInstruments, resetValue] as const;
}

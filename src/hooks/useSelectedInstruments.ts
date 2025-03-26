import { useInstruments } from "../selectors/instruments.selectors.ts";
import { useCallback, useState } from "react";

export default function useSelectedInstruments(selectedDefaults?: string[]) {
  const instruments = useInstruments();
  const getDefaultValue = () =>
    instruments.reduce(
      (acc, instrument) => ({
        ...acc,
        [instrument.id]: selectedDefaults?.includes(instrument.id) || false,
      }),
      {},
    );

  const [selectedInstruments, setSelectedInstruments] = useState<{
    [key: string]: boolean;
  }>(getDefaultValue);

  const resetValue = useCallback(() => {
    setSelectedInstruments(getDefaultValue());
  }, [instruments, selectedDefaults]);

  return [selectedInstruments, setSelectedInstruments, resetValue] as const;
}

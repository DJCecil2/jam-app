import { Stack } from "@mui/material";
import { useMusiciansWithInstrument } from "../../selectors/musicians.selectors.ts";

interface InstrumentMusicianListProps {
  instrumentId: string;
}

export default function InstrumentMusicianList({
  instrumentId,
}: InstrumentMusicianListProps) {
  const musicians = useMusiciansWithInstrument(instrumentId);

  return (
    <Stack direction="column" spacing={2} justifyContent="space-between" p={2}>
      {musicians.map((musician) => (
        <div>{musician.name}</div>
      ))}
    </Stack>
  );
}

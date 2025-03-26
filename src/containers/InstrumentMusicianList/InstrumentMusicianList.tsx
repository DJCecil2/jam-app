import { Stack } from "@mui/material";
import { useMusiciansWithInstrument } from "../../selectors/musicians.selectors.ts";
import Musician from "../Musician/Musician.tsx";

interface InstrumentMusicianListProps {
  instrumentId: string;
}

export default function InstrumentMusicianList({
  instrumentId,
}: InstrumentMusicianListProps) {
  const musicians = useMusiciansWithInstrument(instrumentId);

  return (
    <Stack direction="column" flexGrow={1} sx={{ overflowY: "auto" }}>
      {musicians.map((musician) => (
        <Musician key={musician.id} id={musician.id} />
      ))}
    </Stack>
  );
}

import { Stack } from "@mui/material";
import { useEnrichedMusiciansForInstrument } from "../../selectors/recommendations.selectors";
import Musician from "../Musician/Musician";

interface InstrumentMusicianListProps {
  instrumentId: string;
}

export default function InstrumentMusicianList({
  instrumentId,
}: InstrumentMusicianListProps) {
  const musicians = useEnrichedMusiciansForInstrument(instrumentId);

  return (
    <Stack direction="column" flexGrow={1} sx={{ overflowY: "auto" }}>
      {musicians.map((musician) => (
        <Musician
          key={musician.id}
          id={musician.id}
          isRecommended={musician.isRecommended}
          isInUpcoming={musician.isInUpcoming}
        />
      ))}
    </Stack>
  );
}

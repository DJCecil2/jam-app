import { Stack } from "@mui/material";
import { useInstruments } from "../../selectors/instruments.selectors.ts";
import InstrumentMusicianList from "../InstrumentMusicianList/InstrumentMusicianList.tsx";
import AddMusicianButton from "../../components/AddMusicianButton/AddMusicianButton.tsx";

export default function InstrumentList() {
  const instruments = useInstruments();

  return (
    <Stack direction="row" flexGrow={1} justifyContent="space-around" p={2}>
      {instruments.map((instrument) => (
        <Stack
          direction="column"
          key={instrument.id}
          spacing={2}
          p={2}
          justifyContent="space-between"
        >
          <h2>{instrument.label}</h2>
          <InstrumentMusicianList
            key={instrument.id}
            instrumentId={instrument.id}
          />
          <AddMusicianButton instrumentIds={[instrument.id]} />
        </Stack>
      ))}
    </Stack>
  );
}

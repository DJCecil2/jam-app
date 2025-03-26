import { Box, Stack } from "@mui/material";
import { useInstruments } from "../../selectors/instruments.selectors.ts";
import InstrumentMusicianList from "../InstrumentMusicianList/InstrumentMusicianList.tsx";
import AddMusicianButton from "../AddMusicianButton/AddMusicianButton.tsx";
import InstrumentPerSessionSelect from "../InstrumentPerSessionSelect/InstrumentPerSessionSelect.tsx";
import { styled } from "@mui/material/styles";

const AddMusicianButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderLeft: "1px solid",
  borderTop: "1px solid",
  borderColor: theme.palette.divider,
  justifyContent: "center",
  alignItems: "center",
}));

export default function InstrumentList() {
  const instruments = useInstruments();

  return (
    <Stack direction="row" flexGrow={1} justifyContent="space-between">
      {instruments.map((instrument) => (
        <Stack direction="column" key={instrument.id} flexGrow={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            borderBottom="1px solid"
            borderLeft="1px solid"
            borderColor="divider"
          >
            <h2>{instrument.label}</h2>
            <InstrumentPerSessionSelect instrumentId={instrument.id} />
          </Stack>
          <InstrumentMusicianList
            key={instrument.id}
            instrumentId={instrument.id}
          />
          <AddMusicianButtonContainer>
            <AddMusicianButton instrumentIds={[instrument.id]} />
          </AddMusicianButtonContainer>
        </Stack>
      ))}
    </Stack>
  );
}

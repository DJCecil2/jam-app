import { Box, Stack, Typography, Divider } from "@mui/material";
import { useInstruments } from "../../selectors/instruments.selectors.ts";
import InstrumentMusicianList from "../InstrumentMusicianList/InstrumentMusicianList.tsx";
import AddMusicianButton from "../AddMusicianButton/AddMusicianButton.tsx";
import InstrumentPerSessionSelect from "../InstrumentPerSessionSelect/InstrumentPerSessionSelect.tsx";
import { styled } from "@mui/material/styles";
import { RemoveInstrumentButton } from "../RemoveInstrumentButton/RemoveInstrumentButton.tsx";

const FooterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderTop: "1px solid",
  borderColor: theme.palette.divider,
  justifyContent: "center",
  alignItems: "center",
}));

export default function InstrumentList() {
  const instruments = useInstruments();

  return (
    <Stack
      direction="row"
      flexGrow={1}
      divider={<Divider orientation="vertical" flexItem />}
    >
      {instruments.map((instrument) => (
        <Stack
          direction="column"
          key={instrument.id}
          flexGrow={1}
          minWidth={300}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Typography variant="h5" component="h2">
              {instrument.label}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <InstrumentPerSessionSelect instrumentId={instrument.id} />
              <RemoveInstrumentButton instrumentId={instrument.id} />
            </Stack>
          </Stack>
          <Box flexGrow={1} sx={{ overflowY: "auto" }}>
            <InstrumentMusicianList
              key={instrument.id}
              instrumentId={instrument.id}
            />
          </Box>
          <FooterContainer>
            <AddMusicianButton instrumentIds={[instrument.id]} />
          </FooterContainer>
        </Stack>
      ))}
    </Stack>
  );
}

import { InstrumentList } from "../../containers/InstrumentList/InstrumentList.tsx";
import { Box, Grid2 as Grid } from "@mui/material";

export function PlayerInstrumentView() {
  return (
    <Grid
      container
      component="main"
      direction="column"
      sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      <InstrumentList />
      <Box sx={{ flexGrow: 1 }}>Content</Box>
    </Grid>
  );
}

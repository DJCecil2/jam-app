import SessionList from "../../containers/SessionList/SessionList.tsx";
import { Grid2 as Grid } from "@mui/material";
import InstrumentList from "../../containers/InstrumentList/InstrumentList.tsx";

export function PlayerInstrumentView() {
  return (
    <Grid
      container
      component="main"
      direction="row"
      sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      <InstrumentList />
      <SessionList />
    </Grid>
  );
}

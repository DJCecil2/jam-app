import SessionList from "../SessionList/SessionList";
import { Box } from "@mui/material";
import InstrumentList from "../InstrumentList/InstrumentList";

export function PlayerInstrumentView() {
  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <InstrumentList />
      <SessionList />
    </Box>
  );
}

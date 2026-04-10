import SessionList from "../SessionList/SessionList";
import { Box, Drawer, useMediaQuery, useTheme, Fab } from "@mui/material";
import InstrumentList from "../InstrumentList/InstrumentList";
import { useState } from "react";
import PeopleIcon from "@mui/icons-material/People";

export function PlayerInstrumentView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowX: "auto",
          overflowY: "hidden",
          display: isMobile ? "none" : "block",
        }}
      >
        <InstrumentList />
      </Box>

      <SessionList onAction={() => isMobile && setDrawerOpen(false)} />

      {isMobile && (
        <>
          <Fab
            color="primary"
            aria-label="musicians"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={() => setDrawerOpen(true)}
          >
            <PeopleIcon />
          </Fab>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            slotProps={{
              paper: { sx: { width: "85vw", maxWidth: 400 } },
            }}
          >
            <InstrumentList />
          </Drawer>
        </>
      )}
    </Box>
  );
}

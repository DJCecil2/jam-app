import {
  Box,
  Divider,
  List,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import AddJamSessionButton from "../AddJamSessionButton/AddJamSessionButton";
import {
  useCompletedJamSessions,
  useUpcomingJamSessions,
} from "../../selectors/jamSessions.selectors";
import JamSession from "../JamSession/JamSession";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import React, { Fragment, useState } from "react";

const FooterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderTop: "1px solid",
  borderColor: theme.palette.divider,
  justifyContent: "center",
  alignItems: "center",
}));

export default function SessionList() {
  const [tabValue, setTabValue] = useState(0);
  const upcomingJamSessions = useUpcomingJamSessions();
  const completedJamSessions = useCompletedJamSessions();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const currentJam =
    upcomingJamSessions.length > 0 ? upcomingJamSessions[0] : null;

  const filteredSessions =
    tabValue === 0
      ? upcomingJamSessions.filter((session) => session.id !== currentJam?.id)
      : completedJamSessions;

  return (
    <Stack
      sx={{
        width: 300,
        minWidth: "15vw",
        flexShrink: 0,
        borderLeft: 1,
        borderColor: "divider",
        justifyContent: "space-between",
        position: "sticky",
        right: 0,
        zIndex: 1,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 0.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <SettingsMenu />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <List disablePadding>
          {currentJam ? (
            <JamSession session={currentJam} isCurrent={true} />
          ) : (
            <Box
              sx={{
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No active jam
              </Typography>
            </Box>
          )}
        </List>
      </Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Upcoming" />
        <Tab label="Completed" />
      </Tabs>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List disablePadding>
          {filteredSessions.map((jamSession, index) => (
            <Fragment key={jamSession.id}>
              <JamSession session={jamSession} />
              {index < filteredSessions.length - 1 && (
                <Divider component="li" />
              )}
            </Fragment>
          ))}
          {filteredSessions.length === 0 && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 0 ? "No upcoming jams" : "No completed jams"}
              </Typography>
            </Box>
          )}
        </List>
      </Box>
      <FooterContainer>
        <AddJamSessionButton />
      </FooterContainer>
    </Stack>
  );
}

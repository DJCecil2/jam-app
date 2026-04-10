import {
  Box,
  Divider,
  IconButton,
  List,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddJamSessionButton from "../AddJamSessionButton/AddJamSessionButton";
import {
  useCompletedJamSessions,
  useUpcomingJamSessions,
} from "../../selectors/jamSessions.selectors";
import JamSession from "../JamSession/JamSession";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import React, { Fragment, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const FooterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderTop: "1px solid",
  borderColor: theme.palette.divider,
  justifyContent: "center",
  alignItems: "center",
}));

interface SessionListProps {
  onAction?: () => void;
}

export default function SessionList({ onAction }: SessionListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const upcomingJamSessions = useUpcomingJamSessions();
  const completedJamSessions = useCompletedJamSessions();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  const currentJam =
    upcomingJamSessions.length > 0 ? upcomingJamSessions[0] : null;

  const filteredSessions =
    tabValue === 0
      ? upcomingJamSessions.filter((session) => session.id !== currentJam?.id)
      : completedJamSessions;

  const effectivelyCollapsed = isCollapsed && !isMobile;

  return (
    <Stack
      sx={{
        width: { xs: "100%", md: effectivelyCollapsed ? 64 : 300 },
        minWidth: { md: effectivelyCollapsed ? "unset" : "15vw" },
        flexShrink: 0,
        borderLeft: { md: 1 },
        borderColor: "divider",
        justifyContent: "space-between",
        position: { md: "sticky" },
        right: 0,
        zIndex: 1,
        bgcolor: "background.paper",
        height: "100%",
        transition: "width 0.2s ease-in-out",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: effectivelyCollapsed ? "center" : "flex-end",
          alignItems: "center",
          p: 0.5,
          borderBottom: 1,
          borderColor: "divider",
          flexDirection: effectivelyCollapsed ? "column" : "row",
          gap: 0.5,
        }}
      >
        {!isMobile && (
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="small"
            title={effectivelyCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            sx={{ mr: effectivelyCollapsed ? 0 : "auto" }}
          >
            {effectivelyCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
        <SettingsMenu />
      </Box>
      <Box
        sx={{
          display: effectivelyCollapsed ? "none" : "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
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
          <AddJamSessionButton onAdd={handleAction} />
        </FooterContainer>
      </Box>
    </Stack>
  );
}

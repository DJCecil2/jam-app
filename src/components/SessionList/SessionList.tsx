import {
  Box,
  IconButton,
  Stack,
  styled,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddJamSessionButton from "../AddJamSessionButton/AddJamSessionButton";
import {
  useCompletedJamSessions,
  useUpcomingJamSessions,
} from "../../selectors/jamSessions.selectors";
import { reorderJamSessions } from "../../reducers/jamSession.reducer";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAppDispatch } from "../../hooks";
import CurrentSessionSection from "./CurrentSessionSection";
import UpcomingSessionsList from "./UpcomingSessionsList";
import CompletedSessionsList from "./CompletedSessionsList";

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
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [draggedSessionId, setDraggedSessionId] = useState<string | null>(null);
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
  const isCurrentSessionReorderLocked =
    currentJam !== null &&
    (currentJam.startedAt !== undefined || (currentJam.pausedDuration ?? 0) > 0);
  const upcomingSessions = upcomingJamSessions.filter(
    (session) => session.id !== currentJam?.id,
  );

  const isUpcomingTab = tabValue === 0;

  const handleDragStart =
    (sessionId: string) => (event: React.DragEvent<HTMLDivElement>) => {
      setDraggedSessionId(sessionId);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", sessionId);
    };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop =
    (targetSessionId: string) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const sourceSessionId =
        draggedSessionId || event.dataTransfer.getData("text/plain");

      if (!sourceSessionId || sourceSessionId === targetSessionId) {
        setDraggedSessionId(null);
        return;
      }

      dispatch(
        reorderJamSessions({
          sourceId: sourceSessionId,
          targetId: targetSessionId,
        }),
      );
      setDraggedSessionId(null);
    };

  const handleDragEnd = () => {
    setDraggedSessionId(null);
  };

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
        <CurrentSessionSection
          currentJam={currentJam}
          isUpcomingTab={isUpcomingTab}
          isCurrentSessionReorderLocked={isCurrentSessionReorderLocked}
          draggedSessionId={draggedSessionId}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
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
          {isUpcomingTab ? (
            <UpcomingSessionsList
              sessions={upcomingSessions}
              draggedSessionId={draggedSessionId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ) : (
            <CompletedSessionsList sessions={completedJamSessions} />
          )}
        </Box>
        <FooterContainer>
          <AddJamSessionButton onAdd={handleAction} />
        </FooterContainer>
      </Box>
    </Stack>
  );
}

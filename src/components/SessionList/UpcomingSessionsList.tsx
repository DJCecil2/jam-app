import { Box, Divider, List, Typography } from "@mui/material";
import JamSession from "../JamSession/JamSession";
import { JamSessionsState } from "../../reducers/jamSession.reducer";
import React, { Fragment } from "react";

interface UpcomingSessionsListProps {
  sessions: JamSessionsState;
  draggedSessionId: string | null;
  onDragStart: (sessionId: string) => (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (targetSessionId: string) => (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export default function UpcomingSessionsList({
  sessions,
  draggedSessionId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: UpcomingSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No upcoming jams
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {sessions.map((jamSession, index) => (
        <Fragment key={jamSession.id}>
          <Box
            draggable={true}
            onDragStart={onDragStart(jamSession.id)}
            onDragOver={onDragOver}
            onDrop={onDrop(jamSession.id)}
            onDragEnd={onDragEnd}
            sx={{
              cursor: "grab",
              opacity: draggedSessionId === jamSession.id ? 0.6 : 1,
            }}
          >
            <JamSession session={jamSession} />
          </Box>
          {index < sessions.length - 1 && <Divider component="li" />}
        </Fragment>
      ))}
    </List>
  );
}

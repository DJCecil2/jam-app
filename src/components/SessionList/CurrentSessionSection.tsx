import { Box, List, Typography } from "@mui/material";
import JamSession from "../JamSession/JamSession";
import { JamSessionsState } from "../../reducers/jamSession.reducer";
import React from "react";

interface CurrentSessionSectionProps {
  currentJam: JamSessionsState[number] | null;
  isUpcomingTab: boolean;
  isCurrentSessionReorderLocked: boolean;
  draggedSessionId: string | null;
  onDragStart: (sessionId: string) => (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (targetSessionId: string) => (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export default function CurrentSessionSection({
  currentJam,
  isUpcomingTab,
  isCurrentSessionReorderLocked,
  draggedSessionId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: CurrentSessionSectionProps) {
  const canReorderCurrentSession = isUpcomingTab && !isCurrentSessionReorderLocked;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <List disablePadding>
        {currentJam ? (
          <Box
            draggable={canReorderCurrentSession}
            onDragStart={canReorderCurrentSession ? onDragStart(currentJam.id) : undefined}
            onDragOver={canReorderCurrentSession ? onDragOver : undefined}
            onDrop={canReorderCurrentSession ? onDrop(currentJam.id) : undefined}
            onDragEnd={canReorderCurrentSession ? onDragEnd : undefined}
            sx={
              canReorderCurrentSession
                ? {
                    cursor: "grab",
                    opacity: draggedSessionId === currentJam.id ? 0.6 : 1,
                  }
                : undefined
            }
          >
            <JamSession session={currentJam} isCurrent={true} />
          </Box>
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
  );
}

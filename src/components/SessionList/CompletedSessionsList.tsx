import { Box, Divider, List, Typography } from "@mui/material";
import JamSession from "../JamSession/JamSession";
import { JamSessionsState } from "../../reducers/jamSession.reducer";
import { Fragment } from "react";

interface CompletedSessionsListProps {
  sessions: JamSessionsState;
}

export default function CompletedSessionsList({
  sessions,
}: CompletedSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No completed jams
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {sessions.map((jamSession, index) => (
        <Fragment key={jamSession.id}>
          <JamSession session={jamSession} />
          {index < sessions.length - 1 && <Divider component="li" />}
        </Fragment>
      ))}
    </List>
  );
}

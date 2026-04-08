import {
  JamSessionsState,
  updateJamSessionDuration,
} from "../../reducers/jamSession.reducer.ts";
import { Stack, ListItem, Typography } from "@mui/material";
import JamSessionMember from "./JamSessionMember.tsx";
import JamSessionTimer from "./JamSessionTimer.tsx";
import { useAppDispatch } from "../../hooks.ts";

interface JamSessionProps {
  session: JamSessionsState[number];
  isCurrent?: boolean;
}

export default function JamSession({
  session,
  isCurrent = false,
}: JamSessionProps) {
  const dispatch = useAppDispatch();
  const handleStop = (duration: number) => {
    dispatch(updateJamSessionDuration({ id: session.id, duration }));
  };

  return (
    <ListItem disablePadding sx={{ py: 1 }}>
      <Stack width="100%" spacing={1}>
        {isCurrent && <JamSessionTimer onStop={handleStop} />}
        {!isCurrent && session.duration !== undefined && (
          <Typography
            variant="caption"
            align="center"
            sx={{ display: "block", color: "text.secondary", px: 2 }}
          >
            Duration: {Math.floor(session.duration / 60)}:
            {(session.duration % 60).toString().padStart(2, "0")}
          </Typography>
        )}
        <Stack spacing={0.5} sx={{ px: 2, pb: 1 }}>
          {session.members.map(({ musicianId, instrumentId }) => (
            <JamSessionMember
              key={musicianId}
              musicianId={musicianId}
              instrumentId={instrumentId}
            />
          ))}
        </Stack>
      </Stack>
    </ListItem>
  );
}

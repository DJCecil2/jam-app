import {
  JamSessionsState,
  updateJamSessionDuration,
} from "../../reducers/jamSession.reducer";
import { Stack, ListItem, Typography } from "@mui/material";
import JamSessionMember from "./JamSessionMember";
import JamSessionTimer from "./JamSessionTimer";
import { useAppDispatch } from "../../hooks";
import { formatTime } from "../../utils/time.utils";

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
            Duration: {formatTime(session.duration)}
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

import {
  JamSessionsState,
  updateJamSessionDuration,
} from "../../reducers/jamSession.reducer.ts";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import JamSessionMember from "./JamSessionMember.tsx";
import JamSessionTimer from "./JamSessionTimer.tsx";
import { useAppDispatch } from "../../hooks.ts";

const JamSessionWrapper = styled(Stack)(({ theme }) => ({
  width: "100%",
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
  ":nth-of-type(even)": {
    backgroundColor: theme.palette.secondary,
  },
}));

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
    <JamSessionWrapper>
      {isCurrent && <JamSessionTimer onStop={handleStop} />}
      {!isCurrent && session.duration !== undefined && (
        <Typography variant="caption" align="center" sx={{ display: "block" }}>
          Duration:{" "}
          {new Date(session.duration * 1000).toISOString().substring(11, 19)}
        </Typography>
      )}
      {session.members.map(({ musicianId, instrumentId }) => (
        <JamSessionMember
          key={musicianId}
          musicianId={musicianId}
          instrumentId={instrumentId}
        />
      ))}
    </JamSessionWrapper>
  );
}

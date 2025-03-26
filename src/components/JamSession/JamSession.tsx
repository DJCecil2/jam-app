import { JamSessionsState } from "../../reducers/jamSession.reducer.ts";
import { useMusician } from "../../selectors/musicians.selectors.ts";
import { useInstrument } from "../../selectors/instruments.selectors.ts";
import { Avatar, Stack } from "@mui/material";
import { stringAvatar } from "../../utils/avatar.utils.ts";
import { styled } from "@mui/material/styles";

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
}

export default function JamSession({ session }: JamSessionProps) {
  return (
    <JamSessionWrapper>
      {session.members.map(({ musicianId, instrumentId }) => (
        <JamSessionMember musicianId={musicianId} instrumentId={instrumentId} />
      ))}
    </JamSessionWrapper>
  );
}

interface JamSessionMemberProps {
  musicianId: string;
  instrumentId: string;
}

function JamSessionMember({ musicianId, instrumentId }: JamSessionMemberProps) {
  const musician = useMusician(musicianId);
  const instrument = useInstrument(instrumentId);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
    >
      <Avatar {...stringAvatar(instrument.label)} />
      {musician.name}
    </Stack>
  );
}

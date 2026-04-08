import { useMusician } from "../../selectors/musicians.selectors.ts";
import { useInstrument } from "../../selectors/instruments.selectors.ts";
import { Avatar, Stack, Typography } from "@mui/material";
import { stringAvatar } from "../../utils/avatar.utils.ts";

interface JamSessionMemberProps {
  musicianId: string;
  instrumentId: string;
}

export default function JamSessionMember({
  musicianId,
  instrumentId,
}: JamSessionMemberProps) {
  const musician = useMusician(musicianId);
  const instrument = useInstrument(instrumentId);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      spacing={1}
    >
      <Avatar {...stringAvatar(instrument.label)} />
      <Typography variant="body2">{musician.name}</Typography>
    </Stack>
  );
}

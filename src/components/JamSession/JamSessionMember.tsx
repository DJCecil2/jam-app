import { useMusician } from "../../selectors/musicians.selectors.ts";
import { useInstrument } from "../../selectors/instruments.selectors.ts";
import { Avatar, Stack } from "@mui/material";
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
    >
      <Avatar {...stringAvatar(instrument.label)} />
      {musician.name}
    </Stack>
  );
}

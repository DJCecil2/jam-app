import { useMusician } from "../../selectors/musicians.selectors";
import { useInstrument } from "../../selectors/instruments.selectors";
import { Avatar, Stack, Typography, Box } from "@mui/material";
import { getInstrumentIcon } from "../../utils/instrumentIcons";

interface JamSessionMemberProps {
  musicianId: string;
  instrumentId: string;
  occurrenceIndex?: number;
}

export default function JamSessionMember({
  musicianId,
  instrumentId,
  occurrenceIndex,
}: JamSessionMemberProps) {
  const musician = useMusician(musicianId, true);
  const instrument = useInstrument(instrumentId, true);
  const Icon = getInstrumentIcon(instrument.label);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      spacing={1}
      sx={{ opacity: musician.isDeleted || instrument.isDeleted ? 0.6 : 1 }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <Avatar
          sx={{
            width: 24,
            height: 24,
            bgcolor: "primary.main",
          }}
        >
          <Icon sx={{ fontSize: 16 }} />
        </Avatar>
        {occurrenceIndex !== undefined && (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: -6,
              right: -6,
              fontSize: "0.6rem",
              fontWeight: "bold",
              bgcolor: "background.paper",
              borderRadius: "50%",
              width: 14,
              height: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {occurrenceIndex}
          </Typography>
        )}
      </Box>
      <Typography variant="body2">
        {musician.name}
        {musician.isDeleted && " (deleted)"}
      </Typography>
    </Stack>
  );
}

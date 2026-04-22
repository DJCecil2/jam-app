import { FormEvent, useEffect, useState } from "react";
import { useInstruments } from "../../selectors/instruments.selectors";
import { useAppDispatch } from "../../hooks";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Instrument } from "../../reducers/instruments.reducer";
import {
  addJamSession,
  JamSessionsState,
  sortJamMembers,
  updateJamSession,
} from "../../reducers/jamSession.reducer";
import { useEnrichedMusiciansForInstrument } from "../../selectors/recommendations.selectors";
import { formatTime } from "../../utils/time.utils";

type SelectedMusicianValues = { [key: string]: string };

const SEPARATOR = "//-//";

interface JamSessionDialogProps {
  open: boolean;
  onClose: () => void;
  session?: JamSessionsState[number];
}

export default function JamSessionDialog({
  open,
  onClose,
  session,
}: JamSessionDialogProps) {
  const instruments = useInstruments();
  const [selectedMusicians, setSelectedMusicians] =
    useState<SelectedMusicianValues>({});

  const isEdit = !!session;

  useEffect(() => {
    if (open && session) {
      const initialValues: SelectedMusicianValues = {};
      const counts: Record<string, number> = {};

      session.members.forEach((member) => {
        const index = counts[member.instrumentId] || 0;
        initialValues[`${member.instrumentId}${SEPARATOR}${index}`] =
          member.musicianId;
        counts[member.instrumentId] = index + 1;
      });
      setSelectedMusicians(initialValues);
    } else if (open && !session) {
      setSelectedMusicians({});
    }
  }, [open, session]);

  const handleClose = () => {
    onClose();
  };

  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: FormEvent) => {
            event.preventDefault();

            const members = instruments.flatMap((instrument) => {
              const instrumentMembers = [];
              for (let i = 0; i < instrument.perSession; i++) {
                const inputId = `${instrument.id}${SEPARATOR}${i}`;
                const musicianId = selectedMusicians[inputId];
                if (musicianId) {
                  instrumentMembers.push({
                    instrumentId: instrument.id,
                    musicianId,
                  });
                }
              }
              return instrumentMembers;
            });

            // The members are already collected in instrument order because we flatMap over instruments.
            // However, to be extra safe and consistent, we can use sortJamMembers.
            const sortedMembers = sortJamMembers(members, instruments);

            if (isEdit && session) {
              dispatch(
                updateJamSession({
                  id: session.id,
                  members: sortedMembers,
                }),
              );
            } else {
              dispatch(
                addJamSession({
                  members: sortedMembers,
                }),
              );
            }

            handleClose();
          },
          sx: { width: { xs: "90vw", md: "50vw" }, maxWidth: "800px" },
        },
      }}
    >
      <DialogTitle>
        {isEdit ? "Edit Jam Session" : "Add Jam Session"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {instruments.map((instrument) => (
            <MusicianSelector
              key={instrument.id}
              instrument={instrument}
              selectedValues={selectedMusicians}
              onChange={(inputId, musicianId) =>
                setSelectedMusicians((prevState) => ({
                  ...prevState,
                  [inputId]: musicianId,
                }))
              }
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">
          {isEdit ? "Save Changes" : "Add Jam Session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface MusicianSelectorProps {
  instrument: Instrument;
  selectedValues: SelectedMusicianValues;
  onChange: (inputId: string, musicianId: string) => void;
}

function MusicianSelector({
  instrument,
  selectedValues,
  onChange,
}: MusicianSelectorProps) {
  const musicians = useEnrichedMusiciansForInstrument(instrument.id);
  const inputs = [];

  for (let i = 0; i < instrument.perSession; i++) {
    let label = instrument.label;
    const inputId = `${instrument.id}${SEPARATOR}${i}`;
    const labelId = `${inputId}-label`;
    const value = selectedValues[inputId] || "";

    if (instrument.perSession > 1) {
      label += ` (${i + 1})`;
    }

    inputs.push(
      <FormControl fullWidth key={inputId}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={inputId}
          label={label}
          onChange={(event) => {
            onChange(inputId, event.target.value as string);
          }}
          value={value}
        >
          {musicians.map((musician) => (
            <MenuItem
              key={musician.id}
              value={musician.id}
              disabled={Object.values(selectedValues).includes(musician.id)}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                sx={{ opacity: musician.isInUpcoming ? 0.5 : 1 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>{musician.name}</Typography>
                  {musician.isRecommended && (
                    <Chip
                      label="Recommended"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {musician.isInUpcoming && (
                    <Chip
                      icon={
                        <AccessTimeIcon sx={{ fontSize: "16px !important" }} />
                      }
                      label="Queued"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {instrument.label}: {musician.stats.instrumentCount}
                  {musician.stats.upcomingInstrumentCount > 0 &&
                    ` (+${musician.stats.upcomingInstrumentCount} queued)`}{" "}
                  | Sessions: {musician.stats.totalSessions}
                  {musician.stats.upcomingSessionsCount > 0 &&
                    ` (+${musician.stats.upcomingSessionsCount} queued)`}{" "}
                  | Total: {formatTime(musician.stats.totalDuration)}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>,
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h6" component="h3">
        {instrument.label}
      </Typography>
      {inputs}
    </Stack>
  );
}

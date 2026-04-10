import { FormEvent, useState } from "react";
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
import { Instrument } from "../../reducers/instruments.reducer";
import { addJamSession } from "../../reducers/jamSession.reducer";
import { useEnrichedMusiciansForInstrument } from "../../selectors/recommendations.selectors";
import { formatTime } from "../../utils/time.utils";

type SelectedMusicianValues = { [key: string]: string };

const SEPARATOR = "//-//";

export default function AddJamSessionButton() {
  const instruments = useInstruments();
  const [open, setOpen] = useState(false);
  const [selectedMusicians, setSelectedMusicians] =
    useState<SelectedMusicianValues>({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedMusicians({});
    setOpen(false);
  };

  const dispatch = useAppDispatch();

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Jam Session
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: FormEvent) => {
              event.preventDefault();

              const formData = new FormData(
                event.currentTarget as HTMLFormElement,
              );
              console.log(formData);

              dispatch(
                addJamSession({
                  members: Object.entries(selectedMusicians).map(
                    ([inputId, musicianId]) => ({
                      instrumentId: inputId.split(SEPARATOR)[0], // inputIds are delimited by a separator
                      musicianId,
                    }),
                  ),
                }),
              );

              handleClose();
            },
            sx: { minWidth: "50vw" },
          },
        }}
      >
        <DialogTitle>Add Jam Session</DialogTitle>
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
          <Button type="submit">Add Jam Session</Button>
        </DialogActions>
      </Dialog>
    </>
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
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {instrument.label}: {musician.stats.instrumentCount} | Total:{" "}
                  {formatTime(musician.stats.totalDuration)}
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

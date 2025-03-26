import { FormEvent, useState } from "react";
import { useInstruments } from "../../selectors/instruments.selectors.ts";
import { useAppDispatch } from "../../hooks.ts";
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
} from "@mui/material";
import { useMusiciansWithInstrument } from "../../selectors/musicians.selectors.ts";
import { Instrument } from "../../reducers/instruments.reducer.ts";
import { addJamSession } from "../../reducers/jamSession.reducer.ts";

type SelectedMusicianValues = { [key: string]: string };

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
            onSubmit: (event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();

              dispatch(
                addJamSession({
                  members: Object.entries(selectedMusicians).map(
                    ([inputId, musicianId]) => ({
                      instrumentId: inputId.split("-")[0], // inputIds are {instrumentId}-{index}
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
  const musicians = useMusiciansWithInstrument(instrument.id);
  const inputs = [];

  for (let i = 0; i < instrument.perSession; i++) {
    let label = instrument.label;
    const inputId = `${instrument.id}-${i}`;
    const labelId = `${inputId}-label`;
    const value = selectedValues[inputId] || "";

    if (instrument.perSession > 1) {
      label += ` (${i + 1})`;
    }

    inputs.push(
      <FormControl fullWidth>
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
              {musician.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>,
    );
  }

  return (
    <Stack spacing={1}>
      <h3>{instrument.label}</h3>
      {inputs}
    </Stack>
  );
}

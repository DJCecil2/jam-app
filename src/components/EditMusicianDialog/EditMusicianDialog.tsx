import { FormEvent, useEffect, useState } from "react";
import { editMusician } from "../../reducers/musicians.reducer.ts";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useMusician } from "../../selectors/musicians.selectors.ts";
import useSelectedInstruments from "../../hooks/useSelectedInstruments.ts";
import { useAppDispatch } from "../../hooks.ts";
import { useInstruments } from "../../selectors/instruments.selectors.ts";

interface EditMusicianDialogProps {
  musicianId: string;
  open: boolean;
  handleClose: () => void;
}

export default function EditMusicianDialog({
  musicianId,
  open,
  handleClose,
}: EditMusicianDialogProps) {
  const dispatch = useAppDispatch();
  const musician = useMusician(musicianId);
  const instruments = useInstruments();
  const [musicianName, setMusicianName] = useState(musician.name);
  const [selectedInstrumentIds, setSelectedInstrumentIds] =
    useSelectedInstruments(musician.instrumentIds);

  useEffect(() => {
    setMusicianName(musician.name);
  }, [musician.name]);

  const instrumentsAreSelected = Object.values(selectedInstrumentIds).some(
    (value) => value,
  );
  const formIsValid = instrumentsAreSelected && !!musicianName;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            dispatch(
              editMusician({
                id: musicianId,
                name: musicianName,
                instrumentIds: Object.entries(selectedInstrumentIds).reduce<
                  string[]
                >(
                  (acc, [instrumentId, selected]): string[] =>
                    selected ? [...acc, instrumentId] : acc,
                  [],
                ),
              }),
            );

            handleClose();
          },
          sx: { minWidth: "50vw" },
        },
      }}
    >
      <DialogTitle>Edit {musician.name}</DialogTitle>
      <DialogContent>
        <TextField
          required
          id="musician-name-input"
          label="Name"
          value={musicianName}
          onChange={({ target: { value } }) => setMusicianName(value)}
        />
        <FormGroup sx={{ pt: 2 }}>
          Instruments
          {instruments.map((instrument) => (
            <FormControlLabel
              id={`${instrument.id}-checkbox`}
              control={
                <Checkbox
                  onChange={(event) => {
                    setSelectedInstrumentIds((prevState) => ({
                      ...prevState,
                      [instrument.id]: event.target.checked,
                    }));
                  }}
                  checked={selectedInstrumentIds[instrument.id]}
                />
              }
              label={instrument.label}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" disabled={!formIsValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

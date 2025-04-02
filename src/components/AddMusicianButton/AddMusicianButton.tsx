import { FormEvent, useState } from "react";
import { useInstruments } from "../../selectors/instruments.selectors.ts";
import { useAppDispatch } from "../../hooks.ts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  TextField,
  Checkbox,
} from "@mui/material";
import { addMusician } from "../../reducers/musicians.reducer.ts";
import useSelectedInstruments from "../../hooks/useSelectedInstruments.ts";

interface AddMusicianButtonProps {
  instrumentIds?: string[];
}

export default function AddMusicianButton({
  instrumentIds,
}: AddMusicianButtonProps) {
  const instruments = useInstruments();
  const [open, setOpen] = useState(false);
  const [musicianName, setMusicianName] = useState("");
  const [
    selectedInstrumentIds,
    setSelectedInstrumentIds,
    resetSelectedInstruments,
  ] = useSelectedInstruments(instrumentIds);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useAppDispatch();
  const instrumentsAreSelected = Object.values(selectedInstrumentIds).some(
    (value) => value,
  );
  const formIsValid = instrumentsAreSelected && !!musicianName;

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Musician
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
                addMusician({
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
              setMusicianName("");
              resetSelectedInstruments();

              handleClose();
            },
            sx: { minWidth: "50vw" },
          },
        }}
      >
        <DialogTitle>Add Musician</DialogTitle>
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
                key={instrument.id}
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
            Add Musician
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

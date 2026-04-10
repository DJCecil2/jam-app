import { FormEvent, useState } from "react";
import { useInstruments } from "../../selectors/instruments.selectors";
import { useAppDispatch } from "../../hooks";
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
  Stack,
  Typography,
} from "@mui/material";
import { addMusician } from "../../reducers/musicians.reducer";
import useSelectedInstruments from "../../hooks/useSelectedInstruments";

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
    setMusicianName("");
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
            onSubmit: (event: FormEvent) => {
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
              resetSelectedInstruments();

              handleClose();
            },
            sx: { width: { xs: "90vw", md: "50vw" }, maxWidth: "600px" },
          },
        }}
      >
        <DialogTitle>Add Musician</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              required
              id="musician-name-input"
              label="Name"
              value={musicianName}
              onChange={({ target: { value } }) => setMusicianName(value)}
            />
            <FormGroup>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Instruments
              </Typography>
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
          </Stack>
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

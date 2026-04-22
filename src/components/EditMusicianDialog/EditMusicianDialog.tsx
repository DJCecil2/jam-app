import { FormEvent, useEffect, useState } from "react";
import { editMusician } from "../../reducers/musicians.reducer";
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
  Typography,
} from "@mui/material";
import { useMusician } from "../../selectors/musicians.selectors";
import useSelectedInstruments from "../../hooks/useSelectedInstruments";
import { useAppDispatch } from "../../hooks";
import { useInstruments } from "../../selectors/instruments.selectors";
import { useMusicianStatsMap } from "../../selectors/recommendations.selectors";

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
  const statsMap = useMusicianStatsMap();
  const lastPlayedAt = statsMap[musicianId]?.lastPlayedAt;
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
          onSubmit: (event: FormEvent) => {
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
          sx: { width: { xs: "90vw", md: "50vw" }, maxWidth: "600px" },
        },
      }}
    >
      <DialogTitle>Edit {musician.name}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          required
          id="musician-name-input"
          label="Name"
          sx={{ mt: 1 }}
          value={musicianName}
          onChange={({ target: { value } }) => setMusicianName(value)}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Last played:{" "}
          {lastPlayedAt ? new Date(lastPlayedAt).toLocaleString() : "Never"}
        </Typography>
        <FormGroup sx={{ pt: 2 }}>
          Instruments
          {instruments.map((instrument) => (
            <FormControlLabel
              key={instrument.id}
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

import { FormEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch } from "../../hooks";
import { addInstrument } from "../../reducers/instruments.reducer";

interface AddInstrumentMenuItemProps {
  onClose: () => void;
}

export default function AddInstrumentMenuItem({
  onClose,
}: AddInstrumentMenuItemProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setLabel("");
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (label.trim()) {
      dispatch(addInstrument({ label: label.trim() }));
      handleCloseDialog();
    }
  };

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Add Instrument</ListItemText>
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: handleSubmit,
            sx: { minWidth: "30vw" },
          },
        }}
      >
        <DialogTitle>Add New Instrument</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="instrument-label"
            name="label"
            label="Instrument Name"
            fullWidth
            variant="standard"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type="submit" disabled={!label.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

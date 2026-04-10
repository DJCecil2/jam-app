import { useState } from "react";
import { Button } from "@mui/material";
import JamSessionDialog from "../JamSession/JamSessionDialog";

export default function AddJamSessionButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Jam Session
      </Button>
      <JamSessionDialog open={open} onClose={handleClose} />
    </>
  );
}

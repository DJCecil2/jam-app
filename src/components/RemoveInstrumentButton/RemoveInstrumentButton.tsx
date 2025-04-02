import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { removeInstrument } from "../../reducers/instruments.reducer.ts";

interface RemoveInstrumentButtonProps {
  instrumentId: string;
}

export function RemoveInstrumentButton({
  instrumentId,
}: RemoveInstrumentButtonProps) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(removeInstrument({ id: instrumentId }));
  };

  return (
    <IconButton onClick={handleClick}>
      <DeleteIcon />
    </IconButton>
  );
}

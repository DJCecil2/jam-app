import { useInstrument } from "../../selectors/instruments.selectors";
import { useAppDispatch } from "../../hooks";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { updateInstrument } from "../../reducers/instruments.reducer";

interface InstrumentPerSessionSelectProps {
  instrumentId: string;
}

export default function InstrumentPerSessionSelect({
  instrumentId,
}: InstrumentPerSessionSelectProps) {
  const { id, perSession } = useInstrument(instrumentId);
  const dispatch = useAppDispatch();

  return (
    <FormControl>
      <InputLabel id="instrument-per-session-select-label">
        Per Session
      </InputLabel>
      <Select
        labelId="instrument-per-session-select-label"
        id="instrument-per-session-select"
        value={perSession}
        label="Per Session"
        size="small"
        onChange={(event) =>
          dispatch(
            updateInstrument({ id, perSession: Number(event.target.value) }),
          )
        }
      >
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
      </Select>
    </FormControl>
  );
}

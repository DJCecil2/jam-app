import { useAppDispatch } from "../hooks";
import { resetJamSessions } from "../reducers/jamSession.reducer";
import { resetMusicians } from "../reducers/musicians.reducer";
import { resetInstruments } from "../reducers/instruments.reducer";

export function useResetJam() {
  const dispatch = useAppDispatch();

  return () => {
    if (
      window.confirm(
        "Are you sure you want to reset the jam? This will clear all sessions, musicians, and reset instruments.",
      )
    ) {
      dispatch(resetJamSessions());
      dispatch(resetMusicians());
      dispatch(resetInstruments());
    }
  };
}

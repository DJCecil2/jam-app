import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Instrument = {
  id: string;
  label: string;
};

export type InstrumentsState = Instrument[];

/**
 * Default values for most common use cases
 */
const initialState = [
  {
    id: nanoid(),
    label: "Guitar",
  },
  {
    id: nanoid(),
    label: "Drums",
  },
  {
    id: nanoid(),
    label: "Bass",
  },
  {
    id: nanoid(),
    label: "Keys",
  },
  {
    id: nanoid(),
    label: "Vocals",
  },
] satisfies InstrumentsState as InstrumentsState;

type AddInstrumentPayload = {
  label: string;
};

type RemoveInstrumentPayload = {
  id: string;
};

const instrumentSlice = createSlice({
  name: "instruments",
  initialState,
  reducers: {
    addInstrument: (
      state,
      { payload: { label } }: PayloadAction<AddInstrumentPayload>,
    ) => {
      state.push({ id: nanoid(), label });
      return state;
    },
    removeInstrument: (
      state,
      { payload: { id } }: PayloadAction<RemoveInstrumentPayload>,
    ) => {
      return state.filter((instrument) => instrument.id !== id);
    },
  },
});

export const { addInstrument, removeInstrument } = instrumentSlice.actions;

export default instrumentSlice.reducer;

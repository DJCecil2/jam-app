import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Instrument = {
  id: string;
  label: string;
  perSession: number;
};

export type InstrumentsState = Instrument[];

/**
 * Default values for most common use cases
 */
const initialState = [
  {
    id: nanoid(),
    label: "Guitar",
    perSession: 1,
  },
  {
    id: nanoid(),
    label: "Bass",
    perSession: 1,
  },
  {
    id: nanoid(),
    label: "Drums",
    perSession: 1,
  },
  {
    id: nanoid(),
    label: "Keys",
    perSession: 1,
  },
  {
    id: nanoid(),
    label: "Vocals",
    perSession: 1,
  }
] satisfies InstrumentsState as InstrumentsState;

type AddInstrumentPayload = {
  label: string;
};

type UpdateInstrumentPayload = {
  id: string;
  label?: string;
  perSession?: number;
}

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
      state.push({ id: nanoid(), label, perSession: 1 });
      return state;
    },
    updateInstrument: (state, {payload: {id, label, perSession}}: PayloadAction<UpdateInstrumentPayload>) => {
      const instrument = state.find((instrument) => instrument.id === id);

      if (instrument) {
        if (perSession) {
          instrument.perSession = perSession;
        }

        if (label) {
          instrument.label = label;
        }
      }

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

export const { addInstrument, updateInstrument, removeInstrument } = instrumentSlice.actions;

export default instrumentSlice.reducer;

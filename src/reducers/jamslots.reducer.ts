import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type JamSlot = {
  id: string;
  instrumentId: string;
};

export type JamSlotsState = JamSlot[];

/**
 * Default values for most common use cases
 */
const initialState = [] satisfies JamSlotsState as JamSlotsState;

type AddJamSlotPayload = {
  instrumentId: string;
};

type RemoveJamSlotPayload = {
  id: string;
};

const jamSlotsSlice = createSlice({
  name: "jamSlots",
  initialState,
  reducers: {
    addJamSlot: (
      state,
      { payload: { instrumentId } }: PayloadAction<AddJamSlotPayload>,
    ) => {
      state.push({ id: nanoid(), instrumentId });
      return state;
    },
    removeJamSlot: (
      state,
      { payload: { id } }: PayloadAction<RemoveJamSlotPayload>,
    ) => {
      return state.filter((slot) => slot.id !== id);
    },
  },
});

export const { addJamSlot, removeJamSlot } = jamSlotsSlice.actions;

export default jamSlotsSlice.reducer;

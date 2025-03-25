import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Musician = {
  id: string;
  name: string;
  instrumentIds: string[];
};

export type MusiciansState = Musician[];

/**
 * Default values for most common use cases
 */
const initialState = [] satisfies MusiciansState as MusiciansState;

type AddMusicianPayload = {
  name: string;
  instrumentIds: string[];
};

type RemoveMusicianPayload = {
  id: string;
};

const instrumentSlice = createSlice({
  name: "Musicians",
  initialState,
  reducers: {
    addMusician: (
      state,
      { payload: { name, instrumentIds } }: PayloadAction<AddMusicianPayload>,
    ) => {
      state.push({ id: nanoid(), name, instrumentIds });

      return state;
    },
    removeMusician: (
      state,
      { payload: { id } }: PayloadAction<RemoveMusicianPayload>,
    ) => {
      return state.filter((slot) => slot.id !== id);
    },
  },
});

export const { addMusician, removeMusician } = instrumentSlice.actions;

export default instrumentSlice.reducer;

﻿import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RemoveInstrumentPayload } from "./instruments.reducer.ts";

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

type EditMusicianPayload = AddMusicianPayload & {
  id: string;
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
    editMusician: (
      state,
      {
        payload: { id, name, instrumentIds },
      }: PayloadAction<EditMusicianPayload>,
    ) => {
      const musician = state.find((musician) => musician.id === id);

      if (musician) {
        musician.name = name;
        musician.instrumentIds = instrumentIds;
      }

      return state;
    },
    removeMusician: (
      state,
      { payload: { id } }: PayloadAction<RemoveMusicianPayload>,
    ) => {
      return state.filter((slot) => slot.id !== id);
    },
    removeInstrument: (
      state,
      { payload }: PayloadAction<RemoveInstrumentPayload>,
    ) => {
      state.forEach((musician) => {
        musician.instrumentIds = musician.instrumentIds.filter(
          (instrumentId) => instrumentId === payload.id,
        );
      });

      return state;
    },
  },
});

export const { addMusician, editMusician, removeMusician } =
  instrumentSlice.actions;

export default instrumentSlice.reducer;

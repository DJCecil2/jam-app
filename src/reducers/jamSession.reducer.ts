import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type JamSession = {
  id: string;
  members: JamMember[];
};

type JamMember = {
  musicianId: string;
  instrumentId: string;
};

export type JamSessionsState = JamSession[];

/**
 * Default values for most common use cases
 */
const initialState = [] satisfies JamSessionsState as JamSessionsState;

type AddJamSessionPayload = Omit<JamSession, "id">;

const jamSessionsSlice = createSlice({
  name: "JamSessions",
  initialState,
  reducers: {
    addJamSession(state, { payload }: PayloadAction<AddJamSessionPayload>) {
      state.push({
        id: nanoid(),
        ...payload,
      });

      return state;
    },
  },
});

export const { addJamSession } = jamSessionsSlice.actions;

export default jamSessionsSlice.reducer;

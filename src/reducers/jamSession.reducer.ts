import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type JamSession = {
  id: string;
  members: JamMember[];
  duration?: number;
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

type AddJamSessionPayload = Omit<JamSession, "id" | "duration">;

type UpdateJamSessionDurationPayload = {
  id: string;
  duration: number;
};

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
    updateJamSessionDuration(
      state,
      { payload }: PayloadAction<UpdateJamSessionDurationPayload>,
    ) {
      const jamSession = state.find((session) => session.id === payload.id);

      if (jamSession) {
        jamSession.duration = payload.duration;
      }

      return state;
    },
    resetJamSessions() {
      return initialState;
    },
  },
});

export const { addJamSession, updateJamSessionDuration, resetJamSessions } =
  jamSessionsSlice.actions;

export default jamSessionsSlice.reducer;

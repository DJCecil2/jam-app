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

type AddMusicianToJamSessionPayload = {
  jamSessionId: string;
  musicianId: string;
  instrumentId: string;
};

type RemoveMusicianFromJamSessionPayload = {
  jamSessionId: string;
  musicianId: string;
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
    addMusicianToJamSession: (
      state,
      {
        payload: { jamSessionId, musicianId, instrumentId },
      }: PayloadAction<AddMusicianToJamSessionPayload>,
    ) => {
      const jamSession = state.find(({ id }) => id === jamSessionId);

      if (jamSession) {
        jamSession.members.push({ musicianId, instrumentId });
      }

      return state;
    },
    removeMusicianFromJamSession: (
      state,
      {
        payload: { musicianId, jamSessionId },
      }: PayloadAction<RemoveMusicianFromJamSessionPayload>,
    ) => {
      const jamSession = state.find(({ id }) => id === jamSessionId);

      if (jamSession) {
        jamSession.members.filter(
          (jamMember) => jamMember.musicianId !== musicianId,
        );
      }

      return state;
    },
  },
});

export const {
  addJamSession,
  addMusicianToJamSession,
  removeMusicianFromJamSession,
} = jamSessionsSlice.actions;

export default jamSessionsSlice.reducer;

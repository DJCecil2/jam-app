import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { InstrumentsState } from "./instruments.reducer";

export type JamSession = {
  id: string;
  members: JamMember[];
  duration?: number;
  completedAt?: number;
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

type UpdateJamSessionPayload = {
  id: string;
  members: JamMember[];
};

type RemoveJamSessionPayload = {
  id: string;
};

export function sortJamMembers(
  members: JamMember[],
  instruments: InstrumentsState,
) {
  const instrumentOrder = instruments.reduce(
    (acc, inst, index) => {
      acc[inst.id] = index;
      return acc;
    },
    {} as Record<string, number>,
  );

  return [...members].sort((a, b) => {
    const orderA = instrumentOrder[a.instrumentId] ?? Infinity;
    const orderB = instrumentOrder[b.instrumentId] ?? Infinity;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return 0;
  });
}

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
    updateJamSession(
      state,
      { payload }: PayloadAction<UpdateJamSessionPayload>,
    ) {
      const jamSession = state.find((session) => session.id === payload.id);

      if (jamSession) {
        jamSession.members = payload.members;
      }

      return state;
    },
    updateJamSessionDuration(
      state,
      { payload }: PayloadAction<UpdateJamSessionDurationPayload>,
    ) {
      const jamSession = state.find((session) => session.id === payload.id);

      if (jamSession) {
        jamSession.duration = payload.duration;
        jamSession.completedAt = Date.now();
      }

      return state;
    },
    removeJamSession(
      state,
      { payload }: PayloadAction<RemoveJamSessionPayload>,
    ) {
      return state.filter((session) => session.id !== payload.id);
    },
    resetJamSessions() {
      return initialState;
    },
  },
});

export const {
  addJamSession,
  updateJamSession,
  updateJamSessionDuration,
  removeJamSession,
  resetJamSessions,
} = jamSessionsSlice.actions;

export default jamSessionsSlice.reducer;

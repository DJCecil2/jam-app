import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { InstrumentsState } from "./instruments.reducer";

export type JamSession = {
  id: string;
  members: JamMember[];
  completed: boolean;
  startedAt?: number;
  pausedDuration?: number;
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

type AddJamSessionPayload = Omit<
  JamSession,
  "id" | "duration" | "startedAt" | "completed" | "completedAt"
>;

type UpdateJamSessionDurationPayload = {
  id: string;
  duration: number;
};

type StartJamSessionPayload = {
  id: string;
  startedAt: number;
};

type PauseJamSessionPayload = {
  id: string;
  pausedDuration: number;
};

type UpdateJamSessionPayload = {
  id: string;
  members: JamMember[];
};

type RemoveJamSessionPayload = {
  id: string;
};

type ReorderJamSessionsPayload = {
  sourceId: string;
  targetId: string;
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
        completed: false,
        completedAt: undefined,
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
        jamSession.completed = true;
        jamSession.startedAt = undefined;
        jamSession.pausedDuration = undefined;
        jamSession.completedAt = Date.now();
      }

      return state;
    },
    startJamSession(state, { payload }: PayloadAction<StartJamSessionPayload>) {
      const jamSession = state.find((session) => session.id === payload.id);

      if (jamSession) {
        jamSession.startedAt = payload.startedAt;
        jamSession.pausedDuration = undefined;
      }

      return state;
    },
    pauseJamSession(state, { payload }: PayloadAction<PauseJamSessionPayload>) {
      const jamSession = state.find((session) => session.id === payload.id);

      if (jamSession) {
        jamSession.startedAt = undefined;
        jamSession.pausedDuration = payload.pausedDuration;
      }

      return state;
    },
    removeJamSession(
      state,
      { payload }: PayloadAction<RemoveJamSessionPayload>,
    ) {
      const jamSession = state.find((session) => session.id === payload.id);

      if (jamSession) {
        if (jamSession.completed && jamSession.duration === undefined) {
          jamSession.completed = false;
          jamSession.completedAt = undefined;
          return state;
        }

        jamSession.completed = true;
        jamSession.startedAt = undefined;
        jamSession.pausedDuration = undefined;
        jamSession.completedAt = Date.now();
      }

      return state;
    },
    reorderJamSessions(
      state,
      { payload }: PayloadAction<ReorderJamSessionsPayload>,
    ) {
      const upcomingSessions = state.filter((session) => !session.completed);
      const currentSession = upcomingSessions[0];

      const isCurrentSessionLocked =
        currentSession !== undefined &&
        (currentSession.startedAt !== undefined ||
          (currentSession.pausedDuration ?? 0) > 0);

      if (
        isCurrentSessionLocked &&
        (payload.sourceId === currentSession.id ||
          payload.targetId === currentSession.id)
      ) {
        return state;
      }

      const sourceIndex = upcomingSessions.findIndex(
        (session) => session.id === payload.sourceId,
      );
      const targetIndex = upcomingSessions.findIndex(
        (session) => session.id === payload.targetId,
      );

      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return state;
      }

      const sourceSession = upcomingSessions[sourceIndex];
      const targetSession = upcomingSessions[targetIndex];

      if (sourceSession.completed || targetSession.completed) {
        return state;
      }

      const [movedSession] = upcomingSessions.splice(sourceIndex, 1);

      if (!movedSession) {
        return state;
      }

      upcomingSessions.splice(targetIndex, 0, movedSession);

      let upcomingIndex = 0;

      for (let index = 0; index < state.length; index += 1) {
        if (state[index].completed) {
          continue;
        }

        state[index] = upcomingSessions[upcomingIndex];
        upcomingIndex += 1;
      }

      return state;
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
  startJamSession,
  pauseJamSession,
  removeJamSession,
  reorderJamSessions,
  resetJamSessions,
} = jamSessionsSlice.actions;

export default jamSessionsSlice.reducer;

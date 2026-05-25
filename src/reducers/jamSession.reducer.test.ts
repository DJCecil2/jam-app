import { describe, expect, it } from "vitest";
import reducer, {
  JamSessionsState,
  reorderJamSessions,
} from "./jamSession.reducer";

function createSession(
  id: string,
  overrides: Partial<JamSessionsState[number]> = {},
): JamSessionsState[number] {
  return {
    id,
    members: [],
    completed: false,
    ...overrides,
  };
}

describe("jamSession reducer", () => {
  it("moves an upcoming session before another upcoming session", () => {
    const initialState: JamSessionsState = [
      createSession("current"),
      createSession("upcoming-1"),
      createSession("completed-1", {
        completed: true,
        duration: 10,
        completedAt: 100,
      }),
      createSession("upcoming-2"),
    ];

    const result = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "upcoming-2",
        targetId: "upcoming-1",
      }),
    );

    expect(result.map((session) => session.id)).toEqual([
      "current",
      "upcoming-2",
      "completed-1",
      "upcoming-1",
    ]);
  });

  it("does not change state when source and target are the same", () => {
    const initialState: JamSessionsState = [
      createSession("current"),
      createSession("upcoming-1"),
      createSession("upcoming-2"),
    ];

    const result = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "upcoming-1",
        targetId: "upcoming-1",
      }),
    );

    expect(result).toEqual(initialState);
  });

  it("does not move completed sessions", () => {
    const initialState: JamSessionsState = [
      createSession("current"),
      createSession("completed-1", {
        completed: true,
        duration: 10,
        completedAt: 100,
      }),
      createSession("upcoming-1"),
    ];

    const result = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "completed-1",
        targetId: "upcoming-1",
      }),
    );

    expect(result).toEqual(initialState);
  });

  it("does not change state when source or target does not exist", () => {
    const initialState: JamSessionsState = [
      createSession("current"),
      createSession("upcoming-1"),
      createSession("upcoming-2"),
    ];

    const result = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "missing",
        targetId: "upcoming-1",
      }),
    );

    expect(result).toEqual(initialState);
  });

  it("moves the current session after a lower upcoming session", () => {
    const initialState: JamSessionsState = [
      createSession("current"),
      createSession("upcoming-1"),
      createSession("upcoming-2"),
    ];

    const result = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "current",
        targetId: "upcoming-2",
      }),
    );

    expect(result.map((session) => session.id)).toEqual([
      "upcoming-1",
      "upcoming-2",
      "current",
    ]);
  });

  it("moves an upcoming session before the current session", () => {
    const initialState: JamSessionsState = [
      createSession("current"),
      createSession("upcoming-1"),
      createSession("upcoming-2"),
    ];

    const result = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "upcoming-2",
        targetId: "current",
      }),
    );

    expect(result.map((session) => session.id)).toEqual([
      "upcoming-2",
      "current",
      "upcoming-1",
    ]);
  });

  it("moves an upcoming session down by one position", () => {
    const initialState: JamSessionsState = [
      createSession("current"),
      createSession("upcoming-1"),
      createSession("upcoming-2"),
      createSession("upcoming-3"),
    ];

    const result = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "upcoming-1",
        targetId: "upcoming-2",
      }),
    );

    expect(result.map((session) => session.id)).toEqual([
      "current",
      "upcoming-2",
      "upcoming-1",
      "upcoming-3",
    ]);
  });

  it("does not move the current session when it has started", () => {
    const initialState: JamSessionsState = [
      createSession("current", { startedAt: Date.now() - 5_000 }),
      createSession("upcoming-1"),
      createSession("upcoming-2"),
    ];

    const moveCurrentResult = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "current",
        targetId: "upcoming-2",
      }),
    );

    const replaceCurrentResult = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "upcoming-2",
        targetId: "current",
      }),
    );

    expect(moveCurrentResult).toEqual(initialState);
    expect(replaceCurrentResult).toEqual(initialState);
  });

  it("does not replace the current session when it is paused", () => {
    const initialState: JamSessionsState = [
      createSession("current", { pausedDuration: 12 }),
      createSession("upcoming-1"),
      createSession("upcoming-2"),
    ];

    const result = reducer(
      initialState,
      reorderJamSessions({
        sourceId: "upcoming-1",
        targetId: "current",
      }),
    );

    expect(result).toEqual(initialState);
  });
});

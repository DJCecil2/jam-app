import { useMemo } from "react";
import {
  useCompletedJamSessions,
  useUpcomingJamSessions,
} from "./jamSessions.selectors";
import { useMusiciansWithInstrument } from "./musicians.selectors";

export type MusicianStats = {
  totalDuration: number;
  totalSessions: number;
  instrumentStats: Record<string, { count: number }>;
  lastPlayedAt?: number;
};

export function useMusicianStatsMap() {
  const completedSessions = useCompletedJamSessions();

  return useMemo(() => {
    const stats: Record<string, MusicianStats> = {};

    completedSessions.forEach((session) => {
      const duration = session.duration || 0;
      const completedAt = session.completedAt || 0;
      session.members.forEach((member) => {
        if (!stats[member.musicianId]) {
          stats[member.musicianId] = {
            totalDuration: 0,
            totalSessions: 0,
            instrumentStats: {},
            lastPlayedAt: 0,
          };
        }
        const s = stats[member.musicianId];
        s.totalDuration += duration;
        s.totalSessions += 1;
        if (completedAt > (s.lastPlayedAt || 0)) {
          s.lastPlayedAt = completedAt;
        }
        if (!s.instrumentStats[member.instrumentId]) {
          s.instrumentStats[member.instrumentId] = { count: 0 };
        }
        s.instrumentStats[member.instrumentId].count += 1;
      });
    });

    return stats;
  }, [completedSessions]);
}

export function useMusiciansInUpcomingJams() {
  const upcomingSessions = useUpcomingJamSessions();

  return useMemo(() => {
    const ids = new Set<string>();
    upcomingSessions.forEach((session) => {
      session.members.forEach((member) => {
        ids.add(member.musicianId);
      });
    });
    return ids;
  }, [upcomingSessions]);
}

export function useMusicianUpcomingStatsMap() {
  const upcomingSessions = useUpcomingJamSessions();

  return useMemo(() => {
    const stats: Record<
      string,
      { total: number; instrumentStats: Record<string, number> }
    > = {};

    upcomingSessions.forEach((session) => {
      session.members.forEach((member) => {
        if (!stats[member.musicianId]) {
          stats[member.musicianId] = { total: 0, instrumentStats: {} };
        }
        const s = stats[member.musicianId];
        s.total += 1;
        s.instrumentStats[member.instrumentId] =
          (s.instrumentStats[member.instrumentId] || 0) + 1;
      });
    });

    return stats;
  }, [upcomingSessions]);
}

export function useEnrichedMusiciansForInstrument(instrumentId: string) {
  const musicians = useMusiciansWithInstrument(instrumentId);
  const statsMap = useMusicianStatsMap();
  const upcomingStatsMap = useMusicianUpcomingStatsMap();
  const upcomingMusicianIds = useMusiciansInUpcomingJams();

  return useMemo(() => {
    const enriched = musicians.map((musician) => {
      const stats = statsMap[musician.id] || {
        totalDuration: 0,
        totalSessions: 0,
        instrumentStats: {},
        lastPlayedAt: 0,
      };
      const upcomingStats = upcomingStatsMap[musician.id] || {
        total: 0,
        instrumentStats: {},
      };

      const instrumentCount = stats.instrumentStats[instrumentId]?.count || 0;
      const upcomingInstrumentCount =
        upcomingStats.instrumentStats[instrumentId] || 0;
      const isInUpcoming = upcomingMusicianIds.has(musician.id);

      return {
        ...musician,
        stats: {
          totalDuration: stats.totalDuration,
          instrumentCount,
          totalSessions: stats.totalSessions,
          lastPlayedAt: stats.lastPlayedAt || 0,
          upcomingSessionsCount: upcomingStats.total,
          upcomingInstrumentCount,
        },
        isInUpcoming,
      };
    });

    // Determine recommendation criteria
    const anyHasNotPlayedAtAll = enriched.some(
      (m) => !m.isInUpcoming && m.stats.totalSessions === 0,
    );
    const anyHasNotPlayedThisInstrument = enriched.some(
      (m) => !m.isInUpcoming && m.stats.instrumentCount === 0,
    );

    return enriched
      .map((m) => {
        const hasNotPlayedAtAll = m.stats.totalSessions === 0;
        const hasNotPlayedThisInstrument = m.stats.instrumentCount === 0;

        // Rule 1: Not played at all -> recommended
        let isRecommended = !m.isInUpcoming && hasNotPlayedAtAll;

        // Rule 2 & 3: Not played this instrument -> recommended when it's their turn (after everyone else has played)
        if (
          !m.isInUpcoming &&
          hasNotPlayedThisInstrument &&
          !anyHasNotPlayedAtAll
        ) {
          isRecommended = true;
        }

        // Rule 4: Haven't played in a while -> recommended
        // (We'll mark them as recommended if they are not in upcoming and no one is in a higher priority recommendation tier)
        if (
          !m.isInUpcoming &&
          !anyHasNotPlayedAtAll &&
          !anyHasNotPlayedThisInstrument
        ) {
          // If everyone has played this instrument at least once,
          // then the ones who played longest ago are recommended.
          const minLastPlayedAt = Math.min(
            ...enriched
              .filter((musician) => !musician.isInUpcoming)
              .map((musician) => musician.stats.lastPlayedAt),
          );
          if (m.stats.lastPlayedAt === minLastPlayedAt) {
            isRecommended = true;
          }
        }

        return {
          ...m,
          isRecommended,
        };
      })
      .sort((a, b) => {
        // Rule 5: Queued to play (isInUpcoming) should be at the bottom
        if (a.isInUpcoming !== b.isInUpcoming) {
          return a.isInUpcoming ? 1 : -1;
        }

        // Rule 1: Not played at all first
        if (a.stats.totalSessions === 0 || b.stats.totalSessions === 0) {
          if (a.stats.totalSessions !== b.stats.totalSessions) {
            return a.stats.totalSessions - b.stats.totalSessions;
          }
        }

        // Rule 2 & 3: Not played this instrument first (if they have played at all)
        if (a.stats.instrumentCount === 0 || b.stats.instrumentCount === 0) {
          if (a.stats.instrumentCount !== b.stats.instrumentCount) {
            return a.stats.instrumentCount - b.stats.instrumentCount;
          }
        }

        // Rule 4: Longest ago first
        if (a.stats.lastPlayedAt !== b.stats.lastPlayedAt) {
          return a.stats.lastPlayedAt - b.stats.lastPlayedAt;
        }

        // Then by total sessions
        if (a.stats.totalSessions !== b.stats.totalSessions) {
          return a.stats.totalSessions - b.stats.totalSessions;
        }

        // Then by total duration
        return a.stats.totalDuration - b.stats.totalDuration;
      });
  }, [
    musicians,
    statsMap,
    upcomingMusicianIds,
    instrumentId,
    upcomingStatsMap,
  ]);
}

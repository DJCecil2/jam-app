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
};

export function useMusicianStatsMap() {
  const completedSessions = useCompletedJamSessions();

  return useMemo(() => {
    const stats: Record<string, MusicianStats> = {};

    completedSessions.forEach((session) => {
      const duration = session.duration || 0;
      session.members.forEach((member) => {
        if (!stats[member.musicianId]) {
          stats[member.musicianId] = {
            totalDuration: 0,
            totalSessions: 0,
            instrumentStats: {},
          };
        }
        const s = stats[member.musicianId];
        s.totalDuration += duration;
        s.totalSessions += 1;
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

export function useEnrichedMusiciansForInstrument(instrumentId: string) {
  const musicians = useMusiciansWithInstrument(instrumentId);
  const statsMap = useMusicianStatsMap();
  const upcomingMusicianIds = useMusiciansInUpcomingJams();

  return useMemo(() => {
    return musicians
      .map((musician) => {
        const stats = statsMap[musician.id] || {
          totalDuration: 0,
          totalSessions: 0,
          instrumentStats: {},
        };
        const instrumentCount = stats.instrumentStats[instrumentId]?.count || 0;
        const isInUpcoming = upcomingMusicianIds.has(musician.id);
        const hasPlayed = stats.totalSessions > 0;

        // Recommendation: Only suggest musicians who have not played THIS instrument yet and are available.
        const isRecommended = !isInUpcoming && instrumentCount === 0;

        return {
          ...musician,
          stats: {
            totalDuration: stats.totalDuration,
            instrumentCount,
            totalSessions: stats.totalSessions,
          },
          isRecommended,
          isInUpcoming,
          hasPlayed,
        };
      })
      .sort((a, b) => {
        // 1. Recommended (Not Busy) first
        if (a.isRecommended !== b.isRecommended) {
          return a.isRecommended ? -1 : 1;
        }

        // 2. Among Recommended, those who haven't played at all first
        if (a.hasPlayed !== b.hasPlayed) {
          return a.hasPlayed ? 1 : -1;
        }

        // 3. Then by instrument count (least played first)
        if (a.stats.instrumentCount !== b.stats.instrumentCount) {
          return a.stats.instrumentCount - b.stats.instrumentCount;
        }

        // 4. Then by total sessions (least played first)
        if (a.stats.totalSessions !== b.stats.totalSessions) {
          return a.stats.totalSessions - b.stats.totalSessions;
        }

        // 5. Then by total duration (least time first)
        return a.stats.totalDuration - b.stats.totalDuration;
      });
  }, [musicians, statsMap, upcomingMusicianIds, instrumentId]);
}

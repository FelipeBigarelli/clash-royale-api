import { clashApiService } from './clashApi.service';
import { cache } from '../utils/cache';
import { buildScoreContext, buildMemberStats } from '../utils/score';
import { env } from '../config/env';
import type {
  ClanData,
  ClanOverview,
  MemberStats,
  RankingEntry,
  RiverRaceParticipant,
} from '../types/clash.types';

const CACHE_KEY = 'clan_data';

class ClanService {
  async getClanData(forceRefresh = false): Promise<ClanData> {
    if (!forceRefresh) {
      const cached = cache.get<ClanData>(CACHE_KEY);
      if (cached) return cached;
    }

    const tag = env.clanTag;

    // Fetch clan + war data in parallel
    const [clanRaw, raceRaw] = await Promise.all([
      clashApiService.getClan(tag),
      clashApiService.getCurrentRiverRace(tag).catch(() => null),
    ]);

    // Build a lookup map: tag → war participant data
    const participantMap = new Map<string, RiverRaceParticipant>();
    const ourClan = raceRaw?.clan ?? raceRaw?.clans?.find((c) => c.tag === clanRaw.tag);
    if (ourClan?.participants) {
      for (const p of ourClan.participants) {
        participantMap.set(p.tag, p);
      }
    }

    const warState = raceRaw?.state ?? 'notInWar';
    const warFameTotal = ourClan?.fame ?? 0;

    // Build score context (used to normalize scores across clan)
    const ctx = buildScoreContext(clanRaw.memberList, participantMap);

    // Build member stats
    const members: MemberStats[] = clanRaw.memberList.map((m) =>
      buildMemberStats(m, participantMap.get(m.tag), ctx)
    );

    // Rankings: sort by collaborationScore desc
    const ranked = [...members].sort((a, b) => b.collaborationScore - a.collaborationScore);

    const ranking: RankingEntry[] = ranked.map((m, i) => ({
      position: i + 1,
      tag: m.tag,
      name: m.name,
      role: m.role,
      donations: m.donations,
      warFame: m.war.fame,
      collaborationScore: m.collaborationScore,
      activityStatus: m.activityStatus,
      isHighlight: m.isHighlight,
    }));

    const inactive = members.filter(
      (m) => m.isInactive || m.isAbsent || m.activityStatus === 'low'
    );

    const avgDonations =
      members.reduce((acc, m) => acc + m.donations, 0) / (members.length || 1);

    const avgScore =
      members.reduce((acc, m) => acc + m.collaborationScore, 0) / (members.length || 1);

    const warParticipants = members.filter((m) => m.war.participated).length;
    const warAbsents = clanRaw.memberList.length - warParticipants;

    const overview: ClanOverview = {
      tag: clanRaw.tag,
      name: clanRaw.name,
      description: clanRaw.description ?? '',
      clanScore: clanRaw.clanScore,
      clanWarTrophies: clanRaw.clanWarTrophies,
      memberCount: clanRaw.members,
      donationsPerWeek: clanRaw.donationsPerWeek,
      requiredTrophies: clanRaw.requiredTrophies,
      badgeUrl: clanRaw.badgeUrls?.large ?? '',
      location: clanRaw.location?.name ?? 'International',
      warState,
      warTotalFame: warFameTotal,
      warParticipants,
      warAbsents,
      avgDonations: Math.round(avgDonations),
      avgCollaborationScore: Math.round(avgScore),
      lastUpdated: new Date().toISOString(),
    };

    const result: ClanData = { overview, members, ranking, inactive };

    cache.set(CACHE_KEY, result, env.cacheTtlSeconds);
    return result;
  }

  async getMemberByTag(tag: string): Promise<MemberStats | null> {
    const data = await this.getClanData();
    const normalizedTag = tag.startsWith('#') ? tag : `#${tag}`;
    return data.members.find((m) => m.tag === normalizedTag) ?? null;
  }

  invalidateCache(): void {
    cache.invalidate(CACHE_KEY);
  }
}

export const clanService = new ClanService();

import type { ClashMemberRaw, MemberStats, RiverRaceParticipant, ActivityStatus } from '../types/clash.types';

/**
 * COLLABORATION SCORE ENGINE
 *
 * Score range: 0 – 100
 *
 * Weights (total = 100 pts):
 *   War participation presence   → 20 pts  (binary: did they join at all?)
 *   War fame / contribution      → 35 pts  (normalized against best in clan)
 *   Decks used in war            → 15 pts  (normalized: 4 decks = full)
 *   Boat attacks                 → 10 pts  (normalized against best)
 *   Donations                    → 20 pts  (normalized against best in clan)
 *
 * Penalties:
 *   -15 pts if war participant but 0 decks used (joined but did nothing)
 *
 * Status thresholds:
 *   80–100 → champion
 *   60–79  → active
 *   40–59  → average
 *   20–39  → low
 *   0–19   → inactive
 */

const WEIGHTS = {
  warPresence: 20,
  warFame: 35,
  warDecks: 15,
  boatAttacks: 10,
  donations: 20,
};

const PENALTY_JOINED_DID_NOTHING = 15;

interface ScoreContext {
  maxFame: number;
  maxBoatAttacks: number;
  maxDonations: number;
  maxDecksUsed: number;
}

function normalize(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.min(value / max, 1);
}

export function buildScoreContext(
  members: ClashMemberRaw[],
  participants: Map<string, RiverRaceParticipant>
): ScoreContext {
  let maxFame = 1;
  let maxBoatAttacks = 1;
  let maxDonations = 1;
  let maxDecksUsed = 1;

  for (const m of members) {
    if (m.donations > maxDonations) maxDonations = m.donations;
    const p = participants.get(m.tag);
    if (p) {
      if (p.fame > maxFame) maxFame = p.fame;
      if (p.boatAttacks > maxBoatAttacks) maxBoatAttacks = p.boatAttacks;
      if (p.decksUsed > maxDecksUsed) maxDecksUsed = p.decksUsed;
    }
  }

  return { maxFame, maxBoatAttacks, maxDonations, maxDecksUsed };
}

export function calculateCollaborationScore(
  member: ClashMemberRaw,
  participant: RiverRaceParticipant | undefined,
  ctx: ScoreContext
): number {
  let score = 0;

  // Donations component
  score += normalize(member.donations, ctx.maxDonations) * WEIGHTS.donations;

  if (participant) {
    // War presence
    score += WEIGHTS.warPresence;

    // War fame
    score += normalize(participant.fame, ctx.maxFame) * WEIGHTS.warFame;

    // Decks used (max 4 per day × war days; normalize against clan best)
    score += normalize(participant.decksUsed, ctx.maxDecksUsed) * WEIGHTS.warDecks;

    // Boat attacks
    score += normalize(participant.boatAttacks, ctx.maxBoatAttacks) * WEIGHTS.boatAttacks;

    // Penalty: joined war but used 0 decks
    if (participant.decksUsed === 0) {
      score = Math.max(0, score - PENALTY_JOINED_DID_NOTHING);
    }
  }

  return Math.round(Math.min(score, 100));
}

export function resolveActivityStatus(score: number): ActivityStatus {
  if (score >= 80) return 'champion';
  if (score >= 60) return 'active';
  if (score >= 40) return 'average';
  if (score >= 20) return 'low';
  return 'inactive';
}

export function buildMemberStats(
  raw: ClashMemberRaw,
  participant: RiverRaceParticipant | undefined,
  ctx: ScoreContext
): MemberStats {
  const score = calculateCollaborationScore(raw, participant, ctx);
  const status = resolveActivityStatus(score);

  const donationRatio =
    raw.donationsReceived > 0
      ? parseFloat((raw.donations / raw.donationsReceived).toFixed(2))
      : raw.donations > 0
      ? raw.donations
      : 0;

  return {
    tag: raw.tag,
    name: raw.name,
    role: raw.role,
    expLevel: raw.expLevel,
    trophies: raw.trophies,
    clanRank: raw.clanRank,
    donations: raw.donations,
    donationsReceived: raw.donationsReceived,
    donationRatio,
    war: {
      participated: !!participant,
      fame: participant?.fame ?? 0,
      repairPoints: participant?.repairPoints ?? 0,
      boatAttacks: participant?.boatAttacks ?? 0,
      decksUsed: participant?.decksUsed ?? 0,
      decksUsedToday: participant?.decksUsedToday ?? 0,
    },
    collaborationScore: score,
    activityStatus: status,
    isHighlight: status === 'champion',
    isInactive: status === 'inactive',
    // Absent = in war participant list but used 0 decks, OR not in list at all (and war is active)
    isAbsent: participant ? participant.decksUsed === 0 : false,
  };
}

// ─── Clash Royale API Raw Types ─────────────────────────────────────────────

export interface ClashBadge {
  name: string;
  id: number;
  level: number;
  maxLevel: number;
  progress: number;
  iconUrls: { large: string };
}

export interface ClashMemberRaw {
  tag: string;
  name: string;
  role: 'member' | 'elder' | 'coLeader' | 'leader';
  lastSeen: string;
  expLevel: number;
  trophies: number;
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  clanChestPoints: number;
  arena: { id: number; name: string };
}

export interface ClashClanRaw {
  tag: string;
  name: string;
  type: string;
  description: string;
  badgeId: number;
  clanScore: number;
  clanWarTrophies: number;
  location: { id: number; name: string; isCountry: boolean; countryCode: string };
  requiredTrophies: number;
  donationsPerWeek: number;
  clanChestLevel: number;
  clanChestMaxLevel: number;
  members: number;
  memberList: ClashMemberRaw[];
  badgeUrls: { small: string; medium: string; large: string };
}

export interface RiverRaceParticipant {
  tag: string;
  name: string;
  fame: number;
  repairPoints: number;
  boatAttacks: number;
  decksUsed: number;
  decksUsedToday: number;
}

export interface RiverRaceClan {
  tag: string;
  name: string;
  badgeId: number;
  clanScore: number;
  participants: RiverRaceParticipant[];
  periodPoints: number;
  fame: number;
  repairPoints: number;
  finishTime?: string;
}

export interface RiverRacePeriod {
  type: 'training' | 'warDay';
  periodIndex: number;
  items: RiverRacePeriodItem[];
}

export interface RiverRacePeriodItem {
  clan: RiverRaceClan;
  standing?: number;
}

export interface CurrentRiverRaceRaw {
  tag?: string;
  state: string;
  clan: RiverRaceClan;
  clans: RiverRaceClan[];
  periodType?: string;
  periodIndex?: number;
  sectionIndex?: number;
  periodLogs?: RiverRacePeriod[];
  createdDate?: string;
}

// ─── Domain / Processed Types ────────────────────────────────────────────────

export type MemberRole = 'leader' | 'coLeader' | 'elder' | 'member';

export type ActivityStatus = 'champion' | 'active' | 'average' | 'low' | 'inactive';

export interface WarParticipation {
  participated: boolean;
  fame: number;
  repairPoints: number;
  boatAttacks: number;
  decksUsed: number;
  decksUsedToday: number;
}

export interface MemberStats {
  tag: string;
  name: string;
  role: MemberRole;
  expLevel: number;
  trophies: number;
  clanRank: number;
  donations: number;
  donationsReceived: number;
  donationRatio: number;
  war: WarParticipation;
  collaborationScore: number;
  activityStatus: ActivityStatus;
  isHighlight: boolean;
  isInactive: boolean;
  isAbsent: boolean; // did not attack in war
}

export interface ClanOverview {
  tag: string;
  name: string;
  description: string;
  clanScore: number;
  clanWarTrophies: number;
  memberCount: number;
  donationsPerWeek: number;
  requiredTrophies: number;
  badgeUrl: string;
  location: string;
  warState: string;
  warTotalFame: number;
  warParticipants: number;
  warAbsents: number;
  avgDonations: number;
  avgCollaborationScore: number;
  lastUpdated: string;
}

export interface RankingEntry {
  position: number;
  tag: string;
  name: string;
  role: MemberRole;
  donations: number;
  warFame: number;
  collaborationScore: number;
  activityStatus: ActivityStatus;
  isHighlight: boolean;
}

export interface ClanData {
  overview: ClanOverview;
  members: MemberStats[];
  ranking: RankingEntry[];
  inactive: MemberStats[];
}

export interface ApiErrorResponse {
  reason: string;
  message: string;
  type: string;
  detail?: unknown;
}

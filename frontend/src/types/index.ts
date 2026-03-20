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
  isAbsent: boolean;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  error?: { code: string; message: string };
}

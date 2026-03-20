import type { ApiResponse, ClanOverview, MemberStats, RankingEntry } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: 'no-store' });
  const json: ApiResponse<T> = await res.json();

  if (!json.success || !res.ok) {
    throw new Error(json.error?.message ?? 'API error');
  }
  return json.data;
}

export const api = {
  getOverview: () => fetchApi<ClanOverview>('/clan/overview'),
  getMembers: () => fetchApi<MemberStats[]>('/clan/members'),
  getRanking: () => fetchApi<RankingEntry[]>('/clan/ranking'),
  getInactive: () => fetchApi<MemberStats[]>('/clan/inactive'),
  getMember: (tag: string) => fetchApi<MemberStats>(`/clan/member/${encodeURIComponent(tag)}`),
  refresh: async (): Promise<ClanOverview> => {
    const res = await fetch(`${BASE_URL}/clan/refresh`, { method: 'POST', cache: 'no-store' });
    const json: ApiResponse<ClanOverview> = await res.json();
    if (!json.success) throw new Error(json.error?.message ?? 'Refresh failed');
    return json.data;
  },
};

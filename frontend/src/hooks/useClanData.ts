'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { ClanOverview, MemberStats, RankingEntry } from '@/types';

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApiData<T>(fetcher: () => Promise<T>): UseDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useOverview() {
  return useApiData<ClanOverview>(api.getOverview);
}

export function useMembers() {
  return useApiData<MemberStats[]>(api.getMembers);
}

export function useRanking() {
  return useApiData<RankingEntry[]>(api.getRanking);
}

export function useInactive() {
  return useApiData<MemberStats[]>(api.getInactive);
}

export function useMember(tag: string) {
  return useApiData<MemberStats>(() => api.getMember(tag));
}

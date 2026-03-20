import axios, { AxiosInstance, AxiosError } from 'axios';
import { env, encodeClanTag } from '../config/env';
import {
  ClashClanRaw,
  CurrentRiverRaceRaw,
  ApiErrorResponse,
} from '../types/clash.types';
import {
  ClashApiError,
  ClanNotFoundError,
  InvalidTokenError,
  RateLimitError,
} from '../utils/errors';

class ClashApiService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.clashroyale.com/v1',
      headers: {
        Authorization: `Bearer ${env.clashApiToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10_000,
    });
  }

  private handleError(error: unknown, tag: string): never {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<ApiErrorResponse>;
      const status = axiosErr.response?.status;

      if (status === 403) throw new InvalidTokenError();
      if (status === 404) throw new ClanNotFoundError(tag);
      if (status === 429) throw new RateLimitError();

      const reason = axiosErr.response?.data?.message ?? 'Unknown Clash API error';
      throw new ClashApiError(reason, status ?? 500);
    }
    throw new ClashApiError('Failed to reach Clash Royale API', 503);
  }

  async getClan(tag: string): Promise<ClashClanRaw> {
    try {
      const res = await this.client.get<ClashClanRaw>(`/clans/${encodeClanTag(tag)}`);
      return res.data;
    } catch (err) {
      this.handleError(err, tag);
    }
  }

  async getCurrentRiverRace(tag: string): Promise<CurrentRiverRaceRaw> {
    try {
      const res = await this.client.get<CurrentRiverRaceRaw>(
        `/clans/${encodeClanTag(tag)}/currentriverrace`
      );
      return res.data;
    } catch (err) {
      this.handleError(err, tag);
    }
  }
}

export const clashApiService = new ClashApiService();

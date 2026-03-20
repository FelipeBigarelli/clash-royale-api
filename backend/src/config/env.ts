import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  clashApiToken: requireEnv('CLASH_API_TOKEN'),
  clanTag: requireEnv('CLAN_TAG'),
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS ?? '90', 10),
};

/** Converts a clan tag (e.g. #ABC123 or ABC123) to a URL-safe encoded string. */
export function encodeClanTag(tag: string): string {
  const clean = tag.startsWith('#') ? tag.slice(1) : tag;
  return encodeURIComponent(`#${clean}`);
}

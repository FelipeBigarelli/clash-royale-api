export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ClashApiError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, 'CLASH_API_ERROR');
    this.name = 'ClashApiError';
  }
}

export class ClanNotFoundError extends AppError {
  constructor(tag: string) {
    super(`Clan with tag "${tag}" not found.`, 404, 'CLAN_NOT_FOUND');
    this.name = 'ClanNotFoundError';
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super('Invalid or missing Clash Royale API token.', 403, 'INVALID_TOKEN');
    this.name = 'InvalidTokenError';
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super('Clash Royale API rate limit exceeded. Try again shortly.', 429, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

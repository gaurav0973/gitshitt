export function chatDailyLimit(isPro: boolean): number {
  return isPro ? 100 : 5;
}

export function commandDailyLimit(isPro: boolean): number {
  return isPro ? Number.MAX_SAFE_INTEGER : 5;
}

export function demoDailyLimit(isPro: boolean): number {
  return isPro ? Number.MAX_SAFE_INTEGER : 3;
}

export function canSaveSessions(isPro: boolean): boolean {
  return isPro;
}

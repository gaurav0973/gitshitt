export function chatDailyLimit(isPro: boolean): number {
  return isPro ? 100 : 5;
}

export function canSaveSessions(isPro: boolean): boolean {
  return isPro;
}

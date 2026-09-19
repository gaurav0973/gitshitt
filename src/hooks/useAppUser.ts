"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

export interface AppUserResponse {
  id: string;
  email: string;
  name: string | null;
  isPro: boolean;
  stats: {
    sessionCount: number;
    commandCount: number;
    streakDays: number;
  };
  limits: {
    chatMessagesToday: number;
    chatDailyLimit: number;
    commandsUsedToday: number;
    commandDailyLimit: number;
    demosUsedToday: number;
    demoDailyLimit: number;
  };
}

export function useAppUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const [user, setUser] = useState<AppUserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/me");
      if (!response.ok) {
        throw new Error("Failed to load user");
      }
      const data = (await response.json()) as AppUserResponse;
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    void refresh();
  }, [isLoaded, refresh]);

  return { user, loading, error, refresh, isSignedIn, isLoaded };
}

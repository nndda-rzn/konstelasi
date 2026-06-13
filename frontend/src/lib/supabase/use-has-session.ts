"use client";

import { useEffect, useState } from "react";
import { createClient } from "./client";

/**
 * useHasSession - Reactive check for active Supabase session.
 * Returns:
 *   - `null` while initial session check is in flight
 *   - `true` if there is an active session
 *   - `false` if there is no active session
 * Subscribes to Supabase auth state changes (login, logout, token refresh).
 */
export function useHasSession(): boolean | null {
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setHasSession(Boolean(data.session));
      })
      .catch(() => {
        if (mounted) setHasSession(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setHasSession(Boolean(session));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return hasSession;
}

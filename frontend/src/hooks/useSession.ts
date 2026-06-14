"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * useSession - Lightweight hook that tracks Supabase auth session state.
 * Used to gate auth-guarded GraphQL queries so they don't fire when
 * the user is logged out (which would surface as a noisy
 * "Unauthorized" CombinedGraphQLError on every page load).
 */
export function useSession() {
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setHasSession(!!data.session);
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setHasSession(!!session);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { hasSession, isLoading };
}

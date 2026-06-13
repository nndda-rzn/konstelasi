"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PIN_LENGTH = 6;
const PIN_PATTERN = /^\d{6}$/;

/**
 * useLogin - Handles email + 6-digit PIN authentication via Supabase.
 * The PIN is sent as the Supabase password (PIN-as-password strategy).
 * Manages form state + loading + error states.
 */
export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!PIN_PATTERN.test(pin)) {
      setError("PIN harus 6 digit angka");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/canvas");
    router.refresh();
  };

  return {
    email,
    setEmail,
    pin,
    setPin,
    error,
    loading,
    submit,
    PIN_LENGTH,
  };
};

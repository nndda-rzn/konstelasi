"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { PinInput } from "@/features/auth/components/PinInput";
import { AuthBackground } from "@/features/auth/components/scene/AuthBackground";

// TODO: replace "Northroom" with the final brand name.
const BRAND = "Northroom";
const PIN_PATTERN = /^\d{6}$/;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess("");

    if (!PIN_PATTERN.test(pin)) {
      setError("Your PIN must be 6 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pin,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/canvas";
      return;
    }

    setSuccess("Account created. Check your email to verify it.");
    setLoading(false);
  };

  const pinMismatch = Boolean(confirmPin) && pin !== confirmPin;

  return (
    <main className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-[#070812] px-5 py-6 text-white sm:px-8">
      <AuthBackground />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(242,184,75,0.06) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-20 w-full max-w-[440px] animate-fade-in-up">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(circle_at_50%_25%,rgba(242,184,75,0.1),transparent_62%)] blur-2xl"
        />
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[rgba(14,12,22,0.8)] p-9 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] font-serif text-lg font-semibold text-[#F2E6CF]">
                N
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-[#F8F4EF]">
                {BRAND}
              </span>
            </div>

            <div className="mt-9">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8C8088]">
                Create account
              </p>
              <h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#F8F4EF]">
                Start your space
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#AFA6AD]">
                A calm, personal workspace for your writing.
              </p>
            </div>
          </div>

          <form className="relative mt-8 space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="rounded-2xl border border-[#E63946]/35 bg-[#E63946]/12 px-4 py-3 text-sm text-[#F8D7DA]">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-emerald-400/35 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-100">
                {success}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#8C8088]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block h-[54px] w-full rounded-xl border border-white/12 bg-white/[0.06] px-4 text-sm text-[#F8F4EF] outline-none transition-all placeholder:text-[#F8F4EF]/38 focus:border-[#F2B84B]/60 focus:bg-white/[0.09] focus:ring-2 focus:ring-[#F2B84B]/15"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <PinInput
                  id="register-pin"
                  label="PIN"
                  value={pin}
                  onChange={setPin}
                  disabled={loading}
                />
                <p className="mt-2 text-[11px] font-medium text-[#7F747C]">
                  Use your 6-digit private code.
                </p>
              </div>

              <div>
                <PinInput
                  id="register-confirm-pin"
                  label="Confirm PIN"
                  value={confirmPin}
                  onChange={setConfirmPin}
                  error={pinMismatch}
                  disabled={loading}
                />
                {pinMismatch && (
                  <p className="mt-2 text-[11px] font-medium text-[#E94B3C]">
                    PINs do not match.
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-1 flex h-[54px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#B11E2A] bg-gradient-to-b from-[#C0303A] to-[#9E1722] text-sm font-semibold text-[#FFF6F0] shadow-[0_8px_22px_rgba(140,20,30,0.32)] transition-all hover:-translate-y-px hover:brightness-[1.04] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/25" />
              {loading ? (
                <Loader2 className="relative h-5 w-5 animate-spin" />
              ) : (
                <span className="relative">Create account</span>
              )}
            </button>
          </form>

          <p className="relative mt-7 border-t border-white/[0.07] pt-6 text-center text-sm text-[#AFA6AD]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#F2B84B] transition-opacity hover:opacity-80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

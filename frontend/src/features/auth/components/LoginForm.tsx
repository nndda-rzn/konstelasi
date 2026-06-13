"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { PinInput } from "./PinInput";
import { BRAND, BRAND_MONOGRAM } from "../lib/brand";

interface LoginFormProps {
  email: string;
  setEmail: (v: string) => void;
  pin: string;
  setPin: (v: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * LoginForm - Private writing studio sign-in card.
 * Email + 6-digit PIN (PIN-as-password Supabase).
 */
export function LoginForm({
  email,
  setEmail,
  pin,
  setPin,
  error,
  loading,
  onSubmit,
}: LoginFormProps) {
  const pinInvalid = Boolean(error) && pin.length > 0;

  return (
    <section className="relative mx-auto w-full max-w-[440px] animate-fade-in-up">
      {/* floating outer glow behind card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(circle_at_50%_25%,rgba(242,184,75,0.1),transparent_62%)] blur-2xl"
      />
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[rgba(14,12,22,0.8)] p-9 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-10">
        {/* inner top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="relative">
          {/* monogram + wordmark */}
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] font-serif text-lg font-semibold text-[#F2E6CF]">
              {BRAND_MONOGRAM}
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[#F8F4EF]">
              {BRAND}
            </span>
          </div>

          <div className="mt-9">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8C8088]">
              Private access
            </p>
            <h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#F8F4EF]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#AFA6AD]">
              Enter your personal writing space.
            </p>
          </div>
        </div>

        <form className="relative mt-8 space-y-5" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-2xl border border-[#E63946]/35 bg-[#E63946]/12 px-4 py-3 text-sm text-[#F8D7DA]">
              {error}
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
                id="pin"
                label="PIN"
                value={pin}
                onChange={setPin}
                error={pinInvalid}
                autoFocus={false}
                disabled={loading}
              />
              <p className="mt-2 text-[11px] font-medium text-[#7F747C]">
                Use your 6-digit private code.
              </p>
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
              <>
                <span className="relative">Sign in</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="relative mt-7 border-t border-white/[0.07] pt-6 text-center text-sm text-[#AFA6AD]">
          Don&rsquo;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#F2B84B] transition-opacity hover:opacity-80"
          >
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}

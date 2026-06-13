"use client";

import Link from "next/link";
import { ArrowRight, Gem, Loader2, Mail, Sparkles } from "lucide-react";
import { PinInput } from "./PinInput";

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
 * LoginForm - Premium dark-translucent login card.
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
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(circle_at_50%_30%,rgba(242,184,75,0.16),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(184,15,30,0.14),transparent_65%)] blur-2xl"
      />
      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.1] bg-[rgba(14,12,22,0.78)] p-9 shadow-[0_32px_100px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06] backdrop-blur-2xl sm:p-10">
        {/* inner top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {/* radial highlight top */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-56 -translate-x-1/2 rounded-full bg-[#F2B84B]/10 blur-[70px]" />

        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#E94B3C] via-[#D99A2B] to-[#F2B84B] shadow-[0_10px_30px_rgba(230,57,70,0.28)]">
            <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[28px] bg-[#F2B84B]/25 blur-xl" />
            <Gem className="h-7 w-7 text-white" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#F2B84B]/85">
            Private access
          </p>
          <h2 className="mt-2.5 text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#F8F4EF]">
            Selamat datang kembali
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#A99EA6]">
            Masuk ke ruang kerja personalmu dengan tenang.
          </p>
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
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A99EA6]"
              >
                Email
              </label>
              <div className="group flex h-[54px] items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.08] px-4 transition-all focus-within:border-[#F2B84B]/75 focus-within:bg-white/[0.1] focus-within:ring-2 focus-within:ring-[#F2B84B]/20">
                <Mail className="h-4 w-4 shrink-0 text-[#A99EA6] transition-colors group-focus-within:text-[#F2B84B]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-transparent text-sm text-[#F8F4EF] outline-none placeholder:text-[#F8F4EF]/42"
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
                6 digit angka rahasia.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative mt-1 flex h-[56px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#B80F1E] via-[#E94B3C] to-[#F2B84B] text-sm font-bold text-white shadow-[0_12px_34px_rgba(230,57,70,0.3)] transition-all hover:-translate-y-px hover:brightness-[1.06] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
          >
            {/* top highlight */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
            {loading ? (
              <Loader2 className="relative h-5 w-5 animate-spin" />
            ) : (
              <>
                <span className="relative">Masuk</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="relative mt-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/12" />
          <Sparkles className="h-3.5 w-3.5 text-[#F2B84B]/55" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/12" />
        </div>

        <p className="relative mt-5 text-center text-sm text-[#A99EA6]">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#F2B84B] transition-opacity hover:opacity-80"
          >
            Buat akun baru
          </Link>
        </p>
      </div>
    </section>
  );
}

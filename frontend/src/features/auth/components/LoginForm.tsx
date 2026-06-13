"use client";

import Link from "next/link";
import { ArrowRight, Gem, Loader2, Mail, Sparkles } from "lucide-react";
import { InputField } from "./InputField";
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
 * LoginForm - Right-side login form with branded header.
 * Uses email + 6-digit PIN (PIN-as-password Supabase).
 * Card uses glass-morphism so 3D background shows through.
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
    <section className="mx-auto w-full max-w-md animate-fade-in-up">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/35 bg-white/30 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D9A441]/65 to-transparent" />
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#D9A441]/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#E63946]/15 blur-3xl" />
        <div className="relative text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-[#FFF4D8] via-[#E86A76] to-[#9D0208] shadow-[0_16px_36px_rgba(157,2,8,0.20)]">
            <Gem className="h-7 w-7 text-white" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#D9A441]/85">
            Private access
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
            Selamat datang kembali
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
            Masuk ke ruang kerja personalmu dengan tenang.
          </p>
        </div>

        <form className="relative mt-8 space-y-5" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-2xl border border-[#E63946]/40 bg-[#E63946]/15 px-4 py-3 text-sm text-white shadow-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <InputField
              id="email"
              label="Email"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              placeholder="email@domain.com"
              value={email}
              onChange={setEmail}
            />
            <div className="space-y-2">
              <PinInput
                id="pin"
                label="PIN"
                value={pin}
                onChange={setPin}
                error={pinInvalid}
                autoFocus={false}
                disabled={loading}
              />
              <p className="text-[11px] font-medium text-white/70 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
                6 digit angka rahasia.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#9D0208] via-[#E63946] to-[#D9A441] px-4 py-3.5 text-sm font-bold text-white shadow-[0_16px_36px_rgba(157,2,8,0.20)] transition-all hover:scale-[1.01] hover:shadow-[0_20px_46px_rgba(157,2,8,0.26)] disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:scale-100"
          >
            <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
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
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/40" />
          <Sparkles className="h-4 w-4 text-[#D9A441]/70" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/40" />
        </div>

        <p className="relative mt-5 text-center text-sm text-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-bold text-[#FFCAD4] transition-colors hover:text-white"
          >
            Buat akun baru
          </Link>
        </p>
      </div>
    </section>
  );
}

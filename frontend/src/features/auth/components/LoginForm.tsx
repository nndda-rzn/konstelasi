"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { PinInput } from "./PinInput";
import { BrandMark } from "./BrandMark";
import { BRAND } from "../lib/brand";

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
 * LoginForm - Private writing studio sign-in.
 * Left-aligned, editorial, mature — not a template.
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
    <section className="relative mx-auto w-full max-w-[440px]">
      <div className="relative rounded-[28px] border border-white/[0.08] bg-[#0E0C16]/80 p-9 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-10">
        {/* subtle inner top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative">
          {/* brand row — small, left-aligned */}
          <div className="flex items-center gap-3 text-[#C9C0C5]">
            <BrandMark size={28} />
            <span className="text-[15px] font-medium tracking-tight text-[#F8F4EF]/90">
              {BRAND}
            </span>
          </div>

          {/* heading block — left-aligned, editorial */}
          <div className="mt-9">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9BFC4]">
              Private access
            </p>
            <h2 className="mt-2.5 text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] text-[#F8F4EF]">
              Welcome back
            </h2>
            <p className="mt-2.5 text-[15px] leading-6 text-[#AFA6AD]">
              Continue where your thoughts left off.
            </p>
          </div>
        </div>

        {/* form — left-aligned */}
        <form className="relative mt-8 space-y-5" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-xl border border-[#E63946]/30 bg-[#E63946]/10 px-4 py-3 text-[13px] text-[#F8D7DA]">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#8C8088]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block h-[50px] w-full rounded-[14px] border border-white/10 bg-white/[0.055] px-4 text-sm text-[#F8F4EF] outline-none transition-all placeholder:text-[#F8F4EF]/35 focus:border-[#F2B84B]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#F2B84B]/15"
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
              <p className="mt-1.5 text-[11px] text-[#7F747C]">
                Use your 6-digit access code.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative mt-1 flex h-[52px] w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#B8202E] text-sm font-semibold text-[#FFF6F0] shadow-[0_6px_20px_rgba(184,32,46,0.22)] transition-all hover:bg-[#C73534] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(184,32,46,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.16]" />
            {loading ? (
              <Loader2 className="relative h-4 w-4 animate-spin" />
            ) : (
              <span className="relative">Sign in</span>
            )}
          </button>
        </form>

        {/* footer */}
        <p className="relative mt-6 text-center text-[13px] text-[#8C8088]">
          New to {BRAND}?{" "}
          <Link
            href="/register"
            className="text-[#C9BFC4] underline underline-offset-2 decoration-white/20 transition-colors hover:text-[#F8F4EF] hover:decoration-white/40"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { PinInput } from "@/features/auth/components/PinInput";
import { AuthBackground } from "@/features/auth/components/scene/AuthBackground";
import { BrandMark } from "@/features/auth/components/BrandMark";
import { BRAND } from "@/features/auth/lib/brand";

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

      <div className="relative z-20 w-full max-w-[440px]">
        <div className="relative rounded-[28px] border border-white/[0.08] bg-[#0E0C16]/80 p-9 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-3 text-[#C9C0C5]">
              <BrandMark size={28} />
              <span className="text-[15px] font-medium tracking-tight text-[#F8F4EF]/90">
                {BRAND}
              </span>
            </div>

            <div className="mt-9">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9BFC4]">
                Create account
              </p>
              <h2 className="mt-2.5 text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] text-[#F8F4EF]">
                Start your space
              </h2>
              <p className="mt-2.5 text-[15px] leading-6 text-[#AFA6AD]">
                A calm, personal workspace for your writing.
              </p>
            </div>
          </div>

          <form className="relative mt-8 space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="rounded-xl border border-[#E63946]/30 bg-[#E63946]/10 px-4 py-3 text-[13px] text-[#F8D7DA]">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-100">
                {success}
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
                  id="register-pin"
                  label="PIN"
                  value={pin}
                  onChange={setPin}
                  disabled={loading}
                />
                <p className="mt-1.5 text-[11px] text-[#7F747C]">
                  Use your 6-digit access code.
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
                  <p className="mt-1.5 text-[11px] text-[#E94B3C]">
                    PINs do not match.
                  </p>
                )}
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
                <span className="relative">Create account</span>
              )}
            </button>
          </form>

          <p className="relative mt-6 text-center text-[13px] text-[#8C8088]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#C9BFC4] underline underline-offset-2 decoration-white/20 transition-colors hover:text-[#F8F4EF] hover:decoration-white/40"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { PinInput } from "@/features/auth/components/PinInput";
import { AuthBackground } from "@/features/auth/components/scene/AuthBackground";

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
      setError("PIN harus 6 digit angka");
      return;
    }

    if (pin !== confirmPin) {
      setError("PIN tidak cocok");
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

    setSuccess("Pendaftaran berhasil! Cek email kamu untuk verifikasi.");
    setLoading(false);
  };

  const pinMismatch = Boolean(confirmPin) && pin !== confirmPin;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070812] px-5 py-10 text-white sm:px-8">
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
        <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-[rgba(14,12,22,0.78)] p-9 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#F2B84B]/8 blur-[80px]" />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#E94B3C] via-[#D99A2B] to-[#F2B84B] shadow-[0_10px_30px_rgba(230,57,70,0.28)]">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#F2B84B]/85">
              Buat akun
            </p>
            <h2 className="mt-2.5 text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#F8F4EF]">
              Mulai perjalananmu
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#A99EA6]">
              Diary visual node-based yang tetap personal.
            </p>
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
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A99EA6]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block h-[54px] w-full rounded-2xl border border-white/12 bg-white/[0.08] px-4 text-sm text-[#F8F4EF] outline-none transition-all placeholder:text-[#F8F4EF]/42 focus:border-[#F2B84B]/75 focus:bg-white/[0.1] focus:ring-2 focus:ring-[#F2B84B]/20"
                  placeholder="email@domain.com"
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
                  6 digit angka rahasia.
                </p>
              </div>

              <div>
                <PinInput
                  id="register-confirm-pin"
                  label="Konfirmasi PIN"
                  value={confirmPin}
                  onChange={setConfirmPin}
                  error={pinMismatch}
                  disabled={loading}
                />
                {pinMismatch && (
                  <p className="mt-2 text-[11px] font-medium text-[#E94B3C]">
                    PIN tidak cocok
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-1 flex h-[56px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#B80F1E] via-[#E94B3C] to-[#F2B84B] text-sm font-bold text-white shadow-[0_10px_30px_rgba(230,57,70,0.25)] transition-all hover:-translate-y-px hover:brightness-[1.06] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Buat Akun"}
            </button>
          </form>

          <div className="relative mt-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/12" />
            <Sparkles className="h-3.5 w-3.5 text-[#F2B84B]/55" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/12" />
          </div>

          <p className="relative mt-5 text-center text-sm text-[#A99EA6]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#F2B84B] transition-opacity hover:opacity-80"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

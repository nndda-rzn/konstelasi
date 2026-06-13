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
    <div className="flex min-h-screen items-center justify-center bg-[#2A0A14] relative overflow-hidden text-white">
      <AuthBackground />

      {/* ── Animated background orbs ── */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#FFCAD4]/15 blur-[100px] animate-orb-1" />
      <div className="absolute bottom-1/3 -left-32 w-80 h-80 rounded-full bg-[#FFB4A2]/15 blur-[100px] animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#E63946]/8 blur-[150px]" />

      {/* ── Card ── */}
      <div className="relative w-full max-w-md space-y-8 rounded-2xl bg-white/20 border border-white/30 p-10 shadow-2xl shadow-black/30 backdrop-blur-2xl animate-fade-in-up z-10">
        {/* Accent line on top */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#D9A441]/65 to-transparent" />

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-300/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">Buat Akun</h2>
          <p className="mt-2 text-sm text-white/70 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
            Mulai perjalanan Diary Visual Node-Based-mu
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          {error && (
            <div className="rounded-xl bg-[#E63946]/15 border border-[#E63946]/40 p-3.5 text-sm text-white">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/40 p-3.5 text-sm text-emerald-100">
              {success}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-white/65 uppercase tracking-wider mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full bg-white/85 border border-white/40 rounded-xl px-4 py-3 text-[#3F2A35] placeholder-[#5A3E4C]/40 focus:outline-none focus:ring-2 focus:ring-[#D9A441]/45 focus:border-[#D9A441]/50 transition-all text-sm"
                placeholder="alamat@email.com"
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
              <p className="mt-1.5 text-[11px] font-medium text-white/70 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
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
                <p className="mt-1.5 text-[11px] font-medium text-[#FFCAD4]">
                  PIN tidak cocok
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] px-4 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-pink-300/30 hover:shadow-pink-300/50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Buat Akun"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-white/70 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-[#FFCAD4] hover:text-white transition-colors"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

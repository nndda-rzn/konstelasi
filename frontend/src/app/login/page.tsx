"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowRight,
  Gem,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  Star,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/canvas");
      router.refresh();
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#FFF1E8_0%,transparent_34%),radial-gradient(circle_at_top_right,#F2E8FF_0%,transparent_30%),linear-gradient(135deg,#FFF8F4_0%,#FFE5E8_46%,#F8F1FF_100%)] px-5 py-8 text-[#3F2A35] sm:px-8">
      <div className="absolute -top-36 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-[#E63946]/12 blur-[140px] animate-orb-1" />
      <div className="absolute bottom-[-190px] left-[-130px] h-[430px] w-[430px] rounded-full bg-[#D9A441]/16 blur-[120px] animate-orb-2" />
      <div className="absolute right-[-150px] top-1/4 h-[470px] w-[470px] rounded-full bg-[#7C83FD]/14 blur-[130px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="relative rounded-[2rem] border border-white/55 bg-white/38 p-8 shadow-[0_28px_90px_rgba(84,45,55,0.14)] backdrop-blur-2xl">
            <div className="absolute -right-5 -top-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#D9A441] via-[#E86A76] to-[#9D0208] text-white shadow-[0_18px_44px_rgba(157,2,8,0.22)] animate-float">
              <Gem className="h-7 w-7" />
            </div>

            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#E6B8A2]/45 bg-white/62 px-3 py-1.5 text-xs font-semibold text-[#9D0208] shadow-sm">
              <Star className="h-3.5 w-3.5" />
              Private writing studio
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-[1.03] tracking-[-0.04em] text-[#3F2A35]">
              Ruang pribadi untuk merangkai cerita dengan tenang.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#5A3E4C]/62">
              Lanjutkan catatan, story, dan time capsule dalam tampilan yang
              lembut, rapi, dan tetap personal.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="ml-8 max-w-sm rounded-[1.6rem] border border-[#E6B8A2]/35 bg-white/75 p-4 shadow-[0_16px_42px_rgba(84,45,55,0.10)] backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#9D0208]">
                  <Gem className="h-4 w-4" />
                  Studio focus
                </div>
                <p className="text-sm leading-6 text-[#5A3E4C]/70">
                  Tempat masuk yang terasa ringan, namun tetap matang untuk
                  menulis hal personal.
                </p>
              </div>

              <div className="max-w-md rounded-[1.8rem] border border-white/55 bg-gradient-to-br from-white/88 via-[#FFF4EC]/75 to-[#FFE5E8]/62 p-5 shadow-[0_18px_52px_rgba(157,2,8,0.12)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9D0208]/68">
                    Konstelasi
                  </span>
                  <span className="rounded-full bg-[#9D0208]/8 px-2.5 py-1 text-[10px] font-bold text-[#9D0208]">
                    Private
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[#B8860B] shadow-[0_0_18px_rgba(184,134,11,0.45)]" />
                  <div className="h-px flex-1 bg-gradient-to-r from-[#B8860B]/45 to-[#FFB8C0]/10" />
                  <div className="h-4 w-4 rounded-full bg-[#7C83FD] shadow-[0_0_18px_rgba(124,131,253,0.45)]" />
                  <div className="h-px flex-1 bg-gradient-to-r from-[#7C83FD]/35 to-[#E63946]/24" />
                  <div className="h-3 w-3 rounded-full bg-[#E63946] shadow-[0_0_18px_rgba(230,57,70,0.45)]" />
                </div>
                <div className="mt-5 flex gap-2 text-[10px] font-semibold text-[#5A3E4C]/48">
                  <span className="rounded-full border border-[#E6B8A2]/40 bg-white/50 px-2.5 py-1">
                    Notes
                  </span>
                  <span className="rounded-full border border-[#E6B8A2]/40 bg-white/50 px-2.5 py-1">
                    Stories
                  </span>
                  <span className="rounded-full border border-[#E6B8A2]/40 bg-white/50 px-2.5 py-1">
                    Capsule
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md animate-fade-in-up">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/65 bg-gradient-to-br from-white/92 via-white/72 to-[#FFF1E8]/58 p-6 shadow-[0_28px_90px_rgba(84,45,55,0.16)] backdrop-blur-2xl sm:p-8">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#B8860B]/55 to-transparent" />
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#D9A441]/18 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#E7DCFF]/38 blur-3xl" />

            <div className="relative text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-[#FFF4D8] via-[#E86A76] to-[#9D0208] shadow-[0_16px_36px_rgba(157,2,8,0.20)]">
                <Gem className="h-7 w-7 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#9D0208]/62">
                Private access
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-candy">
                Selamat datang kembali
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#5A3E4C]/55">
                Masuk ke ruang kerja personalmu dengan tenang.
              </p>
            </div>

            <form className="relative mt-8 space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="rounded-2xl border border-[#E63946]/20 bg-[#E63946]/8 px-4 py-3 text-sm text-[#C1121F] shadow-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-[#5A3E4C]/45"
                  >
                    Email
                  </label>
                  <div className="group flex items-center gap-3 rounded-2xl border border-[#E6B8A2]/35 bg-white/68 px-4 py-3 shadow-inner transition-all hover:bg-white/85 focus-within:border-[#9D0208]/35 focus-within:ring-4 focus-within:ring-[#E6B8A2]/22">
                    <Mail className="h-4 w-4 text-[#9D0208]/48 transition-colors group-focus-within:text-[#9D0208]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full bg-transparent text-sm text-[#4A2F3C] outline-none placeholder:text-[#5A3E4C]/28"
                      placeholder="email@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-[#5A3E4C]/45"
                  >
                    Password
                  </label>
                  <div className="group flex items-center gap-3 rounded-2xl border border-[#E6B8A2]/35 bg-white/68 px-4 py-3 shadow-inner transition-all hover:bg-white/85 focus-within:border-[#9D0208]/35 focus-within:ring-4 focus-within:ring-[#E6B8A2]/22">
                    <Lock className="h-4 w-4 text-[#9D0208]/48 transition-colors group-focus-within:text-[#9D0208]" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full bg-transparent text-sm text-[#4A2F3C] outline-none placeholder:text-[#5A3E4C]/28"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
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
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E6B8A2]/65" />
              <Sparkles className="h-4 w-4 text-[#9D0208]/38" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E6B8A2]/65" />
            </div>

            <p className="relative mt-5 text-center text-sm text-[#5A3E4C]/55">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-bold text-[#E63946] transition-colors hover:text-[#9D0208]"
              >
                Buat akun baru
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      router.push('/canvas');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFAF7] relative overflow-hidden">
      {/* ── Animated background orbs ── */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-pink-300/20 blur-[100px] animate-orb-1" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[#FFB4A2]/20 blur-[100px] animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFCAD4]/10 blur-[150px]" />
      
      {/* ── Card ── */}
      <div className="relative w-full max-w-md space-y-8 rounded-2xl bg-white/80 border border-[#FFB4A2]/25 p-10 shadow-2xl shadow-pink-200/30 backdrop-blur-xl animate-fade-in-up z-10">
        {/* Accent line on top */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF8FA3]/50 to-transparent" />
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-300/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#4A2F3C]">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-[#5A3E4C]/50">
            Sign in to your Visual Node-Based Diary
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-xl bg-[#FF6B9D]/10 border border-[#FF6B9D]/20 p-3.5 text-sm text-[#FF6B9D]">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#5A3E4C]/50 uppercase tracking-wider mb-1.5">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl px-4 py-3 text-[#5A3E4C] placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all text-sm hover:bg-white/80"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#5A3E4C]/50 uppercase tracking-wider mb-1.5">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl px-4 py-3 text-[#5A3E4C] placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all text-sm hover:bg-white/80"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] px-4 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-pink-300/30 hover:shadow-pink-300/50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#5A3E4C]/50">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-[#FF8FA3] hover:text-[#FF7A8A] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

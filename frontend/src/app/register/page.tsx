'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Loader2, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      if (data.session) {
        router.push('/canvas');
        router.refresh();
      } else {
        setSuccess('Registration successful! Check your email for verification link.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f14] relative overflow-hidden">
      {/* ── Animated background orbs ── */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-rose-600/10 blur-[100px] animate-orb-1" />
      <div className="absolute bottom-1/3 -left-32 w-80 h-80 rounded-full bg-red-600/8 blur-[100px] animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-900/5 blur-[150px]" />
      
      {/* ── Card ── */}
      <div className="relative w-full max-w-md space-y-8 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-10 shadow-2xl shadow-black/30 backdrop-blur-xl animate-fade-in-up z-10">
        {/* Red accent line on top */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-white/30">
            Start your Visual Node-Based Diary journey
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-sm text-emerald-300">
              {success}
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all text-sm hover:bg-white/[0.06]"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all text-sm hover:bg-white/[0.06]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-4 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/30 hover:shadow-red-900/50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-white/30">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-red-400 hover:text-red-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

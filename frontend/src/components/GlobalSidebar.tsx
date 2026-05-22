'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid, BookOpen, Image as ImageIcon,
  Camera, LogOut, Moon, Sun, Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/context/ThemeContext';

const NAV_ITEMS = [
  { href: '/canvas',     label: 'Canvas',      icon: LayoutGrid },
  { href: '/story',      label: 'Stories',     icon: BookOpen   },
  { href: '/gallery',    label: 'Gallery',     icon: ImageIcon  },
  { href: '/photobooth', label: 'Photo Booth', icon: Camera     },
];

export default function GlobalSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isActive = (href: string) =>
    href === '/canvas'
      ? pathname === '/canvas' || pathname === '/'
      : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop Floating Sidebar ── */}
      <aside className="fixed left-4 top-4 bottom-4 z-40 hidden md:flex w-[220px] flex-col rounded-3xl border border-white/50 dark:border-[#E63946]/10 bg-white/72 dark:bg-[#1a1625]/72 backdrop-blur-2xl shadow-[0_8px_40px_rgba(84,45,55,0.12)] overflow-hidden">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E63946]/40 to-transparent" />

        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B7A] to-[#9D0208] shadow-[0_4px_16px_rgba(157,2,8,0.28)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black tracking-[-0.03em] text-[#3F2A35] dark:text-[#e2d9f3]">Konstelasi</p>
              <p className="text-[10px] text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35">Visual Diary</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[#E6B8A2]/35 to-transparent" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-[#9D0208]/10 to-[#E63946]/6 border border-[#E63946]/18 shadow-sm'
                    : 'border border-transparent hover:bg-white/55 dark:hover:bg-white/5'
                }`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-br from-[#E63946] to-[#9D0208] shadow-[0_4px_12px_rgba(157,2,8,0.22)]'
                    : 'bg-[#FFE5E8]/55 dark:bg-white/8 group-hover:bg-[#FFE5E8] dark:group-hover:bg-white/12'
                }`}>
                  <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-[#9D0208]/65 dark:text-[#e2d9f3]/50'}`} />
                </div>
                <span className={`text-sm font-semibold truncate ${
                  active ? 'text-[#9D0208] dark:text-[#FF6B7A]' : 'text-[#3F2A35]/75 dark:text-[#e2d9f3]/65'
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 space-y-1">
          <div className="mx-1 mb-2 h-px bg-gradient-to-r from-transparent via-[#E6B8A2]/30 to-transparent" />
          <button onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-2xl border border-transparent hover:bg-white/55 dark:hover:bg-white/5 transition-all">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFE5E8]/55 dark:bg-white/8">
              {theme === 'light'
                ? <Moon className="h-4 w-4 text-[#9D0208]/65" />
                : <Sun className="h-4 w-4 text-[#e2d9f3]/50" />}
            </div>
            <span className="text-sm font-semibold text-[#3F2A35]/70 dark:text-[#e2d9f3]/60">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-2xl border border-transparent hover:bg-red-50/60 dark:hover:bg-red-900/10 transition-all group">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFE5E8]/55 dark:bg-white/8 group-hover:bg-red-100/70 dark:group-hover:bg-red-900/20">
              <LogOut className="h-4 w-4 text-[#9D0208]/65 group-hover:text-red-500 transition-colors" />
            </div>
            <span className="text-sm font-semibold text-[#3F2A35]/70 dark:text-[#e2d9f3]/60 group-hover:text-red-500 transition-colors">
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around border-t border-[#E6B8A2]/20 bg-white/88 dark:bg-[#1a1625]/88 backdrop-blur-2xl px-2 pt-2 pb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${
                active ? 'text-[#E63946]' : 'text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35'
              }`}>
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-bold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

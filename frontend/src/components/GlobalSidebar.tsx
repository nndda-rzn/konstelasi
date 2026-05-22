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
  { href: '/canvas',     label: 'Canvas',      desc: 'Ruang utama',     icon: LayoutGrid },
  { href: '/story',      label: 'Stories',     desc: 'Kumpulan cerita', icon: BookOpen   },
  { href: '/gallery',    label: 'Gallery',     desc: 'Koleksi foto',    icon: ImageIcon  },
  { href: '/photobooth', label: 'Photo Booth', desc: 'Ambil momen',     icon: Camera     },
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
      <aside className="fixed left-3 top-3 bottom-3 z-40 hidden md:flex w-[220px] flex-col rounded-2xl border border-white/70 dark:border-white/10 bg-white/75 dark:bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(230,57,70,0.08),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">

        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-candy-accent-line" />

        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none dark:from-white/5" />

        {/* Brand */}
        <div className="relative px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 shrink-0 text-[#E63946]" />
            <div>
              <p className="text-sm font-black tracking-[-0.02em] text-candy">Konstelasi</p>
              <p className="text-[10px] text-[#5A3E4C]/60 dark:text-[#e2d9f3]/45 mt-0.5">Visual Diary</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mx-4 h-px bg-gradient-to-r from-transparent via-[#FFB8C0]/40 to-transparent dark:via-[#E63946]/15" />

        {/* Navigation */}
        <nav className="relative flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, desc, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group overflow-hidden ${
                  active
                    ? 'bg-white/80 dark:bg-white/10 shadow-[0_1px_8px_rgba(230,57,70,0.10)]'
                    : 'hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                {/* Active left indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#E63946]" />
                )}

                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                    active
                      ? 'text-[#E63946]'
                      : 'text-[#5A3E4C]/55 dark:text-[#e2d9f3]/40 group-hover:text-[#E63946]/70'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <span className={`text-[13px] transition-colors duration-150 block leading-tight ${
                    active
                      ? 'font-semibold text-[#E63946] dark:text-[#FF6B7A]'
                      : 'font-medium text-[#4A2F3C]/80 dark:text-[#e2d9f3]/60 group-hover:text-[#4A2F3C] dark:group-hover:text-[#e2d9f3]/80'
                  }`}>
                    {label}
                  </span>
                  <span className="text-[10px] text-[#5A3E4C]/55 dark:text-[#e2d9f3]/35 block mt-0.5 leading-none">
                    {desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative px-2.5 pb-4 space-y-0.5">
          <div className="mx-2 mb-2 h-px bg-gradient-to-r from-transparent via-[#FFB8C0]/40 to-transparent dark:via-[#E63946]/15" />

          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-all group"
          >
            {theme === 'light'
              ? <Moon className="h-4 w-4 shrink-0 text-[#5A3E4C]/55 group-hover:text-[#E63946]/70 transition-colors" />
              : <Sun  className="h-4 w-4 shrink-0 text-[#e2d9f3]/45 group-hover:text-[#E63946]/70 transition-colors" />
            }
            <span className="text-[13px] font-medium text-[#4A2F3C]/75 dark:text-[#e2d9f3]/55 group-hover:text-[#4A2F3C] dark:group-hover:text-[#e2d9f3]/80 transition-colors">
              {theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-all group"
          >
            <LogOut className="h-4 w-4 shrink-0 text-[#5A3E4C]/55 dark:text-[#e2d9f3]/40 group-hover:text-[#E63946]/70 transition-colors" />
            <span className="text-[13px] font-medium text-[#4A2F3C]/75 dark:text-[#e2d9f3]/55 group-hover:text-[#4A2F3C] dark:group-hover:text-[#e2d9f3]/80 transition-colors">
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around border-t border-white/60 dark:border-white/10 bg-white/80 dark:bg-[#1a1625]/80 backdrop-blur-2xl px-2 pt-2 pb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                active ? 'text-[#E63946]' : 'text-[#5A3E4C]/65 dark:text-[#e2d9f3]/45'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-bold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

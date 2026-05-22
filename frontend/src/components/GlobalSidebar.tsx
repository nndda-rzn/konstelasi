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
      <aside className="fixed left-3 top-3 bottom-3 z-40 hidden md:flex w-[220px] flex-col rounded-2xl border border-[#FFB8C0]/20 dark:border-[#E63946]/10 bg-white/80 dark:bg-[#2a2438]/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(230,57,70,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden">

        {/* Top accent line — pakai utility yang sudah ada */}
        <div className="absolute inset-x-0 top-0 h-px bg-candy-accent-line" />

        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 shrink-0 text-[#E63946]" />
            <div>
              <p className="text-sm font-black tracking-[-0.02em] text-candy">Konstelasi</p>
              <p className="text-[10px] text-[#5A3E4C]/45 dark:text-[#e2d9f3]/30 mt-0.5">Visual Diary</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-[#FFB8C0]/20 dark:bg-[#E63946]/10" />

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group overflow-hidden ${
                  active
                    ? 'bg-[#E63946]/6 dark:bg-[#E63946]/10'
                    : 'hover:bg-[#FFB8C0]/10 dark:hover:bg-[#E63946]/5'
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
                      : 'text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25 group-hover:text-[#E63946]/60 dark:group-hover:text-[#E63946]/50'
                  }`}
                />
                <span
                  className={`text-[13px] transition-colors duration-150 ${
                    active
                      ? 'font-semibold text-[#E63946] dark:text-[#FF6B7A]'
                      : 'font-medium text-[#5A3E4C]/55 dark:text-[#e2d9f3]/40 group-hover:text-[#4A2F3C] dark:group-hover:text-[#e2d9f3]/70'
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-2.5 pb-4 space-y-0.5">
          <div className="mx-2 mb-2 h-px bg-[#FFB8C0]/20 dark:bg-[#E63946]/10" />

          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFB8C0]/10 dark:hover:bg-[#E63946]/5 transition-all group"
          >
            {theme === 'light'
              ? <Moon className="h-4 w-4 shrink-0 text-[#5A3E4C]/35 group-hover:text-[#E63946]/60 transition-colors" />
              : <Sun  className="h-4 w-4 shrink-0 text-[#e2d9f3]/25 group-hover:text-[#E63946]/50 transition-colors" />
            }
            <span className="text-[13px] font-medium text-[#5A3E4C]/55 dark:text-[#e2d9f3]/40 group-hover:text-[#4A2F3C] dark:group-hover:text-[#e2d9f3]/70 transition-colors">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFB8C0]/10 dark:hover:bg-[#E63946]/5 transition-all group"
          >
            <LogOut className="h-4 w-4 shrink-0 text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25 group-hover:text-[#E63946]/60 dark:group-hover:text-[#E63946]/50 transition-colors" />
            <span className="text-[13px] font-medium text-[#5A3E4C]/55 dark:text-[#e2d9f3]/40 group-hover:text-[#4A2F3C] dark:group-hover:text-[#e2d9f3]/70 transition-colors">
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around border-t border-[#FFB8C0]/20 dark:border-[#E63946]/10 bg-white/88 dark:bg-[#2a2438]/88 backdrop-blur-2xl px-2 pt-2 pb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                active
                  ? 'text-[#E63946]'
                  : 'text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30'
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

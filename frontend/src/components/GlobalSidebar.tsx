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
      <aside className="fixed left-3 top-3 bottom-3 z-40 hidden md:flex w-[220px] flex-col rounded-2xl border border-[#E8E4E0]/70 dark:border-white/[0.06] bg-[#FAFAF9]/96 dark:bg-[#1C1917]/96 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] overflow-hidden">

        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-[18px] w-[18px] shrink-0 text-[#C9A96E] dark:text-[#D9B979]" />
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#2D2420] dark:text-[#F0EBE5]">
                Konstelasi
              </p>
              <p className="text-[10px] text-[#A89E98] dark:text-[#4A4440] mt-0.5">Visual Diary</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-[#EAE6E2] dark:bg-white/[0.06]" />

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  active
                    ? 'bg-white dark:bg-white/[0.07] shadow-[0_1px_6px_rgba(0,0,0,0.07)] dark:shadow-none'
                    : 'hover:bg-[#F4F1EE]/80 dark:hover:bg-white/[0.04]'
                }`}
              >
                <Icon
                  className={`h-[15px] w-[15px] shrink-0 transition-colors duration-150 ${
                    active
                      ? 'text-[#C9A96E] dark:text-[#D9B979]'
                      : 'text-[#C0B8B2] dark:text-[#3A3430] group-hover:text-[#8A7E78] dark:group-hover:text-[#5A5450]'
                  }`}
                />
                <span
                  className={`text-[13px] transition-colors duration-150 ${
                    active
                      ? 'font-semibold text-[#2D2420] dark:text-[#F0EBE5]'
                      : 'font-medium text-[#A89E98] dark:text-[#3A3430] group-hover:text-[#5A4E48] dark:group-hover:text-[#6A6460]'
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
          <div className="mx-2 mb-2 h-px bg-[#EAE6E2] dark:bg-white/[0.06]" />

          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F1EE]/80 dark:hover:bg-white/[0.04] transition-all group"
          >
            {theme === 'light'
              ? <Moon className="h-[15px] w-[15px] shrink-0 text-[#C0B8B2] group-hover:text-[#8A7E78] transition-colors" />
              : <Sun  className="h-[15px] w-[15px] shrink-0 text-[#3A3430] group-hover:text-[#5A5450] transition-colors" />
            }
            <span className="text-[13px] font-medium text-[#A89E98] dark:text-[#3A3430] group-hover:text-[#5A4E48] dark:group-hover:text-[#6A6460] transition-colors">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F1EE]/80 dark:hover:bg-white/[0.04] transition-all group"
          >
            <LogOut className="h-[15px] w-[15px] shrink-0 text-[#C0B8B2] dark:text-[#3A3430] group-hover:text-[#C9A96E] dark:group-hover:text-[#D9B979] transition-colors" />
            <span className="text-[13px] font-medium text-[#A89E98] dark:text-[#3A3430] group-hover:text-[#5A4E48] dark:group-hover:text-[#6A6460] transition-colors">
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around border-t border-[#EAE6E2] dark:border-white/[0.06] bg-[#FAFAF9]/96 dark:bg-[#1C1917]/96 backdrop-blur-xl px-2 pt-2 pb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                active
                  ? 'text-[#C9A96E] dark:text-[#D9B979]'
                  : 'text-[#C0B8B2] dark:text-[#3A3430]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

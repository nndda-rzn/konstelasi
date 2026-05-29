"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  BookOpen,
  Image as ImageIcon,
  Camera,
  LogOut,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/canvas", label: "Canvas", desc: "Ruang utama", icon: LayoutGrid },
  { href: "/story", label: "Stories", desc: "Kumpulan cerita", icon: BookOpen },
  { href: "/gallery", label: "Gallery", desc: "Koleksi foto", icon: ImageIcon },
  {
    href: "/photobooth",
    label: "Photo Booth",
    desc: "Ambil momen",
    icon: Camera,
  },
];

export default function GlobalSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/canvas"
      ? pathname === "/canvas" || pathname === "/"
      : pathname.startsWith(href);

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <aside className="fixed left-3 top-3 bottom-3 z-40 hidden md:flex w-[220px] flex-col rounded-2xl border border-[#FFB8C0]/25 bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(230,57,70,0.08),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-candy-accent-line" />

        {/* Brand */}
        <div className="relative px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 shrink-0 text-[#E63946]" />
            <div>
              <p className="text-sm font-black tracking-[-0.02em] text-candy">
                Konstelasi
              </p>
              <p className="text-[10px] text-[#8C7783] mt-0.5">Visual Diary</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mx-4 h-px bg-gradient-to-r from-transparent via-[#FFB8C0]/50 to-transparent" />

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
                    ? "bg-white shadow-[0_1px_8px_rgba(230,57,70,0.10)]"
                    : "hover:bg-[#FFF5F5]/80"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#E63946]" />
                )}
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                    active
                      ? "text-[#E63946]"
                      : "text-[#8C7783] group-hover:text-[#E63946]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-[13px] transition-colors duration-150 block leading-tight ${
                      active
                        ? "font-semibold text-[#E63946]"
                        : "font-medium text-[#6D5561] group-hover:text-[#3F2A35]"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-[10px] block mt-0.5 leading-none ${
                      active ? "text-[#E63946]/60" : "text-[#A8949C]"
                    }`}
                  >
                    {desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative px-2.5 pb-4">
          <div className="mx-2 mb-2 h-px bg-gradient-to-r from-transparent via-[#FFB8C0]/50 to-transparent" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF5F5]/80 transition-all group"
          >
            <LogOut className="h-4 w-4 shrink-0 text-[#8C7783] group-hover:text-[#E63946] transition-colors" />
            <span className="text-[13px] font-medium text-[#6D5561] group-hover:text-[#3F2A35] transition-colors">
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around border-t border-[#FFB8C0]/25 bg-white/90 backdrop-blur-2xl px-2 pt-2 pb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                active ? "text-[#E63946]" : "text-[#8C7783]"
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

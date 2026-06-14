"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  BookOpen,
  Image as ImageIcon,
  Camera,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/features/auth/components/BrandMark";

const NAV_ITEMS = [
  { href: "/canvas", label: "Canvas", desc: "Main space", icon: LayoutGrid },
  { href: "/story", label: "Stories", desc: "Collected writing", icon: BookOpen },
  { href: "/gallery", label: "Gallery", desc: "Photo archive", icon: ImageIcon },
  {
    href: "/photobooth",
    label: "Photo Booth",
    desc: "Capture moments",
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
      {/* Desktop Sidebar */}
      <aside className="fixed left-3 top-3 bottom-3 z-40 hidden md:flex w-[260px] flex-col rounded-[20px] border border-[rgba(47,39,48,0.08)] bg-[#FFFCF8]/92 backdrop-blur-2xl shadow-[0_2px_20px_rgba(47,39,48,0.04)] overflow-hidden">
        {/* Brand */}
        <div className="relative px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <BrandMark size={26} />
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#2F2730]">
                Constella
              </p>
              <p className="text-[10px] font-medium tracking-[0.04em] text-[#9A8F95] mt-0.5">
                Private visual diary
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-4 h-px bg-[rgba(47,39,48,0.08)]" />

        {/* Navigation */}
        <nav className="relative flex-1 px-3 py-3 space-y-px overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, desc, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-colors duration-150 group ${
                  active
                    ? "bg-[#F3ECE4]"
                    : "hover:bg-[#F3ECE4]/60"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#B84A5A]" />
                )}
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors duration-150 ${
                    active
                      ? "text-[#B84A5A]"
                      : "text-[#9A8F95] group-hover:text-[#2F2730]"
                  }`}
                  strokeWidth={1.6}
                />
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-[13px] tracking-[-0.005em] block leading-tight ${
                      active
                        ? "font-semibold text-[#2F2730]"
                        : "font-medium text-[#6F626A] group-hover:text-[#2F2730]"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-[10.5px] block mt-0.5 leading-none font-normal ${
                      active ? "text-[#6F626A]" : "text-[#9A8F95]"
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
        <div className="relative px-3 pb-4">
          <div className="mx-2 mb-2 h-px bg-[rgba(47,39,48,0.08)]" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-[#F3ECE4]/60 transition-colors group"
          >
            <LogOut
              className="h-[18px] w-[18px] shrink-0 text-[#9A8F95] group-hover:text-[#2F2730] transition-colors"
              strokeWidth={1.6}
            />
            <span className="text-[13px] font-medium text-[#6F626A] group-hover:text-[#2F2730] transition-colors">
              Sign out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around border-t border-[rgba(47,39,48,0.08)] bg-[#FFFCF8]/95 backdrop-blur-2xl px-2 pt-2 pb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-[10px] transition-colors ${
                active ? "text-[#B84A5A]" : "text-[#9A8F95]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.6} />
              <span className="text-[9px] font-semibold tracking-wide uppercase">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

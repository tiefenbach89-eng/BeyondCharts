"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings2 } from "lucide-react";

type Item = { href: string; label: string; icon: React.ReactNode };

export function AdminNav() {
  const pathname = usePathname();

  const items: Item[] = [
    { href: "/admin", label: "Inhalte", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/admin/settings", label: "Einstellungen", icon: <Settings2 className="h-4 w-4" /> },
  ];

  return (
    <nav className="mt-6 flex gap-2 flex-wrap">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={
              "px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 border transition-all " +
              (active
                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300")
            }
          >
            {it.icon}
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

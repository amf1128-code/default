"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#d4a053" : "#52525b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Workout",
    href: "/workout",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#d4a053" : "#52525b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16" />
        <path d="M18 4v16" />
        <path d="M6 12h12" />
        <rect x="3" y="6" width="6" height="12" rx="1" />
        <rect x="15" y="6" width="6" height="12" rx="1" />
      </svg>
    ),
  },
  {
    label: "History",
    href: "/history",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#d4a053" : "#52525b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
      <div className="mx-auto max-w-[500px] flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 py-2 px-4 transition-colors"
            >
              {tab.icon(active)}
              <span
                className={`text-[0.65rem] font-semibold tracking-wide uppercase ${
                  active ? "text-gold" : "text-text-faint"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

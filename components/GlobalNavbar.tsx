"use client";

import { Map, HelpCircle, Gamepad2, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/weerkaart", icon: Map, label: "Kaart" },
    { href: "/spel", icon: Gamepad2, label: "Game" },
    { href: "/waarom", icon: HelpCircle, label: "Waarom?" },
  ];

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 h-24 rounded-[3rem] flex items-center shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] px-8 z-100 w-[90%] max-w-125">
      <div className="flex w-full justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button 
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? "text-white scale-110" : "text-white/40 hover:text-white"
                }`}
              >
                <item.icon size={32} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? "opacity-100" : "opacity-0"}`}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
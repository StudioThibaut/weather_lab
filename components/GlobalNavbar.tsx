"use client";

import { LayoutDashboard, TentTree, Joystick, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", icon: LayoutDashboard, label: "Start", color: "text-green-400" },
    { href: "/weerkaart", icon: TentTree, label: "Kaart", color: "text-yellow-400" },
    { href: "/spel", icon: Joystick, label: "Game", color: "text-pink-400" },
    { href: "/waarom", icon: Info, label: "Uitleg", color: "text-cyan-400" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1E40AF] h-24 rounded-[2.5rem] flex items-center border-4 border-[#1e3a8a] shadow-[0_12px_0_rgba(0,0,0,0.4)] px-6 z-100 w-[95%] max-w-md backdrop-blur-md bg-opacity-95">
      <div className="flex w-full justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative group">
              <div 
                className={`flex flex-col items-center justify-center transition-all duration-300 ease-out ${
                  isActive 
                    ? `-translate-y-3.5 scale-110` 
                    : "hover:-translate-y-1.25"
                }`}
              >
                {/* De Icon Container */}
                <div className={`
                  relative p-3 rounded-2xl transition-all duration-300
                  ${isActive ? `bg-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.3)]` : ""}
                `}>
                  <Icon 
                    size={isActive ? 34 : 28} 
                    /* De stroke-kleur zorgt ervoor dat details zichtbaar blijven in de fill */
                    stroke={isActive ? "currentColor" : "white"}
                    strokeWidth={2.5} 
                    fill={isActive ? "currentColor" : "none"}
                    className={`
                      ${isActive ? item.color : "text-blue-200/40 group-hover:text-white"}
                      transition-all duration-200
                      ${isActive ? "drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" : ""}
                    `}
                  />
                  {/* Extra overlay lijntjes voor de 'logische' details in actieve status */}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <Icon 
                        size={34} 
                        stroke="#1E40AF" 
                        strokeWidth={1.5} 
                        fill="none" 
                        className="opacity-80"
                       />
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <span className={`
                  text-[11px] font-black uppercase tracking-widest mt-1 italic transition-all duration-300
                  ${isActive ? `opacity-100 ${item.color} scale-100` : "opacity-0 scale-50 h-0"}
                `}>
                  {item.label}
                </span>

                {/* Actieve Indicator */}
                {isActive && (
                  <div className={`absolute -bottom-2 w-6 h-1.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]`} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
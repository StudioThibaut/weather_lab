"use client";

import { useState, useRef, TouchEvent } from "react";
import { X, Wind, CloudRain, Sun, AlertTriangle, Thermometer, ArrowRight } from "lucide-react";
import Image from "next/image";
import GlobalNavbar from "@/components/GlobalNavbar";

export default function IPadHomeClean() {
  const [view, setView] = useState<"home" | "detail">("home");
  const [rotation, setRotation] = useState(0);
  const [weather] = useState({ 
    temp: 6, wind: 12, condition: "Licht Bewolkt", chance: "12%", uv: 2, alert: "Code Geel" 
  });

  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX.current;
    setRotation((prev) => prev + deltaX * 0.7);
    startX.current = currentX;
  };

  return (
    <main 
      className="fixed inset-0 h-screen w-full bg-[#F1F5F9] overflow-hidden font-sans select-none text-slate-900 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => { isDragging.current = false; }}
    >
      {/* --- ACHTERGROND DYNAMIEK --- */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-400/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-400/10 blur-[150px] rounded-full pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="absolute top-6 left-6 md:top-12 md:left-12 z-30">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2 md:gap-3 bg-white/90 backdrop-blur-xl px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow-sm border border-white w-fit">
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-blue-600">Antwerpen • Nu</h2>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-900 mt-1 md:mt-2 drop-shadow-sm">
            {weather.temp}°
          </h1>
        </div>
      </header>

      {/* --- STATUS ZIJBALK --- */}
      <aside className={`absolute left-6 md:left-12 top-[65%] md:top-1/2 -translate-y-1/2 flex flex-row md:flex-col gap-4 md:gap-8 z-30 transition-all duration-1000 ease-out overflow-x-auto md:overflow-visible pb-4 md:pb-0 max-w-[calc(100%-3rem)] md:max-w-none ${
        view === "detail" ? "opacity-0 -translate-x-32" : "opacity-100 translate-x-0"
      }`}>
        {[
          { icon: Wind, val: `${weather.wind}`, col: "text-cyan-500", label: "WIND" },
          { icon: CloudRain, val: weather.chance, col: "text-indigo-500", label: "REGEN" },
          { icon: Sun, val: `UV ${weather.uv}`, col: "text-yellow-500", label: "ZON" },
          { icon: AlertTriangle, val: weather.alert, col: "text-orange-500", label: "STATUS" }
        ].map((item, i) => (
          <div key={i} className="group flex flex-col items-center gap-1 md:gap-3 min-w-17.5 md:min-w-0">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-white/80 backdrop-blur-2xl rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-lg md:shadow-2xl border border-white transition-transform group-hover:scale-110">
              <item.icon size={24} strokeWidth={2.5} className={item.col} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest">{item.label}</span>
              <span className="text-[10px] md:text-sm font-black text-slate-800 tracking-tight whitespace-nowrap">{item.val}</span>
            </div>
          </div>
        ))}
      </aside>

      {/* --- CENTRALE SECTIE --- */}
      <section className="relative h-full w-full flex items-center justify-center p-6 md:p-0">
        <div 
          onClick={() => setView("detail")}
          style={{ transform: `rotateY(${rotation}deg)`, perspective: '1200px' }}
          className={`transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) z-20 cursor-pointer relative ${
            view === "detail" 
              ? "-translate-y-40 md:translate-y-0 md:-translate-x-60 lg:-translate-x-80 scale-50 md:scale-75 lg:scale-90" 
              : "translate-x-0 scale-90 md:scale-100 hover:scale-105"
          }`}
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[60px] md:blur-[100px] rounded-full scale-75 animate-pulse" />
          <div className="relative w-[40vh] h-[40vh] md:w-[55vh] md:h-[55vh]">
            <Image src="/images/avatar.png" alt="Avatar" fill className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)]" priority />
          </div>
          <div className={`absolute -bottom-6 md:-bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-500 ${view === "detail" ? "opacity-0" : "opacity-100"}`}>
             <div className="bg-blue-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-xl whitespace-nowrap">
               Ontdek <ArrowRight size={14} />
             </div>
          </div>
        </div>

        {/* --- DETAIL KAART --- */}
        <div className={`absolute inset-x-4 md:inset-x-auto md:right-12 lg:right-24 bottom-24 md:top-1/2 md:-translate-y-1/2 transition-all duration-1000 ease-in-out max-w-2xl z-40 ${
          view === "detail" ? "opacity-100 translate-y-0 md:translate-x-0 scale-100" : "opacity-0 translate-y-20 md:translate-y-0 md:translate-x-40 scale-95 pointer-events-none"
        }`}>
          <div className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl relative border border-white max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible text-left">
            {/* OPLOSSING VOOR FOUTMELDING: Geen md:size meer gebruiken */}
            <button 
              onClick={() => setView("home")} 
              className="absolute top-6 right-6 md:top-10 md:right-10 p-3 md:p-5 bg-slate-100 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
            >
              <X className="w-5 h-5 md:w-8 md:h-8" strokeWidth={3} />
            </button>

            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
               <div className="p-3 md:p-4 bg-blue-600 rounded-2xl md:rounded-3xl text-white shadow-lg shadow-blue-500/30">
                 <Thermometer className="w-6 h-6 md:w-10 md:h-10" strokeWidth={2.5} />
               </div>
               <h2 className="text-3xl md:text-6xl font-black italic uppercase text-slate-900 tracking-tighter leading-none">
                 BRRR, <br/><span className="text-blue-600 text-4xl md:text-7xl">FRISJES! ❄️</span>
               </h2>
            </div>
            
            <div className="space-y-4 md:space-y-8 text-sm md:text-2xl text-slate-500 font-bold italic leading-snug tracking-tight">
              <p className="border-l-4 md:border-l-8 border-blue-100 pl-4 md:pl-8">
                Vandaag is het <span className="text-slate-900 underline decoration-blue-500 decoration-2 md:decoration-4">exact {weather.temp}°C</span>. 
              </p>
              <p className="pl-4 md:pl-10">
                Trek je dikke trui en jas aan! 🧥 De wind waait met <span className="text-slate-900">{weather.wind} km/u</span>.
              </p>
              <p className="bg-blue-50 p-4 md:p-8 rounded-2xl md:rounded-3xl text-blue-800 text-xs md:text-xl border border-blue-100 shadow-inner">
                Er is <span className="font-black text-sm md:text-2xl">{weather.chance}</span> kans op regen. ☁️
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="z-100">
        <GlobalNavbar />
      </div>
    </main>
  );
}
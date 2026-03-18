"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const totalDuration = 7000; // 7 seconden
    const intervalTime = 70;    // Update elke 70ms
    const step = 1;             // Elke stap is 1%

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Automatisch doorsturen bij 100%
  useEffect(() => {
    if (progress === 100) {
      router.push("/home");
    }
  }, [progress, router]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#3B82F6] font-sans select-none overflow-hidden">
      {/* --- ACHTERGROND EFFECTEN --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-400/10 blur-[120px] rounded-full" />

      <main className="relative z-10 flex flex-col items-center gap-12 w-full max-w-md px-10">
        
        {/* --- CENTRAAL ICOON --- */}
        <div className="relative flex items-center justify-center w-32 h-32 bg-[#1E40AF] rounded-[2.5rem] border-b-8 border-black/20 shadow-2xl animate-bounce duration-[1500ms]">
          <Zap size={60} className="text-yellow-400 fill-yellow-400" />
          <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full -z-10" />
        </div>

        {/* --- TEKST & STATUS --- */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-md">
            Systeem Starten
          </h1>
          <p className="text-blue-100 font-bold italic opacity-80 animate-pulse">
            Even geduld, we maken verbinding...
          </p>
        </div>

        {/* --- PROGRESS BAR --- */}
        <div className="w-full">
          <div className="flex justify-between mb-2 px-1">
            <span className="text-xs font-black text-white italic uppercase tracking-widest">Laden</span>
            <span className="text-xs font-black text-white italic">{progress}%</span>
          </div>
          <div className="h-6 w-full bg-[#1E40AF] rounded-full border-4 border-black/20 overflow-hidden p-1 shadow-inner">
            <div 
              className="h-full bg-yellow-400 rounded-full transition-all duration-[70ms] ease-linear shadow-[0_0_15px_rgba(250,204,21,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <div className="absolute bottom-12 flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-white/50 animate-spin" strokeWidth={3} />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
          7 seconden tot lancering
        </span>
      </div>
    </div>
  );
}
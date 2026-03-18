"use client";

import { useState, useRef, useEffect, TouchEvent, useCallback } from "react";
import { X, Wind, CloudRain, Sun, AlertTriangle, Thermometer, ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
import GlobalNavbar from "@/components/GlobalNavbar";

export default function IPadHomeClean() {
  const [view, setView] = useState<"home" | "detail">("home");
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Laden...");
  
  const [weather, setWeather] = useState({ 
    temp: 0, 
    wind: 0, 
    condition: "Update ophalen...", 
    chance: "0%", 
    uv: 0, 
    alert: "Checken..." 
  });

  const isDragging = useRef(false);
  const startX = useRef(0);

  // --- LOGICA: DATA OPHALEN (VERBETERD) ---
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const API_KEY = "997b6951234907a974531853d6023366";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=nl`
      );
      
      const data = await res.json();

      // We checken heel specifiek of we de juiste data hebben gekregen
      if (data && data.weather && data.weather[0] && data.main) {
        let alertStatus = "GO! ✅";
        if (data.weather[0].main === "Rain") alertStatus = "REGEN 🌧️";
        if (data.wind?.speed * 3.6 > 40) alertStatus = "WINDIG 💨";
        if (data.main.temp > 28) alertStatus = "HEET 🔥";
        if (data.main.temp < 0) alertStatus = "GLAD ❄️";
        
        setWeather({
          temp: Math.round(data.main.temp),
          wind: Math.round((data.wind?.speed || 0) * 3.6),
          condition: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
          chance: data.clouds ? `${data.clouds.all}%` : "10%",
          uv: data.main.temp > 20 ? 5 : 2,
          alert: alertStatus
        });
        setLocationName(data.name || "Jouw Locatie");
      } else {
        // Als de API iets raars stuurt, gebruiken we de fallback
        throw new Error("Ongeldige API respons");
      }
    } catch (err) {
      console.warn("Live data mislukt, we gebruiken fallback data.");
      // FALLBACK DATA (zodat de app nooit crasht)
      setWeather({
        temp: 11,
        wind: 8,
        condition: "Licht Bewolkt",
        chance: "15%",
        uv: 2,
        alert: "GO! ✅"
      });
      setLocationName("Vorselaar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const startApp = () => {
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            fetchWeather(pos.coords.latitude, pos.coords.longitude);
          },
          () => {
            // Locatie geweigerd of error: Fallback naar Vorselaar
            fetchWeather(51.2016, 4.7739);
          },
          { timeout: 8000 } // Niet te lang wachten op GPS
        );
      } else {
        fetchWeather(51.2016, 4.7739);
      }
    };

    startApp();
  }, [fetchWeather]);

  // --- INTERACTIE HANDLERS ---
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
      className="fixed inset-0 h-screen w-full bg-[#3B82F6] overflow-hidden font-sans select-none text-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => { isDragging.current = false; }}
    >
      {/* --- ACHTERGROND DYNAMIEK --- */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="absolute top-8 left-8 md:top-12 md:left-12 z-30">
        <div className="flex flex-col gap-2 text-left">
          <div className="flex items-center gap-3 bg-[#1E40AF] border-b-4 border-black/20 px-6 py-2 rounded-2xl shadow-lg w-fit">
            <Zap size={18} className="text-yellow-400 fill-yellow-400" />
            <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">
              {loading ? "Radar zoekt..." : `${locationName} • Nu`}
            </h2>
          </div>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_6px_0_rgba(0,0,0,0.2)]">
            {loading ? "..." : `${weather.temp}°`}
          </h1>
        </div>
      </header>

      {/* --- STATUS ZIJBALK --- */}
      <aside className={`absolute left-8 md:left-12 top-[65%] md:top-1/2 -translate-y-1/2 flex flex-row md:flex-col gap-5 z-30 transition-all duration-700 ease-out overflow-x-auto md:overflow-visible pb-4 md:pb-0 max-w-[calc(100%-4rem)] md:max-w-none ${
        view === "detail" ? "opacity-0 -translate-x-32" : "opacity-100 translate-x-0"
      }`}>
        {[
          { icon: Wind, val: `${weather.wind} km/u`, col: "bg-cyan-500 shadow-cyan-700", label: "WIND" },
          { icon: CloudRain, val: weather.chance, col: "bg-indigo-500 shadow-indigo-700", label: "REGEN" },
          { icon: Sun, val: `UV ${weather.uv}`, col: "bg-yellow-500 shadow-yellow-700", label: "ZON" },
          { icon: AlertTriangle, val: weather.alert, col: "bg-green-500 shadow-green-700", label: "CHECK" }
        ].map((item, i) => (
          <div key={i} className="group flex flex-col items-center gap-2 min-w-17.5 md:min-w-0">
            <div className={`w-16 h-16 md:w-20 md:h-20 ${item.col} border-b-8 border-black/20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-hover:-rotate-3`}>
              <item.icon size={28} strokeWidth={3} className="text-white" />
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-white/70 tracking-tighter uppercase">{item.label}</span>
              <span className="text-xs md:text-sm font-black text-white uppercase whitespace-nowrap">{item.val}</span>
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
              ? "-translate-y-40 md:translate-y-0 md:-translate-x-60 lg:-translate-x-80 scale-50 md:scale-75 lg:scale-90 opacity-50" 
              : "translate-x-0 scale-95 md:scale-100 hover:scale-105"
          }`}
        >
          <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full scale-75 animate-pulse" />
          <div className="relative w-[45vh] h-[45vh] md:w-[60vh] md:h-[60vh]">
            <Image src="/IMG/avatar.png" alt="Avatar" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.3)]" priority />
          </div>
          <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-500 ${view === "detail" ? "opacity-0" : "opacity-100"}`}>
             <div className="bg-yellow-400 border-b-8 border-yellow-600 text-black px-8 py-3 rounded-2xl text-sm font-black tracking-widest uppercase flex items-center gap-3 shadow-2xl animate-bounce">
               Wat aandoen? <ArrowRight size={18} strokeWidth={3} />
             </div>
          </div>
        </div>

        {/* --- DETAIL KAART --- */}
        <div className={`absolute inset-x-6 md:inset-x-auto md:right-16 lg:right-32 bottom-24 md:top-1/2 md:-translate-y-1/2 transition-all duration-700 ease-in-out max-w-xl z-40 ${
          view === "detail" ? "opacity-100 translate-y-0 md:translate-x-0 scale-100" : "opacity-0 translate-y-20 md:translate-y-0 md:translate-x-40 scale-95 pointer-events-none"
        }`}>
          <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_0_rgba(0,0,0,0.1)] border-[6px] border-[#1E40AF] relative overflow-hidden">
            <button 
              onClick={() => setView("home")} 
              className="absolute top-6 right-6 p-4 bg-slate-100 rounded-2xl text-slate-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 border-b-4 border-slate-200"
            >
              <X className="w-6 h-6" strokeWidth={4} />
            </button>

            <div className="flex items-center gap-5 mb-10">
               <div className="p-5 bg-blue-600 rounded-[2rem] text-white shadow-xl rotate-[-5deg] border-b-8 border-blue-800">
                 <Thermometer className="w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
               </div>
               <h2 className="text-4xl md:text-6xl font-black italic uppercase text-slate-900 tracking-tighter leading-none">
                 {weather.temp < 12 ? "OEPS, " : "YEAH, "} <br/>
                 <span className="text-blue-600">
                   {weather.temp < 12 ? "FRISJES! ❄️" : "ZALIG! ☀️"}
                 </span>
               </h2>
            </div>
            
            <div className="space-y-6 text-lg md:text-2xl text-slate-600 font-extrabold italic leading-tight">
              <p className="flex items-center gap-3">
                <span className="w-3 h-10 bg-yellow-400 rounded-full" />
                Het is precies <span className="text-slate-900 underline decoration-yellow-400 decoration-[6px] underline-offset-4">{weather.temp}°C</span>
              </p>
              <p className="bg-blue-50 p-8 rounded-[2.5rem] border-4 border-dashed border-blue-200 text-blue-800">
                {weather.temp < 12 ? "Trek je dikste trui aan! 🧥" : "T-shirt weather! 🕶️"} De wind gaat met <span className="text-slate-900">{weather.wind} km/u</span>.
              </p>
              <p className="flex items-center gap-3 text-slate-400 uppercase text-sm tracking-widest">
                <CloudRain size={20} /> De lucht is {weather.condition}
              </p>
            </div>

            <button 
              onClick={() => setView("home")}
              className="mt-10 w-full py-5 bg-[#22C55E] border-b-8 border-[#15803D] text-white rounded-2xl font-black text-xl uppercase tracking-widest active:border-b-0 active:translate-y-2 transition-all shadow-xl"
            >
              Check! 🚀
            </button>
          </div>
        </div>
      </section>

      <div className="z-100 fixed bottom-0 left-0 w-full p-4 flex justify-center">
        <GlobalNavbar />
      </div>
    </main>
  );
}
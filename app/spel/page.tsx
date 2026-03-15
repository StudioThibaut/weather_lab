"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Trophy, HelpCircle, ArrowLeft, Zap, AlertCircle, Wind, CheckCircle2, ShoppingBag, RotateCcw, Home } from "lucide-react";
import { useState, useEffect } from "react";

// Types voor de kledingstukken
interface KledingItem {
  id: string;
  label: string;
  color: string;
  icon: string;
  isCorrect?: boolean;
}

export default function SpelPagina() {
  // --- STATES ---
  const [showAlarm, setShowAlarm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // DEZE WAS JE VERGETEN
  const [alarmCountdown, setAlarmCountdown] = useState(5);
  const [gameTimer, setGameTimer] = useState(60);
  const [score, setScore] = useState(0);
  const weerType = "STORM";

  // De standaard items om het spel te kunnen resetten
  const initialItems: KledingItem[] = [
    { id: "jas", label: "Regenjas", color: "bg-yellow-400", icon: "🧥", isCorrect: true },
    { id: "muts", label: "Muts", color: "bg-blue-500", icon: "🧶", isCorrect: true },
    { id: "laarzen", label: "Laarzen", color: "bg-orange-500", icon: "👢", isCorrect: true },
    { id: "broek", label: "Broek", color: "bg-green-600", icon: "👖", isCorrect: true },
    { id: "sjaal", label: "Sjaal", color: "bg-red-500", icon: "🧣", isCorrect: true },
    { id: "paraplu", label: "Paraplu", color: "bg-purple-500", icon: "☂️", isCorrect: true },
    { id: "zonnebril", label: "Zonnebril", color: "bg-pink-300", icon: "🕶️", isCorrect: false },
    { id: "ijsje", label: "Ijsje", color: "bg-cyan-200", icon: "🍦", isCorrect: false },
    { id: "zwembroek", label: "Zwemshort", color: "bg-emerald-400", icon: "🩳", isCorrect: false },
  ];

  const [availableItems, setAvailableItems] = useState<KledingItem[]>(initialItems);

  // RESET FUNCTIE
  const resetGame = () => {
    setScore(0);
    setGameTimer(60);
    setAvailableItems(initialItems);
    setShowScore(false);
    setShowLeaderboard(false);
    setShowAlarm(true);
    setAlarmCountdown(5);
  };

  // Logica voor de ALARM aftelling
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlarm && alarmCountdown > 0) {
      timer = setTimeout(() => setAlarmCountdown(alarmCountdown - 1), 1000);
    } else if (showAlarm && alarmCountdown === 0) {
      timer = setTimeout(() => {
        setShowAlarm(false);
        setIsPlaying(true);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showAlarm, alarmCountdown]);

  // Logica voor de GAME timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && gameTimer > 0) {
      timer = setInterval(() => setGameTimer((prev) => prev - 1), 1000);
    } else if (gameTimer === 0 && isPlaying) {
      setIsPlaying(false);
      setShowScore(true); 
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameTimer]);

  const handleDragEnd = (event: any, info: any, item: KledingItem) => {
    const dropZone = document.getElementById("drop-zone");
    if (dropZone) {
      const rect = dropZone.getBoundingClientRect();
      const { x, y } = info.point;
      const isInside = x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;

      if (isInside) {
        if (item.isCorrect) {
          setScore((prev) => prev + 100);
          setAvailableItems((prev) => prev.filter((i) => i.id !== item.id));
        } else {
          setScore((prev) => Math.max(0, prev - 150));
        }
      } else {
        setScore((prev) => Math.max(0, prev - 50)); 
      }
    }
  };

  return (
    <main className="fixed inset-0 w-full h-full bg-[#F0F7FF] overflow-hidden font-sans selection:bg-blue-200">
      
      {/* --- RODE TIJDSBALK --- */}
      <AnimatePresence>
        {isPlaying && (
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-200 z-[70]">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: `${(gameTimer / 60) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
              className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            />
          </div>
        )}
      </AnimatePresence>

      {/* --- 1. START SCHERM --- */}
      {!showAlarm && !isPlaying && !showScore && !showLeaderboard && (
        <div className="relative w-full h-full">
          <div className="relative z-10 w-full h-full flex items-center justify-center p-8 md:p-20">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-10">
                <div className="space-y-4">
                  <h1 className="text-7xl md:text-9xl font-black italic uppercase leading-[0.8] tracking-tighter text-[#1A2B4B]">
                    HET <br />
                    <span className="text-blue-600">AANKLEED</span><br />
                    SPEL
                  </h1>
                  <p className="text-xl text-slate-500 font-medium max-w-sm leading-relaxed border-l-4 border-blue-200 pl-6">
                    Kies de juiste kleren voor de avatar voordat de storm toeslaat!
                  </p>
                </div>

                <div className="flex flex-col gap-4 max-w-md">
                  <button onClick={() => setShowAlarm(true)} className="group w-full">
                    <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.98 }} className="bg-[#00D1FF] p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-cyan-200/50 border-b-8 border-cyan-600 active:border-b-0 transition-all text-white font-black italic uppercase tracking-wider">
                      <span className="text-2xl ml-4">Start Spel</span>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Play fill="#00D1FF" className="text-[#00D1FF] translate-x-0.5" size={24} />
                      </div>
                    </motion.div>
                  </button>
                  <div className="flex gap-4">
                    <button onClick={() => setShowLeaderboard(true)} className="flex-1 bg-white/40 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/40 flex items-center justify-center gap-3 hover:bg-white/80 transition-all">
                      <Trophy className="text-yellow-400" size={20} />
                      <span className="font-black italic uppercase text-[10px] text-slate-600 tracking-widest">Scores</span>
                    </button>
                    <button className="flex-1 bg-white/40 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/40 flex items-center justify-center gap-3 hover:bg-white/80 transition-all">
                      <HelpCircle className="text-blue-400" size={20} />
                      <span className="font-black italic uppercase text-[10px] text-slate-600 tracking-widest">Hulp</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative w-80 h-[520px] bg-white rounded-[5rem] shadow-2xl border-[12px] border-white flex flex-col items-center justify-center">
                   <div className="text-6xl mb-4">👤</div>
                   <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-black uppercase text-[10px]">Klaar voor actie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. ALARM OVERLAY --- */}
      <AnimatePresence>
        {showAlarm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-red-600 overflow-hidden">
            <div className="relative z-10 text-center text-white px-6">
              <motion.div animate={{ scale: [1, 1.1, 1] }} className="flex justify-center mb-8">
                <div className="bg-white p-8 rounded-[3rem] text-red-600"><AlertCircle size={80} strokeWidth={3} /></div>
              </motion.div>
              <h2 className="text-6xl md:text-9xl font-black italic uppercase mb-4">PAS OP!</h2>
              <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.4em] opacity-90 mb-12">De {weerType} komt eraan</p>
              <motion.div key={alarmCountdown} initial={{ scale: 2 }} animate={{ scale: 1 }} className="text-[12rem] md:text-[18rem] font-black italic">{alarmCountdown > 0 ? alarmCountdown : "GO!"}</motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 3. HET SPEELVELD --- */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full flex p-12 gap-10">
            <div className="w-1/3 flex items-center justify-center">
                <div className="relative w-full h-[600px] bg-white rounded-[5rem] shadow-2xl border-[12px] border-white flex flex-col items-center justify-center">
                    <div className="w-44 h-44 bg-slate-50 rounded-full mb-8 flex items-center justify-center text-6xl opacity-20">👤</div>
                    <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-[0.2em]">Avatar Plek</div>
                </div>
            </div>
            <div className="w-2/3 flex flex-col gap-10">
                <div className="flex-1 bg-white/40 backdrop-blur-md rounded-[4rem] p-10 border-2 border-white relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 font-black uppercase text-slate-500">
                        <div className="flex items-center gap-3"><ShoppingBag className="text-blue-500" /> De Stapel</div>
                        <div className="bg-white px-6 py-2 rounded-2xl shadow-sm text-blue-600 text-2xl italic">{gameTimer}s</div>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {availableItems.map((item) => (
                            <motion.div key={item.id} drag onDragEnd={(e, info) => handleDragEnd(e, info, item)} whileDrag={{ zIndex: 100, scale: 1.1 }} className={`cursor-grab active:cursor-grabbing w-28 h-28 ${item.color} rounded-[2rem] border-4 border-white shadow-xl flex flex-col items-center justify-center text-white`}>
                                <span className="text-3xl mb-1">{item.icon}</span>
                                <span className="font-black italic text-[8px] uppercase">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div id="drop-zone" className="h-72 bg-blue-600/10 border-4 border-dashed border-blue-400 rounded-[4rem] flex flex-col items-center justify-center text-blue-500 relative">
                    <div className="bg-blue-500 text-white p-5 rounded-3xl shadow-lg mb-4"><CheckCircle2 size={40} /></div>
                    <span className="font-black uppercase tracking-[0.3em] text-sm">Sleep STORM-kleding hierheen</span>
                    <motion.div key={score} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="absolute bottom-8 right-8 bg-white p-6 rounded-[2rem] shadow-xl border border-blue-50 flex flex-col items-center min-w-[120px]">
                        <span className="text-slate-400 font-black uppercase text-[10px] mb-1">Punten</span>
                        <span className="text-4xl font-black italic text-blue-600">{score}</span>
                    </motion.div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 4. SCORE SCHERM --- */}
      <AnimatePresence>
        {showScore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1A2B4B]/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[5rem] p-16 max-w-2xl w-full text-center shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-[12px] border-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500" />
              <div className="mb-10 inline-flex p-8 bg-yellow-50 rounded-[3rem] text-yellow-500"><Trophy size={100} strokeWidth={1.5} /></div>
              <h2 className="text-5xl font-black italic uppercase text-[#1A2B4B] mb-2">GEWELDIG GEDAAN!</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest mb-12">De storm is voorbij en je bent veilig.</p>
              <div className="bg-blue-50 rounded-[3rem] p-10 mb-12 relative">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest">Jouw Score</span>
                <span className="text-8xl font-black italic text-blue-600 tracking-tighter">{score}</span>
              </div>
              <div className="flex flex-col gap-6">
                <button onClick={() => { setShowScore(false); setShowLeaderboard(true); }} className="w-full bg-[#00D1FF] p-6 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-xl border-b-8 border-cyan-600 active:border-b-0 transition-all text-white font-black italic uppercase text-xl">
                  <Trophy size={24} /> Naar het Scorebord
                </button>
                <div className="space-y-2">
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Je wordt automatisch doorgestuurd...</p>
                  <div className="w-48 h-1 bg-slate-100 mx-auto rounded-full overflow-hidden">
                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 10, ease: "linear" }} className="h-full bg-blue-400" onAnimationComplete={() => { setShowScore(false); setShowLeaderboard(true); }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 5. SCOREBORD SCHERM (VOLGENS SCHETS) --- */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-[300] bg-[#1A2B4B] flex items-center justify-center p-4 md:p-12"
          >
            <div className="w-full max-w-7xl h-full max-h-[900px] bg-white rounded-[4rem] shadow-2xl border-[12px] border-white overflow-hidden flex flex-col md:flex-row">
              
              {/* LINKERKANT: JOUW INFO (Punten & Informatie op schets) */}
              <div className="w-full md:w-1/3 bg-slate-50 p-12 flex flex-col justify-between border-r-4 border-slate-100">
                <div className="space-y-8">
                  {/* "Punten" ovaal van schets */}
                  <div className="inline-block px-10 py-4 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-200">
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Jouw Score</span>
                    <span className="text-5xl font-black italic">{score}</span>
                  </div>

                  {/* "Informatie" sectie van schets */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black italic uppercase text-slate-800 tracking-tighter">Informatie</h3>
                    <div className="space-y-2">
                      <div className="h-1 w-20 bg-blue-400 rounded-full" /> {/* Lijnen van schets */}
                      <p className="text-slate-500 font-medium leading-relaxed">
                        Geweldig gedaan! Je hebt de storm overleefd en staat nu in de ranglijst. 
                        Blijf oefenen om de nummer 1 te worden!
                      </p>
                    </div>
                  </div>
                </div>

                {/* De iconen aan de linkerkant (van schets) */}
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 border border-slate-100"><Trophy size={20} /></div>
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 border border-slate-100"><Zap size={20} /></div>
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl shadow-lg flex items-center justify-center text-white"><RotateCcw size={20} onClick={resetGame} className="cursor-pointer" /></div>
                </div>
              </div>

              {/* RECHTERKANT: DE RANG LIJSTEN (Algemeen & School) */}
              <div className="flex-1 p-12 flex flex-col gap-10 overflow-y-auto">
                
                {/* SECTIE: ALGEMEEN */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black italic uppercase text-blue-600 tracking-tighter">Algemeen</h2>
                    <div className="h-0.5 flex-1 mx-6 bg-slate-100" />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[
                      { name: "Sander", pts: 2400, icon: "🥇" },
                      { name: "Emma", pts: 2150, icon: "🥈" },
                      { name: "Jefta", pts: 1900, icon: "🥉" },
                      { name: "Lotte", pts: 1600, icon: "4" },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                          <span className="font-black text-blue-400 w-6">{p.icon}</span>
                          <span className="font-bold uppercase text-slate-700">{p.name}</span>
                        </div>
                        <span className="font-black italic text-blue-600">{p.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTIE: SCHOOL */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black italic uppercase text-blue-600 tracking-tighter">School</h2>
                    <div className="h-0.5 flex-1 mx-6 bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[
                      { name: "Klas 5A", pts: 8900, icon: "🏫" },
                      { name: "Klas 6B", pts: 7200, icon: "🏫" },
                      { name: "Klas 4C", pts: 6500, icon: "🏫" },
                      { name: "Kees (Docent)", pts: 500, icon: "🍎" },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-100">
                        <div className="flex items-center gap-4">
                          <span className="text-xl">{p.icon}</span>
                          <span className="font-bold uppercase text-slate-700">{p.name}</span>
                        </div>
                        <span className="font-black italic text-blue-500">{p.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer actie op het bord zelf */}
                <div className="mt-auto pt-8 flex gap-4">
                  <button onClick={resetGame} className="flex-1 bg-[#00D1FF] p-6 rounded-[2rem] text-white font-black italic uppercase shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    <RotateCcw size={24} /> Opnieuw Spelen
                  </button>
                  <button onClick={() => setShowLeaderboard(false)} className="bg-slate-100 p-6 rounded-[2rem] text-slate-400 font-black italic uppercase px-12 hover:bg-slate-200 transition-all">
                    Menu
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigatiebalk Startscherm */}
      {!showAlarm && !isPlaying && !showScore && !showLeaderboard && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 h-16 px-10 rounded-full flex items-center gap-12 shadow-2xl z-50">
           <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/10">
             <Play size={18} fill="white" className="text-white" />
           </div>
           <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
        </div>
      )}
    </main>
  );
}
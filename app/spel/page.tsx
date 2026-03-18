"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Trophy, HelpCircle, Zap, AlertCircle, CheckCircle2, ShoppingBag, RotateCcw, School, Globe, Home } from "lucide-react";
import { useState, useEffect } from "react";

// Types voor de kledingstukken
interface KledingItem {
  id: string;
  label: string;
  color: string;
  shadowCol: string; // Arcade-schaduw stijl toegevoegd
  icon: string;
  isCorrect?: boolean;
}

export default function SpelPagina() {
  // --- STATES ---
  const [showAlarm, setShowAlarm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [alarmCountdown, setAlarmCountdown] = useState(5);
  const [gameTimer, setGameTimer] = useState(60);
  const [score, setScore] = useState(0);
  const weerType = "STORM";

const initialItems: KledingItem[] = [
  // --- CORRECTE ITEMS (STORM/REGEN) ---
  { id: "jas", label: "Regenjas", color: "bg-indigo-500", shadowCol: "border-indigo-800", icon: "🧥", isCorrect: true },
  { id: "muts", label: "Muts", color: "bg-blue-600", shadowCol: "border-blue-800", icon: "🧶", isCorrect: true },
  { id: "laarzen", label: "Laarzen", color: "bg-cyan-500", shadowCol: "border-cyan-700", icon: "👢", isCorrect: true },
  { id: "broek", label: "Broek", color: "bg-slate-600", shadowCol: "border-slate-800", icon: "👖", isCorrect: true },
  { id: "sjaal", label: "Sjaal", color: "bg-blue-400", shadowCol: "border-blue-700", icon: "🧣", isCorrect: true },
  { id: "paraplu", label: "Paraplu", color: "bg-purple-500", shadowCol: "border-purple-800", icon: "☂️", isCorrect: true },
  { id: "handschoenen", label: "Wanten", color: "bg-blue-500", shadowCol: "border-blue-900", icon: "🧤", isCorrect: true },
  { id: "zaklamp", label: "Zaklamp", color: "bg-orange-400", shadowCol: "border-orange-700", icon: "🔦", isCorrect: true },
  { id: "zuidwester", label: "Regenhoed", color: "bg-yellow-500", shadowCol: "border-yellow-700", icon: "👒", isCorrect: true },
  { id: "regenbroek", label: "Regenbroek", color: "bg-blue-900", shadowCol: "border-black", icon: "👖", isCorrect: true },
  { id: "thermos", label: "Warme Thee", color: "bg-red-700", shadowCol: "border-red-950", icon: "☕", isCorrect: true },
  { id: "vest", label: "Dik Vest", color: "bg-emerald-600", shadowCol: "border-emerald-900", icon: "🧥", isCorrect: true },
  { id: "sokken", label: "Wollen Sok", color: "bg-teal-500", shadowCol: "border-teal-800", icon: "🧦", isCorrect: true },

  // --- INCORRECTE ITEMS (ZON/ZOMER/GEK) ---
  { id: "zonnebril", label: "Zonnebril", color: "bg-yellow-500", shadowCol: "border-yellow-700", icon: "🕶️", isCorrect: false },
  { id: "ijsje", label: "Ijsje", color: "bg-pink-500", shadowCol: "border-pink-800", icon: "🍦", isCorrect: false },
  { id: "zwembroek", label: "Zwemshort", color: "bg-green-500", shadowCol: "border-green-800", icon: "🩳", isCorrect: false },
  { id: "slippers", label: "Slippers", color: "bg-orange-300", shadowCol: "border-orange-600", icon: "🩴", isCorrect: false },
  { id: "petje", label: "Petje", color: "bg-red-500", shadowCol: "border-red-800", icon: "🧢", isCorrect: false },
  { id: "snorkel", label: "Snorkel", color: "bg-emerald-400", shadowCol: "border-emerald-700", icon: "🤿", isCorrect: false },
  { id: "surfplank", label: "Surfplank", color: "bg-sky-400", shadowCol: "border-sky-700", icon: "🏄", isCorrect: false },
  { id: "ventilator", label: "Waaier", color: "bg-teal-300", shadowCol: "border-teal-600", icon: "🪭", isCorrect: false },
  { id: "short", label: "Korte Broek", color: "bg-amber-600", shadowCol: "border-amber-900", icon: "🩳", isCorrect: false },
  { id: "zwemband", label: "Zwemband", color: "bg-rose-400", shadowCol: "border-rose-700", icon: "🍩", isCorrect: false },
  { id: "gitaar", label: "Gitaar", color: "bg-amber-800", shadowCol: "border-black", icon: "🎸", isCorrect: false },
  { id: "bal", label: "Strandbal", color: "bg-blue-300", shadowCol: "border-blue-500", icon: "🏐", isCorrect: false },
  { id: "skate", label: "Skateboard", color: "bg-zinc-700", shadowCol: "border-black", icon: "🛹", isCorrect: false },
  { id: "topje", label: "Zomertop", color: "bg-violet-400", shadowCol: "border-violet-700", icon: "👕", isCorrect: false },
];

  const [availableItems, setAvailableItems] = useState<KledingItem[]>(initialItems);

  const resetGame = () => {
    setScore(0);
    setGameTimer(60);
    // Shuffle de items door de lijst willekeurig te sorteren
    const shuffled = [...initialItems].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setShowScore(false);
    setShowLeaderboard(false);
    setShowAlarm(true);
    setAlarmCountdown(5);
  };

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
    <main className="fixed inset-0 w-full h-full bg-[#3B82F6] overflow-hidden font-sans text-white">
      
      {/* --- VISUELE ACHTERGROND (Code 1 Kleuren) --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-yellow-400/10 blur-[80px] rounded-full pointer-events-none" />

      {/* --- TIJDSBALK (Code 1 Stijl: Geel op Blauw) --- */}
      <AnimatePresence>
        {isPlaying && (
          <div className="absolute top-0 left-0 w-full h-4 bg-black/20 z-50 overflow-hidden">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: `${(gameTimer / 60) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
              className="h-full bg-yellow-400 border-r-4 border-black/20 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
            />
          </div>
        )}
      </AnimatePresence>

      {/* --- 1. START SCHERM --- */}
      {!showAlarm && !isPlaying && !showScore && !showLeaderboard && (
        <div className="relative w-full h-full flex items-center justify-center p-8 md:p-20">
          <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-10">
              <div className="space-y-6">
                <h1 className="text-7xl md:text-9xl font-black italic uppercase leading-[0.8] tracking-tighter text-white drop-shadow-[0_8px_0_rgba(0,0,0,0.2)]">
                  WELK<br />
                  <span className="text-yellow-400">KLEDINGSTUK</span><br />
                  SPEL
                </h1>
                <p className="text-xl text-blue-100 font-medium max-w-sm leading-relaxed border-l-4 border-yellow-400 pl-6">
                  Kies de juiste kleren voor de avatar voordat de storm toeslaat!
                </p>
              </div>

              <div className="flex flex-col gap-5 max-w-md">
                <button onClick={resetGame} className="group w-full">
                  <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.98 }} className="bg-[#22C55E] p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl border-b-10 border-[#15803D] active:border-b-0 transition-all text-white font-black italic uppercase tracking-wider">
                    <span className="text-2xl ml-4">Start Spel</span>
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Play fill="white" className="ml-1" size={24} />
                    </div>
                  </motion.div>
                </button>
                <div className="flex gap-4">
                  <button onClick={() => setShowLeaderboard(true)} className="flex-1 bg-[#1E40AF] p-5 rounded-3xl shadow-lg border-b-4 border-black/20 flex items-center justify-center gap-3 hover:bg-[#2563EB] transition-all">
                    <Trophy className="text-yellow-400" size={20} fill="currentColor" />
                    <span className="font-black italic uppercase text-[10px] text-white tracking-widest">Scores</span>
                  </button>
                  <button className="flex-1 bg-[#1E40AF] p-5 rounded-3xl shadow-lg border-b-4 border-black/20 flex items-center justify-center gap-3 hover:bg-[#2563EB] transition-all">
                    <HelpCircle className="text-white" size={20} />
                    <span className="font-black italic uppercase text-[10px] text-white tracking-widest">Hulp</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-80 h-125 bg-white rounded-[4rem] shadow-[0_30px_0_rgba(0,0,0,0.1)] border-12 border-[#1E40AF] flex flex-col items-center justify-center overflow-hidden">
                  <img 
                    src="/IMG/avatar.png" 
                    alt="Avatar" 
                    className="w-full h-full object-contain p-6 drop-shadow-2xl" 
                  />
                  <div className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black italic text-xs tracking-widest uppercase border-b-4 border-yellow-600">Klaar voor actie</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. ALARM OVERLAY --- */}
      <AnimatePresence>
        {showAlarm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-300 flex items-center justify-center bg-red-600">
            <div className="text-center text-white px-6">
              <motion.div animate={{ scale: [1, 1.1, 1] }} className="flex justify-center mb-8">
                <div className="bg-white p-8 rounded-[3rem] text-red-600 shadow-2xl"><AlertCircle size={80} strokeWidth={3} /></div>
              </motion.div>
              <h2 className="text-6xl md:text-[10rem] font-black italic uppercase mb-4 leading-none">PAS OP!</h2>
              <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.4em] opacity-90 mb-12 text-yellow-300">De {weerType} komt eraan</p>
              <motion.div key={alarmCountdown} initial={{ scale: 2 }} animate={{ scale: 1 }} className="text-[12rem] md:text-[18rem] font-black italic leading-none">{alarmCountdown > 0 ? alarmCountdown : "GO!"}</motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 3. SPEELVELD --- */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full flex p-12 gap-10">
            {/* AVATAR KANT */}
            <div className="w-1/3 flex items-center justify-center">
                <div className="relative w-full h-full bg-white rounded-[5rem] shadow-[0_25px_0_rgba(0,0,0,0.1)] border-12 border-[#1E40AF] flex flex-col items-center justify-center overflow-hidden">
                    <img 
                      src="/IMG/avatar.png" 
                      alt="Avatar" 
                      className="w-full h-full object-contain p-8 opacity-90" 
                    />
                    <div className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-xs tracking-[0.2em] border-b-4 border-blue-800 absolute bottom-12">Avatar Plek</div>
                </div>
            </div>

            {/* SPEL KANT */}
            <div className="w-2/3 flex flex-col gap-10">
                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-[4rem] p-10 border-4 border-white/20 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 font-black uppercase">
                        <div className="flex items-center gap-3 text-white text-xl italic"><ShoppingBag className="text-yellow-400" /> De Stapel</div>
                        <div className="bg-black/40 px-8 py-3 rounded-2xl border-b-4 border-black/20 text-yellow-400 text-3xl italic tracking-tighter">{gameTimer}s</div>
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center overflow-y-auto max-h-[calc(100%-80px)] p-4">
                        {availableItems.map((item) => (
                            <motion.div 
                              key={item.id} 
                              drag 
                              onDragEnd={(e, info) => handleDragEnd(e, info, item)} 
                              whileDrag={{ zIndex: 100, scale: 1.1 }} 
                              className={`cursor-grab active:cursor-grabbing w-32 h-32 ${item.color} ${item.shadowCol} border-b-8 rounded-[2.5rem] border-2 border-white/20 shadow-xl flex flex-col items-center justify-center text-white transition-transform`}
                            >
                                <span className="text-5xl mb-2 drop-shadow-md">{item.icon}</span>
                                <span className="font-black italic text-[10px] uppercase tracking-tighter">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* DROP ZONE */}
                <div id="drop-zone" className="h-64 bg-black/20 border-4 border-dashed border-white/30 rounded-[4rem] flex flex-col items-center justify-center relative">
                    <div className="bg-yellow-400 text-black p-6 rounded-[2rem] shadow-2xl mb-4 border-b-4 border-yellow-600"><CheckCircle2 size={40} /></div>
                    <span className="font-black uppercase tracking-[0.3em] text-sm text-blue-100">Sleep STORM-kleding hierheen</span>
                    
                    <motion.div key={score} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="absolute bottom-8 right-8 bg-white p-6 rounded-[2.5rem] shadow-2xl border-b-8 border-slate-200 flex flex-col items-center min-w-35">
                        <span className="text-slate-400 font-black uppercase text-[10px] mb-1">Punten</span>
                        <span className="text-5xl font-black italic text-blue-600 leading-none">{score}</span>
                    </motion.div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 4. SCORE SCHERM --- */}
      <AnimatePresence>
        {showScore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-400 flex items-center justify-center bg-blue-900/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[5rem] p-16 max-w-2xl w-full text-center shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-12 border-white relative overflow-hidden text-slate-900">
              <div className="absolute top-0 left-0 w-full h-6 bg-yellow-400" />
              <div className="mb-10 inline-flex p-10 bg-yellow-50 rounded-[4rem] text-yellow-500 shadow-inner border-b-4 border-yellow-100"><Trophy size={100} strokeWidth={1.5} /></div>
              <h2 className="text-6xl font-black italic uppercase text-blue-600 mb-2 leading-none">GEWELDIG GEDAAN!</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest mb-12">De storm is voorbij en je bent veilig.</p>
              
              <div className="bg-blue-600 rounded-[3rem] p-12 mb-12 relative border-b-10 border-blue-800 shadow-2xl">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-8 py-2 rounded-full font-black uppercase text-xs tracking-widest border-b-4 border-yellow-600">Jouw Score</span>
                <span className="text-9xl font-black italic text-white tracking-tighter leading-none">{score}</span>
              </div>

              <div className="flex flex-col gap-6">
                <button onClick={() => { setShowScore(false); setShowLeaderboard(true); }} className="w-full bg-[#22C55E] p-8 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-xl border-b-10 border-[#15803D] active:translate-y-2 active:border-b-0 transition-all text-white font-black italic uppercase text-2xl">
                  <Trophy size={28} fill="currentColor" /> Naar het Scorebord
                </button>
                <div className="space-y-4">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Je wordt doorgestuurd...</p>
                  <div className="w-48 h-2 bg-slate-100 mx-auto rounded-full overflow-hidden">
                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 10, ease: "linear" }} className="h-full bg-blue-500" onAnimationComplete={() => { setShowScore(false); setShowLeaderboard(true); }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 5. SCOREBORD SCHERM --- */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-500 bg-[#1A2B4B] flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-7xl h-full max-h-[85vh] bg-white rounded-[5rem] shadow-2xl border-12 border-white overflow-hidden flex flex-col md:row text-slate-900">
              
              <div className="w-full md:w-1/3 bg-blue-50 p-12 flex flex-col justify-between border-r-[6px] border-[#1E40AF] border-dashed">
                <div className="space-y-10">
                  <div className="inline-block px-12 py-6 bg-blue-600 rounded-[3rem] text-white shadow-2xl border-b-10 border-blue-800">
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Jouw Score</span>
                    <span className="text-7xl font-black italic leading-none">{score}</span>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-3xl font-black italic uppercase text-blue-600 tracking-tighter">Informatie</h3>
                    <div className="space-y-4">
                      <div className="h-1.5 w-24 bg-yellow-400 rounded-full" />
                      <p className="text-slate-600 font-bold text-lg leading-relaxed">
                        Geweldig gedaan! Je hebt de storm overleefd. Blijf oefenen om de nummer 1 te worden van jouw klas!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600 border-b-4 border-slate-200"><Trophy size={28} fill="currentColor" /></div>
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-yellow-500 border-b-4 border-slate-200"><Zap size={28} fill="currentColor" /></div>
                    <button onClick={resetGame} className="w-16 h-16 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-white border-b-4 border-blue-800 hover:scale-110 transition-transform"><RotateCcw size={28} /></button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-14 flex flex-col gap-12 overflow-y-auto bg-white">
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-5xl font-black italic uppercase text-blue-600 tracking-tighter">Algemeen</h2>
                    <div className="h-1 flex-1 bg-blue-50" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[{ name: "Sander", pts: 2400, icon: "🥇" }, { name: "Emma", pts: 2150, icon: "🥈" }, { name: "Jefta", pts: 1900, icon: "🥉" }, { name: "Lotte", pts: 1600, icon: "4" }].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-7 bg-slate-50 rounded-[2.5rem] border-b-8 border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                          <span className="text-2xl w-10">{p.icon}</span>
                          <span className="font-black uppercase text-slate-700 text-xl italic">{p.name}</span>
                        </div>
                        <span className="font-black italic text-3xl text-blue-600">{p.pts}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-5xl font-black italic uppercase text-blue-600 tracking-tighter">School</h2>
                    <div className="h-1 flex-1 bg-blue-50" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[{ name: "Klas 5A", pts: 8900, icon: "🏫" }, { name: "Klas 6B", pts: 7200, icon: "🏫" }, { name: "Klas 4C", pts: 6500, icon: "🏫" }, { name: "Docent", pts: 500, icon: "🍎" }].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-7 bg-blue-50 rounded-[2.5rem] border-b-8 border-blue-100 border-dashed">
                        <div className="flex items-center gap-5">
                          <span className="text-3xl">{p.icon}</span>
                          <span className="font-black uppercase text-slate-700 text-xl italic">{p.name}</span>
                        </div>
                        <span className="font-black italic text-3xl text-blue-500">{p.pts}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="mt-auto pt-10 flex gap-6">
                  <button onClick={resetGame} className="flex-1 bg-[#22C55E] p-8 rounded-[2.5rem] text-white font-black italic uppercase text-2xl shadow-2xl border-b-10 border-[#15803D] hover:scale-[1.02] active:translate-y-2 active:border-b-0 transition-all flex items-center justify-center gap-4">
                    <RotateCcw size={32} /> Opnieuw Spelen
                  </button>
                  <button onClick={() => {setShowLeaderboard(false); setIsPlaying(false);}} className="bg-slate-800 p-8 rounded-[2.5rem] text-white font-black italic uppercase px-14 border-b-10 border-black hover:bg-black transition-all">
                    Menu
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NAVIGATIEBALK ONDERAAN --- */}
      {!showAlarm && !isPlaying && !showScore && !showLeaderboard && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#1E40AF] h-20 px-12 rounded-full flex items-center gap-12 shadow-2xl z-50 border-b-4 border-black/20">
           <div className="w-2 h-2 bg-yellow-400 rounded-full" />
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
             <Play size={22} fill="white" className="text-white" />
           </div>
           <div className="w-2 h-2 bg-yellow-400 rounded-full" />
        </div>
      )}
    </main>
  );
}
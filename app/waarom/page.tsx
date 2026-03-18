"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Cloud, Droplets, X, Zap, Activity, ChevronRight, Sparkles, Star } from "lucide-react";
import GlobalNavbar from "@/components/GlobalNavbar";

export default function WaaromExperimentPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [value, setValue] = useState(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const experimentFlow = {
    wind: [
      { label: "Opwarmen", desc: "De zon verwarmt de grond. De lucht wordt licht en stijgt op.", icon: <Sparkles className="text-yellow-500" /> },
      { label: "Drukverschil", desc: "Er ontstaat een 'gat'. Koude lucht begint te stromen.", icon: <Wind className="text-cyan-500" /> },
      { label: "Stroming", desc: "De lucht sjeest nu vooruit. Dit is wind!", icon: <Activity className="text-blue-600" /> }
    ],
    wolk: [
      { label: "Wrijving", desc: "IJskristallen en druppels botsen hard tegen elkaar.", icon: <Activity className="text-orange-500" /> },
      { label: "Opladen", desc: "De wolk bouwt stroom op, net als je sokken op tapijt!", icon: <Zap className="text-yellow-600" /> },
      { label: "Ontlading", desc: "BOEM! De energie schiet eruit als een reuzenvonk.", icon: <Zap className="text-orange-400" /> }
    ],
    water: [
      { label: "Verdamping", desc: "Water wordt onzichtbaar gas en vliegt omhoog.", icon: <Cloud className="text-blue-400" /> },
      { label: "Condensatie", desc: "De damp koelt af en plakt vast aan stofdeeltjes.", icon: <Droplets className="text-blue-600" /> },
      { label: "Neerslag", desc: "De druppels worden te zwaar en vallen omlaag.", icon: <ChevronRight className="rotate-90 text-indigo-600" /> }
    ]
  };

  const startExperiment = () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 2) {
          clearInterval(timer);
          setTimeout(() => {
            setIsAnalyzing(false);
            setCurrentStep(0);
          }, 4000);
          return 2;
        }
        return prev + 1;
      });
    }, 5000); 
  };

  const currentContent = activeTab ? content[activeTab as keyof typeof content] : null;
  const currentSteps = activeTab ? experimentFlow[activeTab as keyof typeof experimentFlow] : [];

  return (
    <main className="fixed inset-0 h-screen w-full bg-[#3B82F6] overflow-hidden font-sans select-none text-white flex flex-col">
      <GlobalNavbar />

      {/* --- GAME HEADER --- */}
      <header className="absolute top-24 left-8 right-8 z-50 flex justify-between items-center pointer-events-none md:pointer-events-auto">
        <div className="bg-[#1E40AF] border-b-4 border-black/20 px-6 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
          <Star size={18} className="text-yellow-400 fill-current animate-pulse" />
          <span className="font-black text-xs tracking-widest uppercase">Level 1: Wetenschapper</span>
        </div>
      </header>

      <section className="relative z-10 flex-1 flex flex-col md:flex-row items-center px-6 md:px-16 gap-6 md:gap-12 pt-40 pb-32 overflow-hidden">
        
        {/* LINKS: TABS (Neubrutalism Style) */}
        <aside className={`flex flex-row md:flex-col gap-4 transition-all duration-700 shrink-0 z-20 ${isAnalyzing ? 'opacity-20 blur-md' : 'opacity-100'}`}>
          {Object.entries(content).map(([key, item]) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setIsAnalyzing(false); }}
              className={`w-16 h-16 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center transition-all duration-200 border-b-8 active:border-b-0 active:translate-y-2 shadow-xl ${
                activeTab === key 
                  ? "bg-yellow-400 border-yellow-700 text-yellow-900 scale-110" 
                  : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
              }`}
            >
              <div className="scale-75 md:scale-110">{item.icon}</div>
            </button>
          ))}
        </aside>

        {/* RECHTS: EXPERIMENT AREA */}
        <div className="flex-1 w-full flex items-center h-full">
          <AnimatePresence mode="wait">
            {!activeTab ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center md:text-left"
              >
                <h1 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] drop-shadow-[0_8px_0_rgba(0,0,0,0.2)]">
                  WAAROM <br/><span className="text-yellow-400">WERELD?</span>
                </h1>
                <p className="mt-6 text-xl font-bold text-blue-100 opacity-80 uppercase tracking-widest">Kies een proefje om te starten! 🧪</p>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full"
              >
                
                {/* STAP-VOORTGANG */}
                <div className="lg:col-span-4 flex flex-col justify-center">
                  <div className="bg-white rounded-[3rem] p-8 border-b-10 border-black/10 shadow-2xl">
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-4 tracking-tighter text-blue-600 leading-none">
                      {currentContent?.title}
                    </h2>
                    
                    <div className="space-y-3">
                      {currentSteps.map((step, idx) => (
                        <motion.div 
                          key={idx}
                          animate={{ 
                            backgroundColor: isAnalyzing && currentStep === idx ? "#EFF6FF" : "#FFFFFF",
                            x: isAnalyzing && currentStep === idx ? 15 : 0,
                            opacity: isAnalyzing && currentStep !== idx ? 0.4 : 1
                          }}
                          className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
                            currentStep === idx && isAnalyzing ? 'border-blue-500 shadow-md' : 'border-slate-100'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                            idx < currentStep ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-500'
                          }`}>
                            {idx < currentStep ? "✓" : idx + 1}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Stap {idx + 1}</p>
                            <p className={`text-md font-black uppercase italic ${currentStep === idx && isAnalyzing ? 'text-blue-600' : 'text-slate-800'}`}>
                              {step.label}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* VISUALIZER PANEEL */}
                <div className="lg:col-span-8 bg-white rounded-[4rem] p-6 border-b-12 border-black/10 shadow-2xl flex flex-col relative overflow-hidden">
                  
                  {/* HET LAB-VENSTER */}
                  <div className={`flex-1 rounded-[3rem] overflow-hidden relative transition-all duration-700 ${isAnalyzing ? 'bg-blue-50' : 'bg-slate-50 border-4 border-dashed border-slate-200'}`}>
                    
                    <AnimatePresence mode="wait">
                      {isAnalyzing ? (
                        <motion.div 
                          key={`${activeTab}-${currentStep}`}
                          initial={{ opacity: 0, scale: 0.8 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                        >
                           <div className="mb-8 text-blue-500">
                              {activeTab === 'wolk' && currentStep === 2 && <Zap size={100} className="text-yellow-400 fill-current animate-bounce" />}
                              {activeTab === 'water' && currentStep === 2 && <Droplets size={100} className="text-blue-500 animate-bounce" />}
                              {activeTab === 'wind' && currentStep === 2 && <Wind size={100} className="text-cyan-400 animate-pulse" />}
                              {currentStep < 2 && <div className="animate-spin-slow opacity-20"><Star size={80} /></div>}
                           </div>
                           
                           <h3 className="text-4xl font-black uppercase italic text-slate-800 leading-none">{currentSteps[currentStep].label}</h3>
                           <p className="text-xl font-bold text-blue-600 mt-4 italic max-w-md">"{currentSteps[currentStep].desc}"</p>
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-300">
                          <Activity size={60} strokeWidth={3} className="mb-4 opacity-20" />
                          <p className="font-black uppercase tracking-widest text-sm">Wachten op start...</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CONTROLS (GAME STYLE) */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
                    {!isAnalyzing ? (
                      <>
                        <div className="flex-1 bg-blue-50 p-4 rounded-3xl border-2 border-blue-100 flex items-center gap-4 w-full">
                          <input type="range" value={value} onChange={(e) => setValue(parseInt(e.target.value))} className="w-full h-4 bg-white rounded-full appearance-none accent-yellow-400 cursor-pointer border-2 border-blue-200" />
                          <span className="text-2xl font-black italic text-blue-600 min-w-15">{value}%</span>
                        </div>
                        <button 
                          onClick={startExperiment} 
                          className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-[#22C55E] border-b-8 border-[#15803D] active:border-b-0 active:translate-y-2 text-white text-2xl font-black italic uppercase tracking-widest shadow-lg flex items-center justify-center gap-4 transition-all"
                        >
                          START <Zap size={24} fill="currentColor" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-20 bg-blue-600 rounded-[2rem] flex items-center px-8 gap-6 border-b-8 border-blue-900 shadow-xl">
                        <div className="h-4 flex-1 bg-blue-900/30 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: "0%" }}
                             animate={{ width: `${(currentStep + 1) * 33.3}%` }}
                             transition={{ duration: 5, ease: "linear" }}
                             className="h-full bg-yellow-400 rounded-full" 
                           />
                        </div>
                        <span className="text-lg font-black italic uppercase text-white animate-pulse">Analyseren...</span>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

const content = {
  wind: { title: "Wind & Storm", icon: <Wind size={40} strokeWidth={3} />, text: "Lucht gaat stromen.", color: "from-cyan-400 to-blue-500" },
  wolk: { title: "Bliksem", icon: <Zap size={40} strokeWidth={3} />, text: "Wolken maken stroom.", color: "from-orange-400 to-yellow-500" },
  water: { title: "Regen", icon: <Droplets size={40} strokeWidth={3} />, text: "Water van zee naar wolk.", color: "from-blue-500 to-indigo-600" }
};
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Cloud, Droplets, X, Zap, Gauge, Info, Activity, ChevronRight, Sparkles } from "lucide-react";
import GlobalNavbar from "@/components/GlobalNavbar";

export default function WaaromExperimentPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [value, setValue] = useState(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const experimentFlow = {
    wind: [
      { label: "Opwarmen", desc: "De zon verwarmt de grond. De lucht wordt licht en stijgt op.", icon: <Sparkles className="text-yellow-500" /> },
      { label: "Luchtdrukverschil", desc: "Er ontstaat een 'gat'. Koude lucht begint te stromen.", icon: <Wind className="text-cyan-500" /> },
      { label: "Stroming", desc: "De lucht sjeest nu met volle kracht vooruit. Dit is wind!", icon: <Activity className="text-blue-600" /> }
    ],
    wolk: [
      { label: "Wrijving", desc: "IJskristallen en druppels botsen hard tegen elkaar.", icon: <Activity className="text-orange-500" /> },
      { label: "Opladen", desc: "De wolk bouwt elektriciteit op. Net als je sokken op een tapijt.", icon: <Zap className="text-yellow-600" /> },
      { label: "Ontlading", desc: "BOEM! De energie schiet eruit als een reusachtige vonk.", icon: <Zap className="text-orange-400" /> }
    ],
    water: [
      { label: "Verdamping", desc: "Watermoleculen worden onzichtbaar gas en vliegen omhoog.", icon: <Cloud className="text-blue-400" /> },
      { label: "Condensatie", desc: "De damp koelt af en plakt vast aan stofdeeltjes.", icon: <Droplets className="text-blue-600" /> },
      { label: "Neerslag", desc: "De druppels worden te zwaar en vallen als regen omlaag.", icon: <ChevronRight className="rotate-90 text-indigo-600" /> }
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
    <main className="fixed inset-0 h-screen w-full bg-[#F0F9FF] md:overflow-hidden overflow-y-auto font-sans select-none text-slate-900">
      <GlobalNavbar />

      {/* Padding en gap aangepast voor kleine schermen */}
      <section className="relative z-10 min-h-full flex flex-col md:flex-row items-center px-6 md:px-16 gap-6 md:gap-12 pt-24 pb-32">
        
        {/* Aside: horizontaal op mobiel, verticaal op desktop */}
        <aside className={`flex flex-row md:flex-col gap-4 md:gap-6 transition-all duration-700 shrink-0 ${isAnalyzing ? 'opacity-20 blur-sm -translate-y-4 md:translate-y-0 md:-translate-x-5' : 'opacity-100'}`}>
          {Object.entries(content).map(([key, item]) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setIsAnalyzing(false); }}
              className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center transition-all duration-500 border-2 md:border-4 shadow-xl shrink-0 ${
                activeTab === key ? "bg-white border-blue-600 text-blue-600 scale-110" : "bg-white/80 border-transparent text-slate-300 hover:text-slate-400"
              }`}
            >
              <div className="scale-75 md:scale-100">{item.icon}</div>
            </button>
          ))}
        </aside>

        <div className="flex-1 w-full h-full flex items-center">
          <AnimatePresence mode="wait">
            {!activeTab ? (
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-5xl sm:text-7xl md:text-[10rem] lg:text-[12rem] font-black italic uppercase tracking-tighter text-slate-900 leading-[0.8] mb-10 md:mb-20 text-center md:text-left w-full"
              >
                WAAROM <br/><span className="text-blue-600">WERELD?</span>
              </motion.h1>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-10 h-full items-center">
                
                {/* Info paneel: Kolom breedte aangepast */}
                <div className="lg:col-span-4 w-full space-y-6">
                  <div className="bg-white rounded-3xl md:rounded-[4rem] p-6 md:p-10 shadow-2xl border border-white">
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-2 md:mb-4 tracking-tighter leading-none text-slate-800">{currentContent?.title}</h2>
                    <p className="text-sm md:text-lg font-bold text-slate-500 leading-tight mb-6 md:mb-8">{currentContent?.text}</p>
                    
                    <div className="space-y-3">
                      {currentSteps.map((step, idx) => (
                        <motion.div 
                          key={idx}
                          animate={{ 
                            opacity: isAnalyzing ? (currentStep === idx ? 1 : 0.4) : 0.1,
                            x: isAnalyzing && currentStep === idx ? 10 : 0,
                            scale: isAnalyzing && currentStep === idx ? 1.05 : 1
                          }}
                          className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-3xl transition-all ${currentStep === idx && isAnalyzing ? 'bg-blue-50 border-2 border-blue-200 shadow-md' : 'border-2 border-transparent'}`}
                        >
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                            {idx < currentStep ? <div className="bg-green-500 rounded-full p-1"><Zap size={14} className="text-white" fill="currentColor" /></div> : <div className="scale-75 md:scale-100">{step.icon}</div>}
                          </div>
                          <div>
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Stap {idx + 1}</p>
                            <p className={`text-xs md:text-md font-black italic uppercase leading-none ${currentStep === idx && isAnalyzing ? 'text-blue-600' : 'text-slate-400'}`}>{step.label}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experiment venster: Hoogte aangepast voor mobiel */}
                <div className="lg:col-span-8 w-full bg-white rounded-3xl md:rounded-[5rem] p-4 md:p-8 shadow-2xl border-2 md:border-4 border-white h-[45vh] md:h-[70vh] flex flex-col relative overflow-hidden">
                  
                  <div className={`flex-1 rounded-2xl md:rounded-[4rem] overflow-hidden relative transition-all duration-1000 ${isAnalyzing ? 'bg-linear-to-b from-blue-50 to-white border-2 border-blue-100 shadow-inner' : 'bg-slate-50'}`}>
                    
                    <AnimatePresence mode="wait">
                      {isAnalyzing && (
                        <motion.div 
                          key={`${activeTab}-${currentStep}`}
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 md:p-12 text-center"
                        >
                           <div className="relative mb-4 md:mb-6 h-24 md:h-40 flex items-center justify-center">
                              {activeTab === 'wolk' && currentStep === 2 && (
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3, repeat: Infinity }} className="text-yellow-500">
                                  <Zap size={100} className="md:w-45 md:h-45" fill="currentColor" />
                                </motion.div>
                              )}
                              {activeTab === 'water' && currentStep === 0 && (
                                <motion.div animate={{ y: [0, -30], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                   <Cloud size={80} className="text-blue-300 md:w-32.5 md:h-32.5" />
                                </motion.div>
                              )}
                              {activeTab === 'water' && currentStep === 2 && (
                                <motion.div animate={{ y: [-15, 30] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                                   <div className="flex gap-2 md:gap-4">
                                      <Droplets size={30} className="text-blue-500 md:w-12.5 md:h-12.5" fill="currentColor" />
                                      <Droplets size={30} className="text-blue-400 mt-6 md:w-12.5 md:h-12.5" fill="currentColor" />
                                      <Droplets size={30} className="text-blue-600 md:w-12.5 md:h-12.5" fill="currentColor" />
                                   </div>
                                </motion.div>
                              )}
                              {activeTab === 'wind' && currentStep === 2 && (
                                <motion.div animate={{ x: [-40, 40] }} transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}>
                                   <Wind size={90} className="text-blue-400 opacity-60 md:w-37.5 md:h-37.5" />
                                </motion.div>
                              )}
                           </div>
                           
                           <h3 className="text-2xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">{currentSteps[currentStep].label}</h3>
                           <p className="text-sm md:text-2xl font-bold text-blue-600 mt-2 md:mt-3 italic max-w-xl leading-tight">
                             "{currentSteps[currentStep].desc}"
                           </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Deeltjes animatie */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(15)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: Math.random() * 300 }}
                          animate={{ 
                            y: isAnalyzing 
                              ? (activeTab === 'water' && currentStep === 2 ? [0, 400] : 0) 
                              : 0,
                            opacity: isAnalyzing ? 0.3 : 0.1
                          }}
                          transition={{ 
                            duration: activeTab === 'water' && currentStep === 2 ? 1.2 : 5, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: i * 0.1 
                          }}
                          className="absolute"
                          style={{ left: `${(i * 7)}%`, top: `-10px` }}
                        >
                          <div className={`rounded-full ${isAnalyzing ? 'bg-blue-400 w-4 h-4 md:w-6 md:h-6 blur-sm' : 'bg-slate-300 w-2 h-2 md:w-3 md:h-3'}`} />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Controls: Stacked op mobiel */}
                  <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
                    {!isAnalyzing ? (
                      <>
                        <div className="w-full flex-1 bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border-2 border-white flex items-center gap-4 md:gap-6 shadow-inner">
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 shrink-0 italic">Kracht:</span>
                          <input type="range" value={value} onChange={(e) => setValue(parseInt(e.target.value))} className="w-full h-3 md:h-4 bg-white rounded-full appearance-none accent-blue-500 cursor-pointer border border-slate-200" />
                          <span className="text-lg md:text-2xl font-black italic text-blue-600 w-10 md:w-14">{value}%</span>
                        </div>
                        <button onClick={startExperiment} className={`w-full sm:w-auto px-8 md:px-10 py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] bg-linear-to-r ${currentContent?.color} text-white text-lg md:text-xl font-black italic uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 md:gap-4 hover:scale-105 active:scale-95 transition-all`}>
                          START <Zap size={20} fill="currentColor" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-16 md:h-24 bg-blue-50 rounded-2xl md:rounded-[2.5rem] flex items-center px-6 md:px-10 gap-4 md:gap-8 border-2 md:border-4 border-white shadow-lg">
                        <div className="h-2 md:h-3 flex-1 bg-white rounded-full overflow-hidden border border-blue-100 p-0.5 md:p-1">
                           <motion.div 
                             initial={{ width: "0%" }}
                             animate={{ width: `${(currentStep + 1) * 33.3}%` }}
                             transition={{ duration: 5, ease: "linear" }}
                             className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full shadow-sm" 
                           />
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-blue-600">
                           <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full animate-bounce" />
                           <span className="text-xs md:text-lg font-black italic uppercase tracking-widest whitespace-nowrap">Analyseren...</span>
                        </div>
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
  wind: { title: "Wind & Storm", icon: <Wind size={48} />, text: "Ontdek hoe lucht gaat stromen.", color: "from-cyan-400 to-blue-500" },
  wolk: { title: "Bliksem", icon: <Zap size={48} />, text: "Zie hoe wolken elektriciteit maken.", color: "from-orange-400 to-yellow-500" },
  water: { title: "De Reis", icon: <Droplets size={48} />, text: "Volg het water van zee naar wolk.", color: "from-blue-500 to-indigo-600" }
};
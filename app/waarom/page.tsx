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
    <main className="fixed inset-0 h-screen w-full bg-[#F0F9FF] overflow-hidden font-sans select-none text-slate-900 flex flex-col">
      <GlobalNavbar />

      <section className="relative z-10 flex-1 flex flex-col md:flex-row items-center px-4 sm:px-8 md:px-16 gap-4 md:gap-12 pt-20 md:pt-24 pb-28 md:pb-32 overflow-y-auto md:overflow-hidden">
        
        {/* Aside: Horizontaal op mobiel, verticaal op desktop */}
        <aside className={`flex flex-row md:flex-col gap-3 md:gap-6 transition-all duration-700 shrink-0 z-20 ${isAnalyzing ? 'opacity-20 blur-sm -translate-y-4 md:translate-y-0 md:-translate-x-5' : 'opacity-100'}`}>
          {Object.entries(content).map(([key, item]) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setIsAnalyzing(false); }}
              className={`w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-xl md:rounded-[2.5rem] flex items-center justify-center transition-all duration-500 border-2 md:border-4 shadow-lg md:shadow-xl shrink-0 ${
                activeTab === key ? "bg-white border-blue-600 text-blue-600 scale-110" : "bg-white/80 border-transparent text-slate-300 hover:text-slate-400"
              }`}
            >
              <div className="scale-50 sm:scale-75 md:scale-100">{item.icon}</div>
            </button>
          ))}
        </aside>

        <div className="flex-1 w-full flex items-center h-full">
          <AnimatePresence mode="wait">
            {!activeTab ? (
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-4xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-black italic uppercase tracking-tighter text-slate-900 leading-[0.85] mb-8 md:mb-20 text-center md:text-left w-full"
              >
                WAAROM <br/><span className="text-blue-600">WERELD?</span>
              </motion.h1>
            ) : (
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, x: 30 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -30 }} 
                className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-10 items-center lg:h-[75vh]"
              >
                
                {/* Info paneel */}
                <div className="lg:col-span-4 w-full space-y-4 md:space-y-6">
                  <div className="bg-white rounded-2xl md:rounded-[4rem] p-5 md:p-10 shadow-xl md:shadow-2xl border border-white">
                    <h2 className="text-2xl md:text-5xl font-black italic uppercase mb-1 md:mb-4 tracking-tighter leading-none text-slate-800">{currentContent?.title}</h2>
                    <p className="text-xs md:text-lg font-bold text-slate-500 leading-tight mb-4 md:mb-8">{currentContent?.text}</p>
                    
                    <div className="space-y-2 md:space-y-3">
                      {currentSteps.map((step, idx) => (
                        <motion.div 
                          key={idx}
                          animate={{ 
                            opacity: isAnalyzing ? (currentStep === idx ? 1 : 0.4) : 0.2,
                            x: isAnalyzing && currentStep === idx ? 10 : 0,
                            scale: isAnalyzing && currentStep === idx ? 1.02 : 1
                          }}
                          className={`flex items-center gap-2 md:gap-4 p-2 md:p-4 rounded-xl md:rounded-3xl transition-all ${currentStep === idx && isAnalyzing ? 'bg-blue-50 border-2 border-blue-200' : 'border-2 border-transparent'}`}
                        >
                          <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                            {idx < currentStep ? <Zap size={12} className="text-green-500 md:w-4 md:h-4" fill="currentColor" /> : <div className="scale-50 md:scale-100">{step.icon}</div>}
                          </div>
                          <div>
                            <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Stap {idx + 1}</p>
                            <p className={`text-[10px] md:text-md font-black italic uppercase leading-none ${currentStep === idx && isAnalyzing ? 'text-blue-600' : 'text-slate-400'}`}>{step.label}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experiment venster */}
                <div className="lg:col-span-8 w-full bg-white rounded-2xl md:rounded-[5rem] p-3 md:p-8 shadow-xl md:shadow-2xl border-2 md:border-4 border-white h-[40vh] md:h-full flex flex-col relative overflow-hidden">
                  
                  <div className={`flex-1 rounded-xl md:rounded-[4rem] overflow-hidden relative transition-all duration-1000 ${isAnalyzing ? 'bg-linear-to-b from-blue-50 to-white border-2 border-blue-100' : 'bg-slate-50'}`}>
                    
                    <AnimatePresence mode="wait">
                      {isAnalyzing && (
                        <motion.div 
                          key={`${activeTab}-${currentStep}`}
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          exit={{ opacity: 0, scale: 1.05 }}
                          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-12 text-center"
                        >
                           <div className="relative mb-2 md:mb-6 h-16 md:h-40 flex items-center justify-center">
                              {activeTab === 'wolk' && currentStep === 2 && (
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3, repeat: Infinity }} className="text-yellow-500">
                                  <Zap size={60} className="md:w-32 md:h-32" fill="currentColor" />
                                </motion.div>
                              )}
                              {activeTab === 'water' && currentStep === 0 && (
                                <motion.div animate={{ y: [0, -20], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                   <Cloud size={50} className="text-blue-300 md:w-24 md:h-24" />
                                </motion.div>
                              )}
                              {activeTab === 'water' && currentStep === 2 && (
                                <motion.div animate={{ y: [-10, 20] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="flex gap-2">
                                  <Droplets size={24} className="text-blue-500 md:w-10 md:h-10" fill="currentColor" />
                                  <Droplets size={24} className="text-blue-400 md:w-10 md:h-10 mt-4" fill="currentColor" />
                                </motion.div>
                              )}
                              {activeTab === 'wind' && currentStep === 2 && (
                                <motion.div animate={{ x: [-30, 30] }} transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}>
                                   <Wind size={60} className="text-blue-400 opacity-60 md:w-32 md:h-32" />
                                </motion.div>
                              )}
                           </div>
                           
                           <h3 className="text-lg md:text-5xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">{currentSteps[currentStep].label}</h3>
                           <p className="text-[10px] md:text-2xl font-bold text-blue-600 mt-1 md:mt-3 italic max-w-xl leading-tight">
                             "{currentSteps[currentStep].desc}"
                           </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Deeltjes */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: -20 }}
                          animate={{ 
                            y: isAnalyzing && activeTab === 'water' && currentStep === 2 ? 400 : -20,
                            opacity: isAnalyzing ? 0.2 : 0
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                          className="absolute w-1 h-3 md:w-2 md:h-6 bg-blue-300 rounded-full"
                          style={{ left: `${i * 10}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="mt-3 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-8">
                    {!isAnalyzing ? (
                      <>
                        <div className="w-full flex-1 bg-slate-50 p-3 md:p-6 rounded-xl md:rounded-[2.5rem] border border-slate-100 flex items-center gap-4 shadow-inner">
                          <input type="range" value={value} onChange={(e) => setValue(parseInt(e.target.value))} className="w-full h-2 md:h-4 bg-white rounded-full appearance-none accent-blue-500 cursor-pointer border border-slate-200" />
                          <span className="text-sm md:text-2xl font-black italic text-blue-600 min-w-7.5 md:min-w-15">{value}%</span>
                        </div>
                        <button onClick={startExperiment} className={`w-full sm:w-auto px-6 md:px-10 py-3 md:py-6 rounded-xl md:rounded-[2.5rem] bg-linear-to-r ${currentContent?.color} text-white text-sm md:text-xl font-black italic uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 md:gap-4 hover:scale-105 active:scale-95 transition-all`}>
                          START <Zap size={16} className="md:w-5 md:h-5" fill="currentColor" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-12 md:h-24 bg-blue-50 rounded-xl md:rounded-[2.5rem] flex items-center px-4 md:px-10 gap-3 md:gap-8 border-2 border-white shadow-md">
                        <div className="h-1.5 md:h-3 flex-1 bg-white rounded-full overflow-hidden border border-blue-100">
                           <motion.div 
                             initial={{ width: "0%" }}
                             animate={{ width: `${(currentStep + 1) * 33.3}%` }}
                             transition={{ duration: 5, ease: "linear" }}
                             className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full" 
                           />
                        </div>
                        <span className="text-[10px] md:text-lg font-black italic uppercase text-blue-600 whitespace-nowrap animate-pulse">Analyseren...</span>
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
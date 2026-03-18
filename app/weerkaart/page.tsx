"use client";

import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Search, ZoomIn, ZoomOut, Wind, CloudRain, Thermometer, Navigation, Loader2 } from "lucide-react";
import GlobalNavbar from "@/components/GlobalNavbar"; 

export default function WeerKaartPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const geolocateControl = useRef<maplibregl.GeolocateControl | null>(null);
  
  const [activeLayer, setActiveLayer] = useState("graden");
  const [timeValue, setTimeValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const legendConfig = {
    graden: { 
      title: "Temperatuur", 
      icon: <Thermometer className="w-4 h-4" />, 
      gradient: "from-blue-500 via-yellow-400 to-red-500", 
      labels: ["VRIEZEN", "MILD", "HEET"], 
      colors: ["#3b82f6", "#facc15", "#ef4444"], 
      buttonColor: "bg-orange-500",
      shadowColor: "border-orange-800"
    },
    wind: { 
      title: "Windsnelheid", 
      icon: <Wind className="w-4 h-4" />, 
      gradient: "from-slate-400 via-cyan-300 to-cyan-600", 
      labels: ["STIL", "BRIES", "STORM"], 
      colors: ["#94a3b8", "#67e8f9", "#0891b2"],
      buttonColor: "bg-cyan-500",
      shadowColor: "border-cyan-800"
    },
    regen: { 
      title: "Neerslag", 
      icon: <CloudRain className="w-4 h-4" />, 
      gradient: "from-transparent via-indigo-400 to-purple-900", 
      labels: ["DROOG", "REGEN", "HOOSBUI"], 
      colors: ["rgba(255,255,255,0)", "#818cf8", "#4c1d95"],
      buttonColor: "bg-indigo-600",
      shadowColor: "border-indigo-900"
    }
  };

  const currentLegend = legendConfig[activeLayer as keyof typeof legendConfig];

  const getTimeLabel = (hoursAhead: number) => {
    if (hoursAhead === 0) return "NU";
    const now = new Date();
    const futureDate = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
    const hours = futureDate.getHours().toString().padStart(2, '0');
    return `${hours}:00`;
  };

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    const layerId = 'weather-overlay';
    if (map.current.getLayer(layerId)) {
      map.current.setPaintProperty(layerId, 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', 'lat', ['literal', {lat: 50}]],
        48, currentLegend.colors[2],
        51, currentLegend.colors[1],
        54, currentLegend.colors[0]
      ]);
      map.current.setPaintProperty(layerId, 'fill-opacity', 0.2 + (timeValue / 60));
    }
  }, [activeLayer, timeValue]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [4.4699, 50.5039],
      zoom: 8,
      pitch: 45,
      bearing: -10,
    });

    map.current.on('load', () => {
      map.current?.addSource('weather-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: { lat: 45 }, geometry: { type: 'Polygon', coordinates: [[[-20, 45], [20, 45], [20, 48], [-20, 48], [-20, 45]]] } },
            { type: 'Feature', properties: { lat: 50 }, geometry: { type: 'Polygon', coordinates: [[[-20, 48], [20, 48], [20, 52], [-20, 52], [-20, 48]]] } },
            { type: 'Feature', properties: { lat: 55 }, geometry: { type: 'Polygon', coordinates: [[[-20, 52], [20, 52], [20, 60], [-20, 60], [-20, 52]]] } }
          ]
        }
      });
      map.current?.addLayer({
        id: 'weather-overlay',
        type: 'fill',
        source: 'weather-source',
        paint: {
          'fill-color': currentLegend.colors[1],
          'fill-opacity': 0.4,
          'fill-antialias': true
        }
      });
    });

    geolocateControl.current = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true
    });
    map.current.addControl(geolocateControl.current);
    return () => map.current?.remove();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || !map.current) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      if (data && data[0]) {
        const coords: [number, number] = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        if (marker.current) marker.current.remove();
        marker.current = new maplibregl.Marker({ color: '#facc15' }).setLngLat(coords).addTo(map.current);
        map.current.flyTo({ center: coords, zoom: 17, duration: 3000 });
      }
    } finally { setIsSearching(false); }
  };

  return (
    <main className="fixed inset-0 h-screen w-full bg-[#3B82F6] overflow-hidden font-sans select-none flex flex-col">
      <style jsx global>{`
        .maplibregl-ctrl-geolocate { display: none !important; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none; width: 32px; height: 32px; background: #facc15; border: 4px solid white; border-radius: 12px; cursor: pointer; box-shadow: 0 0 20px rgba(250,204,21,0.6);
        }
      `}</style>

      <section className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        {/* --- HEADER & SEARCH (Arcade Style) --- */}
        <div className="absolute top-6 left-4 md:top-10 md:left-10 z-20 w-[calc(100%-2rem)] md:max-w-lg pointer-events-none">
          <h1 className="text-4xl md:text-7xl font-black italic uppercase text-white tracking-tighter drop-shadow-[0_6px_0_rgba(0,0,0,0.3)] mb-4 md:mb-6">
            WEER <span className="text-yellow-400">KAART</span>
          </h1>
          <form onSubmit={handleSearch} className="flex items-center bg-[#1E40AF] shadow-[0_12px_0_rgba(0,0,0,0.2)] rounded-3xl px-6 py-4 md:px-8 md:py-5 border-4 border-white pointer-events-auto transition-transform active:translate-y-1">
            {isSearching ? <Loader2 className="w-6 h-6 text-yellow-400 mr-4 animate-spin" /> : <Search className="w-6 h-6 text-yellow-400 mr-4" strokeWidth={3} />}
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ZOEK JE SCHOOL...
            " className="bg-transparent outline-none text-base md:text-xl font-black uppercase tracking-wider w-full text-white placeholder:text-blue-300/50" />
          </form>
        </div>

        {/* --- LAYER SWITCHER (Side Buttons) --- */}
        <div className="absolute left-4 bottom-36 md:left-10 md:top-1/2 md:-translate-y-1/2 flex flex-row md:flex-col gap-4 z-40">
          {(Object.entries(legendConfig)).map(([key, config]) => {
            const Icon = (config.icon as any).type;
            const isActive = activeLayer === key;
            return (
              <button 
                key={key}
                onClick={() => setActiveLayer(key)}
                className={`p-4 md:p-6 rounded-[2rem] transition-all duration-200 border-4 border-white ${
                  isActive 
                    ? `${config.buttonColor} ${config.shadowColor} border-b-10 scale-110 text-white` 
                    : 'bg-[#1E40AF]/80 backdrop-blur-md text-blue-200 border-b-4 border-black/20 hover:bg-[#1E40AF]'
                }`}
              >
                <Icon className="w-7 h-7 md:w-9 md:h-9" strokeWidth={3} />
              </button>
            );
          })}
        </div>

        {/* --- ZOOM & LOCATIE (Right Side) --- */}
        <div className="absolute right-4 top-6 md:right-10 md:top-10 z-40 flex flex-col gap-4">
          <button onClick={() => map.current?.zoomIn()} className="p-4 bg-white rounded-2xl shadow-xl text-blue-600 border-b-8 border-slate-200 active:border-b-0 active:translate-y-1 transition-all"><ZoomIn className="w-7 h-7" strokeWidth={3} /></button>
          <button onClick={() => map.current?.zoomOut()} className="p-4 bg-white rounded-2xl shadow-xl text-blue-600 border-b-8 border-slate-200 active:border-b-0 active:translate-y-1 transition-all"><ZoomOut className="w-7 h-7" strokeWidth={3} /></button>
          <button onClick={() => geolocateControl.current?.trigger()} className="p-4 bg-yellow-400 rounded-2xl shadow-xl text-black border-b-8 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all"><Navigation className="w-7 h-7" fill="currentColor" /></button>
        </div>

        {/* --- DYNAMISCHE LEGENDE (Arcade Card) --- */}
        <div className="hidden sm:block absolute right-4 bottom-36 md:right-10 md:bottom-48 z-30 bg-[#1E40AF] p-6 rounded-[3rem] shadow-[0_15px_0_rgba(0,0,0,0.2)] border-4 border-white w-64 md:w-72">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-xl text-yellow-400">{currentLegend.icon}</div>
            <span className="text-xs font-black uppercase tracking-widest text-white">{currentLegend.title}</span>
          </div>
          <div className={`relative h-5 w-full rounded-xl bg-linear-to-r ${currentLegend.gradient} border-2 border-white shadow-inner`}>
             <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
          </div>
          <div className="flex justify-between text-[10px] font-black text-blue-100 mt-3 tracking-tighter italic">
            {currentLegend.labels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>

        {/* --- TIJD-SLIDER (Neon Controller) --- */}
        <div className="absolute bottom-24 md:bottom-36 left-1/2 -translate-x-1/2 w-[85%] max-w-2xl z-50 flex flex-col items-center gap-6">
          <div className="w-full bg-black/40 backdrop-blur-md p-4 rounded-3xl border-2 border-white/20 shadow-2xl">
            <input 
                type="range" 
                min="0" 
                max="23" 
                value={timeValue} 
                onChange={(e) => setTimeValue(parseInt(e.target.value))} 
                className="w-full h-4 bg-blue-900 rounded-full appearance-none cursor-pointer outline-none border-2 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.3)]" 
            />
          </div>
          <div className="bg-yellow-400 px-12 py-3 rounded-2xl shadow-[0_10px_0_rgba(161,98,7,1)] border-4 border-white min-w-40 text-center transform -rotate-1">
            <span className="text-3xl font-black tracking-tighter text-black italic tabular-nums">
              {getTimeLabel(timeValue)}
            </span>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 w-full z-100">
        <GlobalNavbar />
      </div>
    </main>
  );
}
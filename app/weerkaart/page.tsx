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
  const [timeValue, setTimeValue] = useState(0); // 0 tot 23 uur vooruit
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const legendConfig = {
    graden: { 
      title: "Temperatuur", 
      icon: <Thermometer size={16} className="text-orange-500" />, 
      gradient: "from-[#3b82f6] via-[#facc15] to-[#ef4444]", 
      labels: ["KOUD", "MILD", "HEET"], 
      colors: ["#3b82f6", "#facc15", "#ef4444"], 
      buttonColor: "bg-orange-500"
    },
    wind: { 
      title: "Windsnelheid", 
      icon: <Wind size={16} className="text-cyan-500" />, 
      gradient: "from-slate-100 via-cyan-200 to-cyan-600", 
      labels: ["STIL", "BRIES", "STORM"], 
      colors: ["#f1f5f9", "#a5f3fc", "#0891b2"],
      buttonColor: "bg-cyan-500"
    },
    regen: { 
      title: "Neerslag", 
      icon: <CloudRain size={16} className="text-indigo-500" />, 
      gradient: "from-transparent via-blue-300 to-indigo-900", 
      labels: ["DROOG", "REGEN", "HOOSBUI"], 
      colors: ["rgba(255,255,255,0)", "#93c5fd", "#312e81"],
      buttonColor: "bg-indigo-600"
    }
  };

  const currentLegend = legendConfig[activeLayer as keyof typeof legendConfig];

  // Berekent de tijdstempel: Huidige tijd + het aantal geselecteerde uren
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
      // Opacity schommelt nu op basis van de 24-uurs cyclus
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
          'fill-opacity': 0.3,
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
        marker.current = new maplibregl.Marker().setLngLat(coords).addTo(map.current);
        map.current.flyTo({ center: coords, zoom: 17, duration: 4000 });
      }
    } finally { setIsSearching(false); }
  };

  return (
    <main className="fixed inset-0 h-screen w-full bg-slate-50 overflow-hidden font-sans select-none flex flex-col">
      <style jsx global>{`
        .maplibregl-ctrl-geolocate { display: none !important; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none; width: 28px; height: 28px; background: white; border: 4px solid #2563eb; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
      `}</style>

      <section className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        {/* LAYER SWITCHER LINKS */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40">
          {(Object.entries(legendConfig)).map(([key, config]) => {
            const Icon = (config.icon as any).type;
            const isActive = activeLayer === key;
            return (
              <button 
                key={key}
                onClick={() => setActiveLayer(key)}
                className={`p-5 rounded-[2.2rem] transition-all duration-300 shadow-2xl border-2 ${
                  isActive ? `${config.buttonColor} text-white border-white scale-110 shadow-blue-500/20` : 'bg-white/90 backdrop-blur-md text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                <Icon size={32} strokeWidth={2.5} />
              </button>
            );
          })}
        </div>

        {/* HEADER & SEARCH */}
        <div className="absolute top-10 left-10 z-20 w-full max-w-lg pointer-events-none text-left">
          <h1 className="text-6xl font-black italic uppercase text-slate-900 tracking-tighter drop-shadow-2xl mb-6">Mijn Wereld</h1>
          <form onSubmit={handleSearch} className="flex items-center bg-white/95 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] px-8 py-6 border border-white pointer-events-auto transition-transform focus-within:scale-[1.02]">
            {isSearching ? <Loader2 size={26} className="text-blue-500 mr-4 animate-spin" /> : <Search size={26} className="text-blue-500 mr-4" />}
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ZOEK JE EIGEN SCHOOL..." className="bg-transparent outline-none text-lg font-bold uppercase tracking-widest w-full text-slate-700 placeholder:text-slate-300" />
          </form>
        </div>

        {/* ZOOM & LOCATIE CONTROLS */}
        <div className="absolute right-6 top-10 z-40 flex flex-col gap-3">
          <button onClick={() => map.current?.zoomIn()} className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><ZoomIn size={24} /></button>
          <button onClick={() => map.current?.zoomOut()} className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><ZoomOut size={24} /></button>
          <button onClick={() => geolocateControl.current?.trigger()} className="p-4 bg-blue-600 rounded-2xl shadow-xl text-white hover:scale-110 transition-all"><Navigation size={24} fill="currentColor" /></button>
        </div>

        {/* DYNAMISCHE LEGENDE */}
        <div className="absolute right-6 bottom-48 z-30 bg-white/90 backdrop-blur-2xl p-7 rounded-[3rem] shadow-2xl border border-white w-72 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-slate-50 rounded-xl">{currentLegend.icon}</div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{currentLegend.title}</span>
          </div>
          <div className={`relative h-4 w-full rounded-full bg-linear-to-r ${currentLegend.gradient} shadow-inner`}>
             <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
          </div>
          <div className="flex justify-between text-[10px] font-black text-slate-400 mt-3 tracking-widest">
            {currentLegend.labels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>

        {/* TIJD-SLIDER (24 UUR) */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-[85%] max-w-175 z-50 flex flex-col items-center gap-6">
          <input 
            type="range" 
            min="0" 
            max="23" 
            value={timeValue} 
            onChange={(e) => setTimeValue(parseInt(e.target.value))} 
            className="w-full h-3 bg-white/30 backdrop-blur-md rounded-full appearance-none cursor-pointer outline-none border border-white/20 shadow-lg" 
          />
          <div className="bg-white/90 backdrop-blur-xl px-12 py-3 rounded-full shadow-2xl border border-white min-w-40 text-center">
            <span className="text-2xl font-black tracking-[0.2em] text-blue-600 tabular-nums">
              {getTimeLabel(timeValue)}
            </span>
          </div>
        </div>
      </section>

      <GlobalNavbar />
    </main>
  );
}
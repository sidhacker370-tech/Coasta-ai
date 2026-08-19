import React, { useState, useEffect, useRef } from 'react';
import { PRESET_COASTAL_SECTORS } from '../../api/coastalDatabase';

const STORAGE_KEY = 'coast_ai_search_history';

const DEFAULT_INDIAN_HISTORY = [
  { name: "Bhubaneswar Smart City, Odisha, India", lat: 20.2961, lng: 85.8245, type: "Capital Megacity & Daya Basin", timestamp: Date.now() - 2000 },
  { name: "Cuttack Millennium City, Odisha, India", lat: 20.4625, lng: 85.8830, type: "Historic Mahanadi Delta Island", timestamp: Date.now() - 5000 },
  { name: "New Delhi National Capital, India", lat: 28.6139, lng: 77.2090, type: "National Capital & Yamuna Basin", timestamp: Date.now() - 10000 },
  { name: "Bengaluru Tech Corridor, Karnataka, India", lat: 12.9716, lng: 77.5946, type: "Plateau Tech Watershed", timestamp: Date.now() - 15000 },
  { name: "Puri Swargadwar Beachfront, Odisha, India", lat: 19.8000, lng: 85.8312, type: "Odisha Coastal Reach", timestamp: Date.now() - 20000 },
  { name: "Pentha Beach (Kendrapara), Odisha, India", lat: 20.5300, lng: 86.9300, type: "Critical Geotube Barrier", timestamp: Date.now() - 25000 },
  { name: "Chilika Lagoon Sea Mouth (Satapada), Odisha, India", lat: 19.6800, lng: 85.4500, type: "Lagoon Spit / Ramsar Site", timestamp: Date.now() - 30000 },
  { name: "Paradip Port & Mahanadi Confluence, Odisha, India", lat: 20.2700, lng: 86.6800, type: "Major Estuarine Harbor", timestamp: Date.now() - 35000 }
];

export default function LocationSearchBar({ onSelectLocation, onActivateSector, activeSectorName }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : DEFAULT_INDIAN_HISTORY;
    } catch {
      return DEFAULT_INDIAN_HISTORY;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' | 'history' | 'observatories'
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 12)));
    } catch (err) {
      console.warn('Could not save search history:', err);
    }
  }, [history]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToHistory = (item) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.name !== item.name);
      return [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 12);
    });
  };

  const clearHistory = (e) => {
    e.stopPropagation();
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Debounced search with OpenStreetMap Nominatim
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    setActiveTab('suggestions');

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=7`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setResults(
            data.map(item => ({
              id: `geo-${item.place_id}`,
              name: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              type: item.type || 'Coastal / Geographic Region'
            }))
          );
        }
      } catch (err) {
        console.warn('Geocoding search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelectResult(results[0]);
      }
    }
  };

  const handleSelectPreset = (key) => {
    const sector = PRESET_COASTAL_SECTORS[key];
    if (sector) {
      const locObj = {
        name: sector.name,
        lat: sector.center[0],
        lng: sector.center[1],
        type: sector.coastal_type
      };
      saveToHistory(locObj);
      setQuery(sector.name.split(',')[0]);
      setIsOpen(false);
      if (onActivateSector) onActivateSector(sector);
    }
  };

  const handleSelectResult = (loc) => {
    saveToHistory(loc);
    setQuery(loc.name.split(',')[0]);
    setIsOpen(false);
    if (onSelectLocation) onSelectLocation(loc);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={dropdownRef} className="relative w-80 sm:w-96 md:w-[480px] text-xs font-mono select-none z-[2500]">
      {/* Search Input Bar (High Visibility) */}
      <div className="relative flex items-center bg-slate-900/98 border-2 border-cyan-500 hover:border-cyan-400 focus-within:border-cyan-300 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition">
        <div className="pl-3.5 text-cyan-400 flex items-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search coastal site (e.g. Puri, Pentha, Chilika, Paradip)..."
          className="w-full bg-transparent px-3 py-2.5 text-slate-100 placeholder-slate-400 text-xs focus:outline-hidden font-mono"
        />

        {isLoading ? (
          <div className="pr-3 flex items-center">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : query ? (
          <button
            onClick={handleClear}
            className="pr-2 text-slate-400 hover:text-slate-200 transition text-sm font-bold"
            title="Clear search"
          >
            ✕
          </button>
        ) : null}

        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pr-3.5 pl-1 text-cyan-400 hover:text-cyan-300 transition text-xs font-bold flex items-center space-x-1"
          title="Toggle search history & observatories"
        >
          <span className="text-[10px] hidden sm:inline">EXPLORE</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Persistent Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/98 border-2 border-cyan-500/60 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden z-[2600] max-h-[440px] flex flex-col divide-y divide-slate-800">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between bg-slate-900/90 px-2 py-1.5 text-[11px] font-bold border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-2.5 py-1 rounded transition ${
                  activeTab === 'suggestions'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔍 Search {results.length > 0 ? `(${results.length})` : ''}
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
                  activeTab === 'history'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🕒 Odisha &amp; History</span>
                {history.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] flex items-center justify-center text-cyan-400">
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('observatories')}
                className={`px-2.5 py-1 rounded transition ${
                  activeTab === 'observatories'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌊 Observatories
              </button>
            </div>

            {activeTab === 'history' && history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-red-400 hover:text-red-300 px-1.5 py-0.5 rounded hover:bg-red-950/40 transition"
              >
                Reset
              </button>
            )}
          </div>

          {/* Tab Content Area */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-800/60 max-h-72">
            {/* 1. Geocoded Search Results */}
            {activeTab === 'suggestions' && (
              <div>
                {results.length > 0 ? (
                  results.map((loc, idx) => (
                    <button
                      key={`result-${idx}`}
                      onClick={() => handleSelectResult(loc)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-cyan-950/50 transition flex items-center justify-between group border-b border-slate-800/40"
                    >
                      <div className="truncate pr-2">
                        <span className="text-slate-100 font-semibold text-[11px] block truncate group-hover:text-cyan-300">
                          {loc.name}
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase">
                          {loc.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-400/90 font-mono shrink-0 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {loc.lat.toFixed(2)}°N, {loc.lng.toFixed(2)}°E
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs space-y-1">
                    <p className="font-semibold text-slate-300">Type any Indian or global coastal location.</p>
                    <p className="text-[10px] text-slate-500">e.g. Puri, Pentha, Chilika, Gopalpur, Paradip, Chandipur, Mumbai, Chennai.</p>
                  </div>
                )}
              </div>
            )}

            {/* 2. Recent Search History (Pre-seeded with Odisha sites) */}
            {activeTab === 'history' && (
              <div>
                {history.length > 0 ? (
                  history.map((loc, idx) => (
                    <button
                      key={`hist-${idx}`}
                      onClick={() => handleSelectResult(loc)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 transition flex items-center justify-between group border-b border-slate-800/40"
                    >
                      <div className="truncate pr-2 flex items-center space-x-2">
                        <span className="text-cyan-400 text-xs">📍</span>
                        <div className="truncate">
                          <span className="text-slate-200 font-medium text-[11px] block truncate group-hover:text-cyan-300">
                            {loc.name}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {loc.type || 'Coastal Site'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {loc.lat?.toFixed(2)}°N, {loc.lng?.toFixed(2)}°E
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 text-xs">
                    No recent search history.
                  </div>
                )}
              </div>
            )}

            {/* 3. Major Indian & Global Coastal Observatories */}
            {activeTab === 'observatories' && (
              <div>
                {Object.entries(PRESET_COASTAL_SECTORS).map(([key, sector]) => (
                  <button
                    key={`preset-${key}`}
                    onClick={() => handleSelectPreset(key)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 transition flex items-center justify-between group border-b border-slate-800/40"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-100 text-[11px] font-bold group-hover:text-cyan-300">
                          {sector.name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          sector.risk.classification === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                          sector.risk.classification === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {sector.risk.classification}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {sector.region} • {sector.coastal_type}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400/80 font-mono shrink-0 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {sector.center[0].toFixed(2)}°N, {sector.center[1].toFixed(2)}°E
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';

/**
 * TemporalSlider provides scrubber controls, discrete epoch marks, and auto-playback.
 */
export default function TemporalSlider({
  periods = [],
  selectedPeriod,
  onSelectPeriod
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef(null);

  const currentIndex = periods.findIndex(p => p.id === selectedPeriod);
  const safeIndex = currentIndex >= 0 ? currentIndex : periods.length - 1;
  const currentPeriodObj = periods[safeIndex] || {};

  // Auto-play animation cycle through periods
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        onSelectPeriod(prev => {
          const idx = periods.findIndex(p => p.id === prev);
          const nextIdx = (idx + 1) % periods.length;
          return periods[nextIdx]?.id;
        });
      }, 2000);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, periods, onSelectPeriod]);

  const handleStep = (direction) => {
    setIsPlaying(false);
    const nextIdx = safeIndex + direction;
    if (nextIdx >= 0 && nextIdx < periods.length) {
      onSelectPeriod(periods[nextIdx].id);
    }
  };

  return (
    <div className="space-y-2">
      {/* Slider Track & Marks */}
      <div className="relative pt-2 pb-1">
        <input
          type="range"
          min="0"
          max={Math.max(0, periods.length - 1)}
          value={safeIndex}
          onChange={(e) => {
            setIsPlaying(false);
            const idx = parseInt(e.target.value, 10);
            if (periods[idx]) onSelectPeriod(periods[idx].id);
          }}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-hidden"
        />

        {/* Epoch Ticks / Labels */}
        <div className="flex justify-between items-center mt-2 px-1">
          {periods.map((p, idx) => {
            const isSelected = p.id === selectedPeriod;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setIsPlaying(false);
                  onSelectPeriod(p.id);
                }}
                className={`flex flex-col items-center group transition ${
                  isSelected ? 'text-cyan-300 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full mb-1 transition ${
                  isSelected 
                    ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]' 
                    : p.is_baseline 
                    ? 'bg-purple-500' 
                    : 'bg-slate-700 group-hover:bg-slate-500'
                }`} />
                <span className="text-[10px] font-mono tracking-tight">{p.year || p.id}</span>
                {p.is_baseline && (
                  <span className="text-[8px] text-purple-400 uppercase -mt-0.5">BASE</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Buttons & Telemetry Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs font-mono">
        {/* Playback Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => handleStep(-1)}
            disabled={safeIndex === 0}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 rounded text-[11px] transition"
            title="Previous Epoch"
          >
            ◀ Prev
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
            }`}
          >
            <span>{isPlaying ? '⏸ Pause' : '▶ Play Time-Lapse'}</span>
          </button>

          <button
            onClick={() => handleStep(1)}
            disabled={safeIndex === periods.length - 1}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 rounded text-[11px] transition"
            title="Next Epoch"
          >
            Next ▶
          </button>
        </div>

        {/* Selected Period Metadata */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span>SURVEY DATE: <strong className="text-slate-200">{currentPeriodObj.date || '2026-06-15'}</strong></span>
          <span className="text-slate-700">|</span>
          <span>PLATFORM: <strong className="text-cyan-400">{currentPeriodObj.sensor || 'Sentinel-2 MSI'}</strong></span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function Header({ studyArea, isDemo }) {
  const [timeUtc, setTimeUtc] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-slate-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between select-none z-30 shrink-0 backdrop-blur-md">
      {/* Brand & Platform Identity */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-sm shadow-cyan-500/10">
          <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12c.6.5 1.2.8 2.5.8 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.2 0 1.9.3 2.5.8M2 18c.6.5 1.2.8 2.5.8 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.2 0 1.9.3 2.5.8" />
            <circle cx="12" cy="6" r="2" />
          </svg>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-extrabold tracking-wider text-slate-100">COAST-AI</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              INDIA EO COMMAND
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight">
            Autonomous Coastal Geomorphology & Cyclone Early-Warning Platform
          </p>
        </div>
      </div>

      {/* Target Observatory / Study Area Header Info */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">OBSERVATORY:</span>
          <span className="text-cyan-300 font-semibold truncate max-w-xs">
            {studyArea?.name || 'Odisha Coastal Observatory (Bay of Bengal)'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">SENSOR:</span>
          <span className="text-emerald-400">Sentinel-2 + Oceansat-3</span>
        </div>
      </div>

      {/* Telemetry & System Status */}
      <div className="flex items-center space-x-3 text-xs font-mono">
        {/* UTC Time */}
        <div className="hidden lg:flex items-center space-x-1.5 text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>{timeUtc || 'UTC TIME'}</span>
        </div>

        {/* Demo vs Live Badge */}
        <div className="flex items-center">
          {isDemo ? (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-950/70 border border-amber-500/50 text-amber-300 text-[11px] font-bold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>DEMONSTRATION DATA</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE TELEMETRY</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

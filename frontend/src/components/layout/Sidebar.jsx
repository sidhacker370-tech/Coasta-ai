import React, { useState } from 'react';

/**
 * Sidebar component holding stacked, collapsible analytical panels.
 */
export default function Sidebar({
  warningsPanel,
  riskScorePanel,
  priorityRankingList,
  situationSummaryPanel,
  beforeAfterPanel
}) {
  const [collapsed, setCollapsed] = useState({
    warnings: false,
    risk: false,
    zones: false,
    summary: false,
    comparison: false
  });

  const toggle = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-full lg:w-[440px] xl:w-[480px] bg-slate-950/95 border-l border-slate-800/80 flex flex-col h-full overflow-hidden z-20 shrink-0">
      {/* Sidebar Header Bar */}
      <div className="h-10 px-4 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono select-none">
        <span className="text-slate-300 font-semibold flex items-center space-x-2">
          <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
          <span>ANALYTICAL TELEMETRY PANELS</span>
        </span>
        <span className="text-[10px] text-slate-500">REAL-TIME INFERENCE</span>
      </div>

      {/* Scrollable Stack of Panels */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-3 space-y-3">
        {/* 1. Early-Warning Triggers */}
        <section className="bg-slate-900/60 rounded border border-slate-800/90 overflow-hidden shadow-sm">
          <button
            onClick={() => toggle('warnings')}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between text-left transition border-b border-slate-800/50"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <h2 className="text-xs font-bold font-mono tracking-wide text-slate-200 uppercase">
                Early-Warning Triggers
              </h2>
            </div>
            <span className="text-slate-500 text-xs font-mono">
              {collapsed.warnings ? '+' : '−'}
            </span>
          </button>
          {!collapsed.warnings && (
            <div className="p-3">
              {warningsPanel}
            </div>
          )}
        </section>

        {/* 2. Coastal Vulnerability & Risk Panel */}
        <section className="bg-slate-900/60 rounded border border-slate-800/90 overflow-hidden shadow-sm">
          <button
            onClick={() => toggle('risk')}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between text-left transition border-b border-slate-800/50"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <h2 className="text-xs font-bold font-mono tracking-wide text-slate-200 uppercase">
                Geomorphic Risk & Factor Breakdown
              </h2>
            </div>
            <span className="text-slate-500 text-xs font-mono">
              {collapsed.risk ? '+' : '−'}
            </span>
          </button>
          {!collapsed.risk && (
            <div className="p-3">
              {riskScorePanel}
            </div>
          )}
        </section>

        {/* 3. Priority / Zone Ranking */}
        <section className="bg-slate-900/60 rounded border border-slate-800/90 overflow-hidden shadow-sm">
          <button
            onClick={() => toggle('zones')}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between text-left transition border-b border-slate-800/50"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <h2 className="text-xs font-bold font-mono tracking-wide text-slate-200 uppercase">
                Priority Zone Ranking
              </h2>
            </div>
            <span className="text-slate-500 text-xs font-mono">
              {collapsed.zones ? '+' : '−'}
            </span>
          </button>
          {!collapsed.zones && (
            <div className="p-3">
              {priorityRankingList}
            </div>
          )}
        </section>

        {/* 4. Dual-Period Comparison Controls */}
        <section className="bg-slate-900/60 rounded border border-slate-800/90 overflow-hidden shadow-sm">
          <button
            onClick={() => toggle('comparison')}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between text-left transition border-b border-slate-800/50"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="12" r="3" />
                <line x1="9" y1="12" x2="15" y2="12" />
              </svg>
              <h2 className="text-xs font-bold font-mono tracking-wide text-slate-200 uppercase">
                Before-vs-After Comparison
              </h2>
            </div>
            <span className="text-slate-500 text-xs font-mono">
              {collapsed.comparison ? '+' : '−'}
            </span>
          </button>
          {!collapsed.comparison && (
            <div className="p-3">
              {beforeAfterPanel}
            </div>
          )}
        </section>

        {/* 5. Automatic Situation Summary */}
        <section className="bg-slate-900/60 rounded border border-slate-800/90 overflow-hidden shadow-sm">
          <button
            onClick={() => toggle('summary')}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between text-left transition border-b border-slate-800/50"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <h2 className="text-xs font-bold font-mono tracking-wide text-slate-200 uppercase">
                Automatic Situation Summary
              </h2>
            </div>
            <span className="text-slate-500 text-xs font-mono">
              {collapsed.summary ? '+' : '−'}
            </span>
          </button>
          {!collapsed.summary && (
            <div className="p-3">
              {situationSummaryPanel}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

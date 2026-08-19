import React from 'react';
import { useTimeline } from '../../context/TimelineContext';

/**
 * BeforeAfterPanel enables dual-period geomorphic comparison
 * and triggers dual-layer overlay on the map.
 */
export default function BeforeAfterPanel({ changeMetrics }) {
  const {
    periods,
    fromPeriod,
    setFromPeriod,
    toPeriod,
    setToPeriod,
    layerVisibility,
    toggleLayer
  } = useTimeline();

  const presets = [
    { label: "8-Year Trend (2018 Baseline vs 2026)", from: "2018", to: "2026" },
    { label: "Post-Storm Recovery (2022 vs 2026)", from: "2022", to: "2026" },
    { label: "Recent Bi-Annual (2024 vs 2026)", from: "2024", to: "2026" }
  ];

  return (
    <div className="space-y-3 font-mono text-xs text-slate-300">
      {/* Dropdowns for Dual Periods */}
      <div className="grid grid-cols-2 gap-2">
        {/* From / Baseline Epoch */}
        <div className="space-y-1">
          <label className="text-[10px] text-purple-400 font-semibold uppercase flex items-center space-x-1">
            <span className="w-2 h-2 rounded-xs bg-purple-400 inline-block"></span>
            <span>Baseline (From):</span>
          </label>
          <select
            value={fromPeriod}
            onChange={(e) => setFromPeriod(e.target.value)}
            className="w-full bg-slate-900 border border-purple-500/50 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-purple-400"
          >
            {periods.map(p => (
              <option key={`from-${p.id}`} value={p.id}>
                {p.label || p.id}
              </option>
            ))}
          </select>
        </div>

        {/* To / Target Epoch */}
        <div className="space-y-1">
          <label className="text-[10px] text-cyan-400 font-semibold uppercase flex items-center space-x-1">
            <span className="w-2 h-2 rounded-xs bg-cyan-400 inline-block"></span>
            <span>Target (To):</span>
          </label>
          <select
            value={toPeriod}
            onChange={(e) => setToPeriod(e.target.value)}
            className="w-full bg-slate-900 border border-cyan-500/50 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-400"
          >
            {periods.map(p => (
              <option key={`to-${p.id}`} value={p.id}>
                {p.label || p.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Baseline Overlay Layer Toggle */}
      <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-purple-400 inline-block"></span>
          <span className="text-[11px] text-slate-200">Overlay Baseline Shoreline on Map</span>
        </div>
        <button
          onClick={() => toggleLayer('baselineOverlay')}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
            layerVisibility.baselineOverlay
              ? 'bg-purple-950 text-purple-300 border border-purple-500'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {layerVisibility.baselineOverlay ? 'ENABLED' : 'DISABLED'}
        </button>
      </div>

      {/* Preset Quick-Buttons */}
      <div className="space-y-1 pt-1">
        <span className="text-[10px] text-slate-500 uppercase font-semibold">Comparison Presets:</span>
        <div className="flex flex-col space-y-1">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFromPeriod(preset.from);
                setToPeriod(preset.to);
              }}
              className="text-left px-2 py-1 bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 rounded text-[10px] text-slate-300 hover:text-cyan-300 transition"
            >
              • {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delta Metrics Summary */}
      {changeMetrics && (
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1.5 text-[11px]">
          <div className="text-slate-400 font-semibold text-[10px] uppercase border-b border-slate-800 pb-1">
            Observed Geomorphic Delta ({fromPeriod} ➔ {toPeriod})
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Net Sediment Loss:</span>
              <span className="text-red-400 font-bold text-sm">
                -{changeMetrics.net_loss_sq_km || '1.48'} km²
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Max Shoreline Retreat:</span>
              <span className="text-red-400 font-bold text-sm">
                {changeMetrics.max_retreat_m || '38.6'} m
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Mean Retreat Rate:</span>
              <span className="text-amber-400 font-bold text-xs">
                {changeMetrics.avg_rate_m_yr || '3.85'} m/yr
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Active Erosion Front:</span>
              <span className="text-red-400 font-bold text-xs">
                {changeMetrics.erosion_length_km || '26.4'} km
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

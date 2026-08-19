import React from 'react';

/**
 * Comprehensive GIS overlay map legend covering all active layers.
 */
export default function MapLegend({ layerVisibility }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3 text-xs font-mono text-slate-200 shadow-xl backdrop-blur-md space-y-2.5 max-w-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <span className="font-bold text-[11px] text-cyan-400 tracking-wider flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-sm bg-cyan-400"></span>
          <span>GIS LAYER LEGEND</span>
        </span>
        <span className="text-[10px] text-slate-400">WGS84</span>
      </div>

      {/* Coastline Shoreline */}
      {layerVisibility.coastline && (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-0.5 bg-cyan-400 rounded-full inline-block shadow-[0_0_8px_#38bdf8]"></span>
            <span className="text-[11px] text-slate-300">Active Shoreline (Selected Period)</span>
          </div>
          {layerVisibility.baselineOverlay && (
            <div className="flex items-center space-x-2">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-purple-400 inline-block"></span>
              <span className="text-[11px] text-purple-300">2018 Baseline Reference</span>
            </div>
          )}
        </div>
      )}

      {/* Change Layers */}
      {layerVisibility.change && (
        <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Change Vectors</span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-red-500/50 border border-red-400 rounded-xs"></span>
              <span className="text-red-400">Erosion (Loss)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-emerald-500/50 border border-emerald-400 rounded-xs"></span>
              <span className="text-emerald-400">Accretion (Gain)</span>
            </div>
          </div>
        </div>
      )}

      {/* Risk Classification Heatmap */}
      {layerVisibility.heatmap && (
        <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Geomorphic Risk Score</span>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">LOW (&lt;40)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">MODERATE (40-69)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-slate-300">HIGH (70-84)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-300">CRITICAL (≥85)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

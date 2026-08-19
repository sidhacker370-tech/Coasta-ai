import React from 'react';
import { useTimeline } from '../../context/TimelineContext';

/**
 * PriorityRankingList displays the ranked list of coastal zones by risk severity,
 * allowing users to click and focus the GIS camera on any zone.
 */
export default function PriorityRankingList({ zonesData, loading, error }) {
  const { activeZone, setActiveZone } = useTimeline();

  if (loading) {
    return (
      <div className="h-32 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
        Ranking coastal zones by vulnerability index...
      </div>
    );
  }

  if (error || !zonesData || zonesData.length === 0) {
    return (
      <div className="p-3 bg-red-950/40 border border-red-900 rounded font-mono text-xs text-red-300">
        {error ? `Failed to load zone rankings: ${error}` : 'No prioritized zones identified.'}
      </div>
    );
  }

  const getBadgeStyle = (classification) => {
    switch (classification?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-300 border-red-700';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-300 border-orange-700';
      case 'MODERATE':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      case 'LOW':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
    }
  };

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-between px-0.5">
        <span>PRIORITY RANK &amp; ZONE</span>
        <span>HAZARD INDEX</span>
      </div>

      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
        {zonesData.map((zone) => {
          const isSelected = activeZone?.id === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(isSelected ? null : zone)}
              className={`w-full text-left p-2 rounded-lg border transition flex flex-col space-y-1.5 ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-950'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                    zone.priority_rank === 1 ? 'bg-red-600 text-white' :
                    zone.priority_rank === 2 ? 'bg-orange-600 text-white' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    #{zone.priority_rank || '—'}
                  </span>
                  <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                    {zone.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-100 font-bold">
                    {zone.score?.toFixed(1) || '0.0'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getBadgeStyle(zone.classification)}`}>
                    {zone.classification || 'UNRATED'}
                  </span>
                </div>
              </div>

              {/* Zone Details */}
              <div className="grid grid-cols-2 gap-x-2 text-[10px] text-slate-400 border-t border-slate-900 pt-1">
                <div className="truncate">
                  <span className="text-slate-500">Risk:</span> {zone.dominant_risk || 'Erosion'}
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Rate:</span> <span className="text-amber-400 font-semibold">{zone.erosion_rate_m_yr ? `${zone.erosion_rate_m_yr} m/yr` : '—'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

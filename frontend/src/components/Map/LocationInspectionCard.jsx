import React, { useState } from 'react';

/**
 * Floating inspection HUD displayed when a location is clicked, pinned, or searched on the map.
 */
export default function LocationInspectionCard({
  searchedLocation,
  onActivateSector,
  onReset,
  onClose
}) {
  const [copied, setCopied] = useState(false);

  if (!searchedLocation) return null;

  const displayName = searchedLocation.displayName || searchedLocation.name?.split(',')[0] || 'Selected Target';
  const fullAddress = searchedLocation.name || `${searchedLocation.lat.toFixed(5)}° N, ${searchedLocation.lng.toFixed(5)}° E`;

  const handleCopyCoords = () => {
    const text = `${searchedLocation.lat.toFixed(6)}, ${searchedLocation.lng.toFixed(6)}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/98 border-2 border-cyan-500/90 rounded-xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl font-mono text-xs text-slate-100 max-w-sm space-y-2.5 animate-in fade-in slide-in-from-top duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center space-x-1">
            <span>🎯</span>
            <span>PRECISION TARGET INSPECTION</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition text-sm font-bold px-1 rounded hover:bg-slate-800"
          title="Dismiss pin"
        >
          ✕
        </button>
      </div>

      {/* Target Details */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
              <span>{searchedLocation.icon || '📍'}</span>
              <span className="truncate max-w-[200px]">{displayName}</span>
            </h4>
            {searchedLocation.district && (
              <p className="text-[10px] text-cyan-400 font-semibold truncate max-w-[220px]">{searchedLocation.district}</p>
            )}
          </div>
          {searchedLocation.type && (
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 shrink-0">
              {searchedLocation.type}
            </span>
          )}
        </div>

        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/60 p-1.5 rounded border border-slate-800/60">{fullAddress}</p>

        {/* High-Precision Coordinates Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/90 p-2.5 rounded-lg border border-slate-800/80">
          <div>
            <span className="text-slate-500 block text-[9px] font-semibold">LATITUDE</span>
            <span className="text-cyan-400 font-bold font-mono">{searchedLocation.lat.toFixed(5)}° N</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] font-semibold">LONGITUDE</span>
            <span className="text-cyan-400 font-bold font-mono">{searchedLocation.lng.toFixed(5)}° E</span>
          </div>
          {searchedLocation.nearestLandmark && (
            <div className="col-span-2 pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Proximity:</span>
              <span className="text-emerald-400 font-medium">
                {searchedLocation.nearestLandmark.distanceKm.toFixed(1)} km {searchedLocation.nearestLandmark.bearing || ''} of {searchedLocation.nearestLandmark.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-1 flex items-center space-x-2">
        <button
          onClick={() => onActivateSector(searchedLocation)}
          className="flex-1 px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition text-xs shadow-md shadow-cyan-500/25 flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <span>📊</span>
          <span>Analyze This Sector</span>
        </button>

        <button
          onClick={handleCopyCoords}
          className={`px-2.5 py-2 rounded-lg transition text-[11px] font-semibold border flex items-center space-x-1 cursor-pointer ${
            copied
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Copy GPS coordinates"
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{copied ? 'Copied' : 'GPS'}</span>
        </button>

        {onReset && (
          <button
            onClick={onReset}
            className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-[11px] border border-slate-700 cursor-pointer"
            title="Deselect pin"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

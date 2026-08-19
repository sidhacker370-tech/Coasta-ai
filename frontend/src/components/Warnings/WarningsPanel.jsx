import React from 'react';

/**
 * WarningsPanel displays active early-warning alerts for coastal hazards and threshold breaches.
 */
export default function WarningsPanel({ warningsData, loading, error }) {
  if (loading) {
    return (
      <div className="h-28 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
        Checking telemetry for threshold breaches...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-950/40 border border-red-900 rounded font-mono text-xs text-red-300">
        Failed to fetch early-warning telemetry: {error}
      </div>
    );
  }

  if (!warningsData || warningsData.length === 0) {
    return (
      <div className="p-3 bg-emerald-950/30 border border-emerald-800/80 rounded-lg text-emerald-300 font-mono text-xs flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        <span>ALL COASTAL SECTORS CURRENTLY WITHIN NOMINAL SAFETY MARGINS</span>
      </div>
    );
  }

  const getSeverityStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return {
          border: 'border-red-500/80',
          bg: 'bg-red-950/40',
          badge: 'bg-red-950 text-red-300 border-red-600',
          text: 'text-red-400',
          dot: 'bg-red-500'
        };
      case 'HIGH':
        return {
          border: 'border-orange-500/80',
          bg: 'bg-orange-950/40',
          badge: 'bg-orange-950 text-orange-300 border-orange-600',
          text: 'text-orange-400',
          dot: 'bg-orange-500'
        };
      case 'MODERATE':
        return {
          border: 'border-amber-500/80',
          bg: 'bg-amber-950/40',
          badge: 'bg-amber-950 text-amber-300 border-amber-600',
          text: 'text-amber-400',
          dot: 'bg-amber-500'
        };
      case 'LOW':
      default:
        return {
          border: 'border-emerald-500/80',
          bg: 'bg-emerald-950/40',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-600',
          text: 'text-emerald-400',
          dot: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="space-y-2.5 font-mono text-xs">
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase px-0.5">
        <span>ACTIVE HAZARD ALERTS ({warningsData.length})</span>
        <span className="text-red-400 animate-pulse">AUTOMATED MONITORING</span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
        {warningsData.map((warning) => {
          const style = getSeverityStyle(warning.severity);
          return (
            <div
              key={warning.id}
              className={`p-2.5 rounded-lg border ${style.border} ${style.bg} space-y-1.5 shadow-sm`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${style.dot} animate-ping`}></span>
                  <span className={`font-bold uppercase tracking-wider text-[11px] ${style.text}`}>
                    {warning.severity} ALERT
                  </span>
                </div>
                <span className="text-[9px] text-slate-400">
                  {warning.id}
                </span>
              </div>

              {/* Target Zone & Indicator */}
              <div className="text-slate-200 font-semibold text-[11px]">
                {warning.zone}
              </div>

              {/* Observed Value vs Threshold */}
              <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 text-[10px] space-y-0.5">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Trigger Indicator:</span>
                  <span className="font-semibold text-slate-200">{warning.indicator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Observed vs Threshold:</span>
                  <span className="font-bold text-red-300">
                    {warning.observed_value} <span className="text-slate-400 font-normal">/ {warning.threshold}</span>
                  </span>
                </div>
                {warning.delta && (
                  <div className="text-amber-400 text-[9px] text-right">
                    {warning.delta}
                  </div>
                )}
              </div>

              {/* Action Message */}
              <p className="text-[11px] text-slate-300 leading-tight pt-0.5">
                {warning.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';

/**
 * SituationSummaryPanel renders an automated, structured operational briefing
 * from the backend analysis engine.
 */
export default function SituationSummaryPanel({ summaryData, loading, error }) {
  if (loading) {
    return (
      <div className="h-32 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
        Synthesizing automated situation overview...
      </div>
    );
  }

  if (error || !summaryData) {
    return (
      <div className="p-3 bg-red-950/40 border border-red-900 rounded font-mono text-xs text-red-300">
        Failed to load situation summary: {error || 'No telemetry received'}
      </div>
    );
  }

  const metrics = summaryData.key_metrics || {};

  return (
    <div className="space-y-3 font-mono text-xs text-slate-300">
      {/* Headline & Status */}
      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">
            STATUS: <strong className="text-red-400">{summaryData.status || 'ACTIVE'}</strong>
          </span>
          <span className="text-[9px] text-slate-500">
            {summaryData.generated_at ? new Date(summaryData.generated_at).toLocaleTimeString() : 'RECENT'}
          </span>
        </div>
        <h3 className="text-xs font-bold text-slate-100 leading-snug">
          {summaryData.headline}
        </h3>
      </div>

      {/* Structured Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="bg-slate-950/90 p-2 rounded border border-slate-800/90">
          <span className="text-[10px] text-slate-500 block">Critical Zones:</span>
          <span className="text-sm font-bold text-red-400">
            {metrics.active_critical_zones ?? '—'}
          </span>
        </div>
        <div className="bg-slate-950/90 p-2 rounded border border-slate-800/90">
          <span className="text-[10px] text-slate-500 block">Erosion Front:</span>
          <span className="text-sm font-bold text-amber-400">
            {metrics.total_erosion_observed_km ? `${metrics.total_erosion_observed_km} km` : '—'}
          </span>
        </div>
        <div className="bg-slate-950/90 p-2 rounded border border-slate-800/90">
          <span className="text-[10px] text-slate-500 block">Highest Risk Sector:</span>
          <span className="text-xs font-semibold text-slate-200 truncate block">
            {metrics.highest_risk_zone || '—'}
          </span>
        </div>
        <div className="bg-slate-950/90 p-2 rounded border border-slate-800/90">
          <span className="text-[10px] text-slate-500 block">AI Confidence:</span>
          <span className="text-sm font-bold text-cyan-400">
            {metrics.model_confidence_score ? `${metrics.model_confidence_score}%` : '—'}
          </span>
        </div>
      </div>

      {/* Situation Overview Field */}
      {summaryData.situation_overview && (
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">
            Situation Overview:
          </span>
          <p className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            {summaryData.situation_overview}
          </p>
        </div>
      )}

      {/* Key Observations List */}
      {summaryData.key_observations && summaryData.key_observations.length > 0 && (
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">
            Key Geomorphic Observations:
          </span>
          <ul className="space-y-1 bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
            {summaryData.key_observations.map((obs, idx) => (
              <li key={idx} className="flex items-start space-x-1.5 text-slate-300">
                <span className="text-cyan-400 font-bold">›</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Operational Recommendation */}
      {summaryData.operational_recommendation && (
        <div className="p-2.5 bg-amber-950/30 border border-amber-800/60 rounded-lg space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Operational Engineering Directive:
          </span>
          <p className="text-[11px] text-amber-200/90 leading-tight">
            {summaryData.operational_recommendation}
          </p>
        </div>
      )}
    </div>
  );
}

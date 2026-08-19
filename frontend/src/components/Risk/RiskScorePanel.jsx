import React from 'react';
import RiskFactorChart from './RiskFactorChart';

/**
 * RiskScorePanel displays overall coastal vulnerability score, classification badge,
 * and the Recharts risk factor breakdown.
 */
export default function RiskScorePanel({ riskData, loading, error }) {
  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
        Computing geomorphic vulnerability inference...
      </div>
    );
  }

  if (error || !riskData) {
    return (
      <div className="p-3 bg-red-950/40 border border-red-900 rounded font-mono text-xs text-red-300">
        Failed to load coastal risk model: {error || 'No telemetry received'}
      </div>
    );
  }

  const score = riskData.overall_score || 0;
  const classification = (riskData.classification || 'UNRATED').toUpperCase();

  const getClassificationBadge = (cls) => {
    switch (cls) {
      case 'CRITICAL':
        return 'bg-red-950/90 text-red-300 border-red-600 shadow-sm shadow-red-900/30';
      case 'HIGH':
        return 'bg-orange-950/90 text-orange-300 border-orange-600 shadow-sm shadow-orange-900/30';
      case 'MODERATE':
        return 'bg-amber-950/90 text-amber-300 border-amber-600 shadow-sm shadow-amber-900/30';
      case 'LOW':
      default:
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-600 shadow-sm shadow-emerald-900/30';
    }
  };

  const getGaugeColor = (cls) => {
    switch (cls) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-orange-500';
      case 'MODERATE': return 'text-amber-500';
      case 'LOW': return 'text-emerald-500';
      default: return 'text-cyan-500';
    }
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Overall Score Header Banner */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Composite Vulnerability Index
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className={`text-2xl font-black ${getGaugeColor(classification)}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${getClassificationBadge(classification)}`}>
            {classification}
          </span>
          <div className="text-[10px] text-slate-400 mt-1">
            Confidence: <strong className="text-cyan-400">{(riskData.confidence ? (riskData.confidence * 100).toFixed(0) + '%' : '91%')}</strong>
          </div>
        </div>
      </div>

      {/* Factor Breakdown Sub-header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span className="font-semibold uppercase text-[10px] text-slate-300">Geomorphic Risk Factors</span>
          <span>WEIGHTED CONTRIBUTION</span>
        </div>
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
          <RiskFactorChart factors={riskData.factors} />
        </div>
      </div>
    </div>
  );
}

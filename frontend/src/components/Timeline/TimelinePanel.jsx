import React from 'react';
import TemporalSlider from './TemporalSlider';
import { useTimeline } from '../../context/TimelineContext';

/**
 * TimelinePanel hosts the temporal scrubber, epoch switcher, and telemetry metadata.
 */
export default function TimelinePanel({ timelineData, loading }) {
  const { periods, selectedPeriod, setSelectedPeriod } = useTimeline();

  const activePeriodObj = periods.find(p => p.id === selectedPeriod) || periods[periods.length - 1];

  return (
    <div className="bg-slate-900/95 border border-slate-800/90 rounded-xl p-3 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
            HISTORICAL OBSERVATION EPOCH
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-mono text-xs font-bold">
            {activePeriodObj?.label || selectedPeriod}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>TOTAL SURVEYS: <strong className="text-slate-200">{periods.length}</strong></span>
        </div>
      </div>

      {loading ? (
        <div className="h-16 flex items-center justify-center text-xs font-mono text-slate-500 animate-pulse">
          Loading satellite observation epochs...
        </div>
      ) : (
        <TemporalSlider
          periods={periods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />
      )}
    </div>
  );
}

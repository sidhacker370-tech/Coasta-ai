import React, { createContext, useContext, useState, useEffect } from 'react';

const TimelineContext = createContext(null);

export function TimelineProvider({ children, timelineData = [] }) {
  const periods = timelineData.length > 0 ? timelineData : [
    { id: "2018", label: "2018 (Baseline)", year: 2018, is_baseline: true },
    { id: "2020", label: "2020 Epoch", year: 2020, is_baseline: false },
    { id: "2022", label: "2022 Post-Storm", year: 2022, is_baseline: false },
    { id: "2024", label: "2024 Epoch", year: 2024, is_baseline: false },
    { id: "2026", label: "2026 (Latest)", year: 2026, is_baseline: false }
  ];

  // Latest period by default
  const latestPeriodId = periods[periods.length - 1]?.id || "2026";
  const baselinePeriodId = periods[0]?.id || "2018";

  const [selectedPeriod, setSelectedPeriod] = useState(latestPeriodId);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [fromPeriod, setFromPeriod] = useState(baselinePeriodId);
  const [toPeriod, setToPeriod] = useState(latestPeriodId);
  const [activeZone, setActiveZone] = useState(null);

  // Active Map Layer visibility toggles
  const [layerVisibility, setLayerVisibility] = useState({
    coastline: true,
    change: true,
    heatmap: true,
    landmarks: true,
    baselineOverlay: false
  });

  // Sync default period if timeline updates
  useEffect(() => {
    if (timelineData && timelineData.length > 0) {
      const latest = timelineData[timelineData.length - 1]?.id;
      const baseline = timelineData[0]?.id;
      if (latest && !selectedPeriod) setSelectedPeriod(latest);
      if (baseline && !fromPeriod) setFromPeriod(baseline);
      if (latest && !toPeriod) setToPeriod(latest);
    }
  }, [timelineData, selectedPeriod, fromPeriod, toPeriod]);

  const toggleLayer = (layerName) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const value = {
    periods,
    selectedPeriod,
    setSelectedPeriod,
    comparisonMode,
    setComparisonMode,
    fromPeriod,
    setFromPeriod,
    toPeriod,
    setToPeriod,
    activeZone,
    setActiveZone,
    layerVisibility,
    toggleLayer,
    setLayerVisibility
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}

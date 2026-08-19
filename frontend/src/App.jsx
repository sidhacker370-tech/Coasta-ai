import React, { useState, useEffect } from 'react';
import { api } from './api/client';
import { useApi } from './hooks/useApi';
import { TimelineProvider, useTimeline } from './context/TimelineContext';
import { PRESET_COASTAL_SECTORS, generateDynamicCoastalSector } from './api/coastalDatabase';

import AppShell from './components/layout/AppShell';
import MapView from './components/Map/MapView';
import TimelinePanel from './components/Timeline/TimelinePanel';
import BeforeAfterPanel from './components/Comparison/BeforeAfterPanel';
import RiskScorePanel from './components/Risk/RiskScorePanel';
import PriorityRankingList from './components/Zones/PriorityRankingList';
import WarningsPanel from './components/Warnings/WarningsPanel';
import SituationSummaryPanel from './components/Summary/SituationSummaryPanel';

/**
 * Inner Dashboard component that accesses TimelineContext to coordinate period-based fetching
 */
function DashboardContent({ defaultStudyArea, timelineData, isGlobalDemo }) {
  const [activeSector, setActiveSector] = useState(null);

  // Initialize with Odisha Coastal Observatory (India) by default
  useEffect(() => {
    if (!activeSector) {
      setActiveSector(PRESET_COASTAL_SECTORS['odisha-coast'] || defaultStudyArea);
    }
  }, [defaultStudyArea, activeSector]);

  const {
    selectedPeriod,
    fromPeriod,
    toPeriod,
    layerVisibility,
    toggleLayer,
    activeZone,
    setActiveZone
  } = useTimeline();

  // Handle switching to any searched coastal sector
  const handleActivateSector = (locOrSector) => {
    if (locOrSector.risk && locOrSector.zones) {
      // It's a full preset sector
      setActiveSector(locOrSector);
    } else if (locOrSector.lat && locOrSector.lng) {
      // It's a newly geocoded location — generate active coastal telemetry for it!
      const dynamicSector = generateDynamicCoastalSector(locOrSector.name, locOrSector.lat, locOrSector.lng);
      setActiveSector(dynamicSector);
    }
    setActiveZone(null);
  };

  // 1. Coastline for selected period
  const {
    data: coastlineData,
    loading: coastlineLoading
  } = useApi(() => api.getCoastline(selectedPeriod), [selectedPeriod, activeSector]);

  // 2. Baseline Coastline for dual comparison overlay
  const {
    data: baselineData
  } = useApi(() => api.getCoastline(fromPeriod), [fromPeriod, activeSector]);

  // 3. Change detection vectors between fromPeriod and toPeriod
  const {
    data: changeData,
    loading: changeLoading
  } = useApi(() => api.getChange(fromPeriod, toPeriod), [fromPeriod, toPeriod, activeSector]);

  // Active sector data overrides or default backend responses
  const currentRisk = activeSector?.risk || null;
  const currentZones = activeSector?.zones || [];
  const currentWarnings = activeSector?.warnings || [];
  const currentSummary = activeSector?.summary || null;

  // 4. Default API fallbacks if activeSector has not overridden them
  const { data: defaultRisk, loading: riskLoading, error: riskError } = useApi(api.getRisk);
  const { data: defaultZones, loading: zonesLoading, error: zonesError } = useApi(api.getZones);
  const { data: defaultWarnings, loading: warningsLoading, error: warningsError } = useApi(api.getWarnings);
  const { data: defaultSummary, loading: summaryLoading, error: summaryError } = useApi(api.getSummary);

  const displayRisk = currentRisk || defaultRisk;
  const displayZones = currentZones.length > 0 ? currentZones : defaultZones;
  const displayWarnings = currentWarnings.length > 0 ? currentWarnings : defaultWarnings;
  const displaySummary = currentSummary || defaultSummary;

  const currentStudyArea = activeSector || defaultStudyArea;

  return (
    <AppShell
      studyArea={currentStudyArea}
      isDemo={isGlobalDemo}
      mapView={
        <MapView
          studyArea={currentStudyArea}
          coastlineData={coastlineData}
          baselineData={baselineData}
          changeData={changeData}
          zonesData={displayZones}
          selectedPeriod={selectedPeriod}
          layerVisibility={layerVisibility}
          toggleLayer={toggleLayer}
          activeZone={activeZone}
          setActiveZone={setActiveZone}
          onActivateSector={handleActivateSector}
        />
      }
      timelinePanel={
        <TimelinePanel
          timelineData={timelineData}
          loading={coastlineLoading}
        />
      }
      sidebarPanels={{
        warnings: (
          <WarningsPanel
            warningsData={displayWarnings}
            loading={warningsLoading}
            error={warningsError}
          />
        ),
        risk: (
          <RiskScorePanel
            riskData={displayRisk}
            loading={riskLoading}
            error={riskError}
          />
        ),
        zones: (
          <PriorityRankingList
            zonesData={displayZones}
            loading={zonesLoading}
            error={zonesError}
          />
        ),
        comparison: (
          <BeforeAfterPanel
            changeMetrics={changeData?.metrics}
          />
        ),
        summary: (
          <SituationSummaryPanel
            summaryData={displaySummary}
            loading={summaryLoading}
            error={summaryError}
          />
        )
      }}
    />
  );
}

export default function App() {
  const { data: studyArea, isDemo: studyAreaDemo } = useApi(api.getStudyArea);
  const { data: timelineData, loading: timelineLoading, isDemo: timelineDemo } = useApi(api.getTimeline);

  const isGlobalDemo = studyAreaDemo || timelineDemo;

  return (
    <TimelineProvider timelineData={timelineData || []}>
      <DashboardContent
        defaultStudyArea={studyArea}
        timelineData={timelineData || []}
        isGlobalDemo={isGlobalDemo}
      />
    </TimelineProvider>
  );
}

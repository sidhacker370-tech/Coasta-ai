import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * AppShell handles the full-viewport command center grid layout.
 * Dominant GIS map canvas on the left, horizontal timeline controls at bottom, and analytical sidebar on the right.
 */
export default function AppShell({
  studyArea,
  isDemo,
  mapView,
  timelinePanel,
  sidebarPanels
}) {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Telemetry Header */}
      <Header studyArea={studyArea} isDemo={isDemo} />

      {/* Main Workspace: GIS Map + Right Sidebar */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Dominant GIS Map Canvas Container */}
        <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-slate-950">
          {/* Map View Canvas */}
          <div className="flex-1 w-full h-full relative">
            {mapView}
          </div>

          {/* Floating / Bottom Attached Timeline Scrubber Control */}
          <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
            <div className="pointer-events-auto max-w-4xl mx-auto">
              {timelinePanel}
            </div>
          </div>
        </div>

        {/* Right Sidebar with Analytical Panels */}
        <Sidebar
          warningsPanel={sidebarPanels.warnings}
          riskScorePanel={sidebarPanels.risk}
          priorityRankingList={sidebarPanels.zones}
          situationSummaryPanel={sidebarPanels.summary}
          beforeAfterPanel={sidebarPanels.comparison}
        />
      </main>
    </div>
  );
}

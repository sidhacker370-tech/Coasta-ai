import React from 'react';
import { GeoJSON } from 'react-leaflet';

/**
 * CoastlineLayer renders extracted shoreline LineString GeoJSON for the active period
 * and optionally an overlaid baseline comparison period.
 */
export default function CoastlineLayer({
  coastlineData,
  baselineData,
  showBaseline = false,
  period = "2026"
}) {
  if (!coastlineData) return null;

  // Active period styling: bright glowing cyan
  const activeStyle = {
    color: '#38bdf8',
    weight: 3.5,
    opacity: 0.95,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: null
  };

  // Baseline comparison period styling: dashed purple
  const baselineStyle = {
    color: '#c084fc',
    weight: 2.5,
    opacity: 0.85,
    dashArray: '6, 6',
    lineCap: 'round'
  };

  const onEachFeature = (feature, layer) => {
    const props = feature.properties || {};
    const popupContent = `
      <div class="font-mono text-xs p-1 space-y-1">
        <div class="font-bold text-cyan-400 border-b border-slate-700 pb-1">
          ${props.name || `Shoreline Transect (${props.period || period})`}
        </div>
        <div class="text-slate-300">
          <span class="text-slate-400">Epoch:</span> ${props.period || period}
        </div>
        <div class="text-slate-300">
          <span class="text-slate-400">Survey Date:</span> ${props.survey_date || '2026-06-15'}
        </div>
        <div class="text-slate-300">
          <span class="text-slate-400">Method:</span> ${props.extraction_method || 'MNDWI + Adaptive Otsu'}
        </div>
        <div class="text-slate-300">
          <span class="text-slate-400">Confidence:</span> ${(props.confidence ? (props.confidence * 100).toFixed(1) + '%' : '94.0%')}
        </div>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <>
      {/* Baseline Reference Shoreline (if enabled in comparison mode) */}
      {showBaseline && baselineData && (
        <GeoJSON
          key={`baseline-${baselineData.period || '2018'}`}
          data={baselineData}
          style={() => baselineStyle}
          onEachFeature={onEachFeature}
        />
      )}

      {/* Active Selected Epoch Coastline */}
      <GeoJSON
        key={`coastline-${period}-${coastlineData.features?.length || 1}`}
        data={coastlineData}
        style={() => activeStyle}
        onEachFeature={onEachFeature}
      />
    </>
  );
}

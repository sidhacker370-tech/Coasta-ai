import React from 'react';
import { GeoJSON } from 'react-leaflet';

/**
 * RiskHeatmapLayer renders zone vulnerability polygons color-coded by risk severity.
 */
export default function RiskHeatmapLayer({ zonesData, onSelectZone }) {
  if (!zonesData || !Array.isArray(zonesData) || zonesData.length === 0) return null;

  // Convert zones list with geometry to GeoJSON FeatureCollection
  const featureCollection = {
    type: "FeatureCollection",
    features: zonesData
      .filter(z => z.geometry)
      .map(z => ({
        type: "Feature",
        id: z.id,
        properties: {
          id: z.id,
          name: z.name,
          score: z.score,
          classification: z.classification,
          priority_rank: z.priority_rank,
          dominant_risk: z.dominant_risk,
          erosion_rate_m_yr: z.erosion_rate_m_yr,
          trend: z.trend
        },
        geometry: z.geometry
      }))
  };

  const getRiskColor = (classification) => {
    switch (classification?.toUpperCase()) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MODERATE': return '#eab308';
      case 'LOW': return '#22c55e';
      default: return '#38bdf8';
    }
  };

  const styleFeature = (feature) => {
    const color = getRiskColor(feature.properties?.classification);
    const isCritical = feature.properties?.classification === 'CRITICAL';

    return {
      fillColor: color,
      fillOpacity: isCritical ? 0.38 : 0.25,
      color: color,
      weight: isCritical ? 2.5 : 1.5,
      dashArray: '4, 4'
    };
  };

  const onEachFeature = (feature, layer) => {
    const p = feature.properties || {};
    const color = getRiskColor(p.classification);

    const popupContent = `
      <div class="font-mono text-xs p-1 space-y-1.5 min-w-[200px]">
        <div class="flex items-center justify-between border-b border-slate-700 pb-1">
          <span class="font-bold text-slate-100">#${p.priority_rank || '—'} ${p.name || 'Zone'}</span>
          <span class="px-1.5 py-0.5 rounded text-[10px] font-bold" style="background-color: ${color}25; color: ${color}; border: 1px solid ${color}80;">
            ${p.classification || 'UNRATED'} (${p.score?.toFixed(1) || '0'})
          </span>
        </div>
        <div class="text-[11px] text-slate-300">
          <span class="text-slate-400">Dominant Hazard:</span> ${p.dominant_risk || 'Coastal Erosion'}
        </div>
        <div class="text-[11px] text-slate-300">
          <span class="text-slate-400">Retreat Trend:</span> ${p.trend?.replace('_', ' ') || 'STEADY'}
        </div>
        <div class="text-[11px] text-slate-300">
          <span class="text-slate-400">Erosion Rate:</span> ${p.erosion_rate_m_yr ? p.erosion_rate_m_yr + ' m/yr' : '—'}
        </div>
      </div>
    `;

    layer.bindPopup(popupContent);
    
    if (onSelectZone) {
      layer.on('click', () => {
        onSelectZone(p);
      });
    }
  };

  return (
    <GeoJSON
      key={`risk-heatmap-${zonesData.length}`}
      data={featureCollection}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  );
}

import React from 'react';
import { GeoJSON } from 'react-leaflet';

/**
 * ChangeLayer renders erosion (red) and accretion (green) change polygons
 * extracted between two historical observation epochs.
 */
export default function ChangeLayer({ changeData }) {
  if (!changeData || !changeData.features) return null;

  const styleFeature = (feature) => {
    const isErosion = feature.properties?.type === 'erosion';
    const isCritical = feature.properties?.severity === 'CRITICAL';

    if (isErosion) {
      return {
        fillColor: '#ef4444',
        fillOpacity: isCritical ? 0.65 : 0.45,
        color: '#dc2626',
        weight: 2,
        dashArray: isCritical ? null : '3, 3'
      };
    } else {
      return {
        fillColor: '#10b981',
        fillOpacity: 0.50,
        color: '#059669',
        weight: 1.5
      };
    }
  };

  const onEachFeature = (feature, layer) => {
    const p = feature.properties || {};
    const isErosion = p.type === 'erosion';
    
    const popupContent = `
      <div class="font-mono text-xs p-1 space-y-1.5">
        <div class="flex items-center justify-between border-b border-slate-700 pb-1">
          <span class="font-bold ${isErosion ? 'text-red-400' : 'text-emerald-400'} uppercase">
            ${isErosion ? '⚠ EROSION LOSS VECTOR' : '✦ ACCRETION DEPOSITION'}
          </span>
          <span class="px-1.5 py-0.2 rounded text-[10px] ${
            p.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
            p.severity === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
            'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }">
            ${p.severity || 'MODERATE'}
          </span>
        </div>
        <div class="text-slate-200 font-semibold">${p.zone_name || 'Coastal Sector'}</div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-300 text-[11px] pt-1">
          <div><span class="text-slate-400">${isErosion ? 'Max Retreat:' : 'Max Advance:'}</span> ${p.retreat_distance_m || p.advance_distance_m || '—'} m</div>
          <div><span class="text-slate-400">Rate:</span> ${p.rate_m_yr || '—'} m/yr</div>
          <div><span class="text-slate-400">${isErosion ? 'Area Lost:' : 'Area Gained:'}</span> ${p.area_lost_m2 ? (p.area_lost_m2 / 10000).toFixed(1) + ' ha' : (p.area_gained_m2 ? (p.area_gained_m2 / 10000).toFixed(1) + ' ha' : '—')}</div>
          <div><span class="text-slate-400">Vulnerability:</span> ${(p.vulnerability_index ? (p.vulnerability_index * 100).toFixed(0) + '%' : '—')}</div>
        </div>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <GeoJSON
      key={`change-${changeData.from_period}-${changeData.to_period}-${changeData.features.length}`}
      data={changeData}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  );
}

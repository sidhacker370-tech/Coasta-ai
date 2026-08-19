import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import CoastlineLayer from './CoastlineLayer';
import ChangeLayer from './ChangeLayer';
import RiskHeatmapLayer from './RiskHeatmapLayer';
import CoastalLandmarksLayer, { COASTAL_LANDMARKS } from './CoastalLandmarksLayer';
import MapLegend from './MapLegend';
import LocationSearchBar from './LocationSearchBar';
import LocationInspectionCard from './LocationInspectionCard';

const BASEMAP_PRESETS = {
  satellite: {
    name: 'Satellite Hybrid',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics, USDA, USGS',
    badge: 'HYBRID',
    overlays: [
      // 1. Esri World Boundaries & Comprehensive Place Names
      {
        id: 'esri-places',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri World Boundaries & Places',
        opacity: 1.0,
        zIndex: 10
      },
      // 2. High-Contrast CartoDB Labels for Coastal Areas & Cities
      {
        id: 'carto-labels',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        attribution: '&copy; CARTO Labels',
        opacity: 0.95,
        zIndex: 11
      },
      // 3. Esri Transportation & Coastal Road Networks
      {
        id: 'esri-roads',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri Transportation',
        opacity: 0.75,
        zIndex: 9
      }
    ]
  },
  voyager: {
    name: 'Vibrant Color',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap contributors',
    badge: 'COLOR',
    overlays: []
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    badge: 'STREET',
    overlays: []
  },
  dark: {
    name: 'Dark Command',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap contributors',
    badge: 'TACTICAL',
    overlays: []
  }
};

/**
 * Haversine formula to compute distance in km between two lat/lng points
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate compass bearing (N, NE, E, SE, S, SW, W, NW)
 */
function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  const brng = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const compass = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return compass[Math.round(brng / 45) % 8];
}

/**
 * Find the closest landmark or city from the catalog
 */
function findNearestLandmark(lat, lng) {
  let nearest = null;
  let minDistance = Infinity;

  COASTAL_LANDMARKS.forEach((lm) => {
    const d = calculateDistanceKm(lat, lng, lm.coords[0], lm.coords[1]);
    if (d < minDistance) {
      minDistance = d;
      nearest = { ...lm, distanceKm: d };
    }
  });

  return nearest;
}

/**
 * Mathematically Exact Precision Pinpoint Marker DivIcon
 * Needle tip is located at exact coordinate (x: 16px, y: 40px)
 */
function createPinpointIcon(loc) {
  const html = `
    <div class="relative w-8 h-10 select-none pointer-events-none">
      <!-- Expanding Radar Pulse Ring at the exact needle tip [16px, 40px] -->
      <div class="absolute left-1/2 top-[40px] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-cyan-400 bg-cyan-400/30 animate-ping pointer-events-none"></div>
      
      <!-- Precision Target Pin (SVG) with bottom tip at [16px, 40px] -->
      <svg class="w-8 h-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Pin Body -->
        <path d="M16 40C16 40 30 24 30 14C30 6.26801 23.732 0 16 0C8.26801 0 2 6.26801 2 14C2 24 16 40 16 40Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <!-- Inner Core Circle -->
        <circle cx="16" cy="14" r="7" fill="#090d16" stroke="#38bdf8" stroke-width="1.5"/>
        <!-- Center Target Dot -->
        <circle cx="16" cy="14" r="3" fill="#38bdf8"/>
        <!-- Precision Ground Tip Point -->
        <circle cx="16" cy="40" r="2" fill="#38bdf8"/>
      </svg>
      
      <!-- High-Contrast Tag Floating to the Right -->
      <div class="absolute top-1 left-9 px-2 py-0.5 rounded-md bg-slate-950/98 border border-cyan-400 shadow-[0_4px_16px_rgba(0,0,0,0.9)] whitespace-nowrap text-[10px] font-mono font-bold text-cyan-300 flex items-center space-x-1 backdrop-blur-md">
        <span>●</span>
        <span>${loc.displayName || 'Selected Target'}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pinpoint-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36]
  });
}

/**
 * Map click & pointer move event handler to pinpoint & select any location with sub-meter accuracy
 */
function MapClickHandler({ onMapClick, onMouseMove }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
    mousemove: (e) => {
      if (onMouseMove) {
        onMouseMove(e.latlng);
      }
    }
  });
  return null;
}

/**
 * Controller to smoothly pan to selected locations WITHOUT changing current zoom level
 */
function MapCameraController({ studyArea, activeZone, selectedLocation }) {
  const map = useMap();
  const lastStudyAreaId = useRef(null);

  // When a location or zone is selected, smoothly pan while preserving the current zoom level
  useEffect(() => {
    if (selectedLocation) {
      map.panTo([selectedLocation.lat, selectedLocation.lng], { animate: true, duration: 0.4 });
    } else if (activeZone?.center) {
      map.panTo(activeZone.center, { animate: true, duration: 0.4 });
    }
  }, [map, activeZone, selectedLocation]);

  // Only fit bounds on initial load or when studyArea switches to a completely different sector
  useEffect(() => {
    if (studyArea && studyArea.id !== lastStudyAreaId.current) {
      lastStudyAreaId.current = studyArea.id;
      if (studyArea.bounds) {
        map.fitBounds(studyArea.bounds, { padding: [40, 40], maxZoom: 14 });
      } else if (studyArea.center) {
        map.setView(studyArea.center, studyArea.zoom || 11);
      }
    }
  }, [map, studyArea]);

  return null;
}

export default function MapView({
  studyArea,
  coastlineData,
  baselineData,
  changeData,
  zonesData,
  selectedPeriod,
  layerVisibility,
  toggleLayer,
  activeZone,
  setActiveZone,
  onActivateSector
}) {
  const [currentBasemap, setCurrentBasemap] = useState('satellite'); // Default to rich Satellite Hybrid with full labels
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mouseCoords, setMouseCoords] = useState(null);

  const defaultCenter = studyArea?.center || [19.8135, 85.8312];
  const defaultZoom = studyArea?.zoom || 11;

  // Handle clicking ANY spot on the map canvas to pinpoint and select with maximum precision
  const handleMapClick = async (latlng) => {
    const lat = parseFloat(latlng.lat.toFixed(6));
    const lng = parseFloat(latlng.lng.toFixed(6));

    // 1. Instantly check nearest landmark / city hub
    const nearest = findNearestLandmark(lat, lng);
    const isClose = nearest && nearest.distanceKm < 0.8;
    const bearing = nearest ? calculateBearing(nearest.coords[0], nearest.coords[1], lat, lng) : '';

    const initialPoint = {
      id: isClose ? nearest.id : `pin-${Date.now()}`,
      lat,
      lng,
      name: isClose
        ? `${nearest.name}, ${nearest.district}`
        : `Target Coordinate (${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E)`,
      displayName: isClose ? nearest.name : `Selected Point`,
      district: isClose ? nearest.district : `Position: ${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`,
      type: isClose ? nearest.category : "Pinpointed Location",
      nearestLandmark: nearest ? { ...nearest, bearing } : null,
      icon: isClose ? nearest.icon : "📍",
      isPinned: true
    };

    setSelectedLocation(initialPoint);

    // 2. High-precision Reverse Geocoding via Nominatim (zoom=18 for street / building level precision)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { Accept: 'application/json' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const addr = data.address || {};
          const localFeature =
            addr.road ||
            addr.suburb ||
            addr.neighbourhood ||
            addr.village ||
            addr.town ||
            addr.city ||
            addr.beach ||
            addr.amenity ||
            data.name ||
            data.display_name.split(',')[0];

          const regionHierarchy = [
            addr.suburb || addr.neighbourhood,
            addr.city || addr.town || addr.county || addr.district,
            addr.state,
            addr.country
          ]
            .filter(Boolean)
            .join(', ');

          setSelectedLocation((prev) => {
            if (!prev || Math.abs(prev.lat - lat) > 0.0001 || Math.abs(prev.lng - lng) > 0.0001) return prev;
            return {
              ...prev,
              name: data.display_name,
              displayName: localFeature,
              district: regionHierarchy || prev.district,
              type: addr.city ? 'Urban Municipality' : addr.beach ? 'Coastal Beachfront' : addr.village ? 'Rural Village Reach' : prev.type,
              addressDetails: addr
            };
          });
        }
      }
    } catch {
      // Silently keep coordinate name fallback
    }
  };

  // Handle selecting a location from Search bar or Suggestions
  const handleSelectLocation = (loc) => {
    const nearest = findNearestLandmark(loc.lat, loc.lng);
    const bearing = nearest ? calculateBearing(nearest.coords[0], nearest.coords[1], loc.lat, loc.lng) : '';
    setSelectedLocation({
      ...loc,
      displayName: loc.displayName || loc.name.split(',')[0],
      nearestLandmark: nearest ? { ...nearest, bearing } : null
    });
  };

  // Handle selecting a Landmark badge directly
  const handleSelectLandmark = (landmark) => {
    setSelectedLocation({
      ...landmark,
      displayName: landmark.displayName || landmark.name.split(',')[0]
    });
  };

  // Handle activating full sector analysis
  const handleActivateSector = (locOrSector) => {
    if (onActivateSector) {
      onActivateSector(locOrSector);
    }
  };

  const handleResetPinpoint = () => {
    setSelectedLocation(null);
    setActiveZone(null);
  };

  const activeBasemapConfig = BASEMAP_PRESETS[currentBasemap] || BASEMAP_PRESETS.satellite;

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* 1. Leaflet Interactive GIS Map Container (doubleClickZoom disabled to preserve pinpoint precision) */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={false}
        doubleClickZoom={false}
        attributionControl={true}
        className="w-full h-full z-0 cursor-crosshair"
      >
        <MapCameraController
          studyArea={studyArea}
          activeZone={activeZone}
          selectedLocation={selectedLocation}
        />

        {/* Listen for click & mousemove events anywhere on the map to pinpoint & inspect with sub-meter accuracy */}
        <MapClickHandler
          onMapClick={handleMapClick}
          onMouseMove={(latlng) => setMouseCoords(latlng)}
        />

        {/* Dynamic Basemap Primary Imagery Tile Layer */}
        <TileLayer
          key={`base-${currentBasemap}`}
          url={activeBasemapConfig.url}
          attribution={activeBasemapConfig.attribution}
          maxZoom={19}
        />

        {/* Satellite Hybrid Multi-Layer Overlays (City Names, Coastal Labels, Roads, Boundaries) */}
        {activeBasemapConfig.overlays &&
          activeBasemapConfig.overlays.map((overlay) => (
            <TileLayer
              key={`overlay-${overlay.id}`}
              url={overlay.url}
              attribution={overlay.attribution}
              opacity={overlay.opacity || 1.0}
              zIndex={overlay.zIndex || 10}
              maxZoom={19}
            />
          ))}

        {/* GIS Data Layers */}
        {layerVisibility.heatmap && (
          <RiskHeatmapLayer
            zonesData={zonesData}
            onSelectZone={(zone) => {
              setActiveZone(zone);
              if (zone.center) {
                setSelectedLocation({
                  id: zone.id,
                  lat: zone.center[0],
                  lng: zone.center[1],
                  name: zone.name,
                  displayName: zone.name,
                  type: `Priority Zone #${zone.priority_rank} (${zone.classification})`,
                  isZone: true
                });
              }
            }}
          />
        )}

        {layerVisibility.change && <ChangeLayer changeData={changeData} />}

        {layerVisibility.coastline && (
          <CoastlineLayer
            coastlineData={coastlineData}
            baselineData={baselineData}
            showBaseline={layerVisibility.baselineOverlay}
            period={selectedPeriod}
          />
        )}

        {/* Permanent High-Contrast Coastal & Inland Places Layer */}
        {layerVisibility.landmarks && (
          <CoastalLandmarksLayer
            onSelectLandmark={handleSelectLandmark}
            onAnalyzeSector={handleActivateSector}
            selectedLocation={selectedLocation}
          />
        )}

        {/* Active Pinpoint / Selected Location Target Marker & Sub-Meter Ground Reticle */}
        {selectedLocation && (
          <>
            {/* Precision Ground Reticle Dot */}
            <CircleMarker
              center={[selectedLocation.lat, selectedLocation.lng]}
              radius={4}
              pathOptions={{
                color: '#38bdf8',
                fillColor: '#0284c7',
                fillOpacity: 1,
                weight: 2
              }}
            />

            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createPinpointIcon(selectedLocation)}
            >
              <Popup autoPan={false}>
                <div className="font-mono text-xs p-1 space-y-1.5 min-w-[220px]">
                  <div className="font-bold text-cyan-400 border-b border-slate-700 pb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 truncate max-w-[150px]">
                      <span>{selectedLocation.icon || '📍'}</span>
                      <span className="truncate">{selectedLocation.displayName || 'Selected Target'}</span>
                    </span>
                    <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-700 px-1.5 py-0.2 rounded font-bold shrink-0">
                      PINPOINT
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-400">Position:</span>{' '}
                    <span className="text-cyan-300 font-bold font-mono">
                      {selectedLocation.lat.toFixed(5)}°N, {selectedLocation.lng.toFixed(5)}°E
                    </span>
                  </div>
                  {selectedLocation.nearestLandmark && (
                    <div className="text-[10px] text-emerald-400">
                      Near: {selectedLocation.nearestLandmark.name} ({selectedLocation.nearestLandmark.distanceKm.toFixed(1)} km {selectedLocation.nearestLandmark.bearing || ''})
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 line-clamp-2">
                    {selectedLocation.name}
                  </div>
                  <div className="pt-2 flex items-center space-x-1.5">
                    <button
                      onClick={() => handleActivateSector(selectedLocation)}
                      className="flex-1 px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-[10px] transition cursor-pointer shadow-sm"
                    >
                      📊 Analyze Sector
                    </button>
                    <button
                      onClick={handleResetPinpoint}
                      className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Position Zoom Controls at Bottom Left above Timeline */}
        <ZoomControl position="bottomleft" />
      </MapContainer>

      {/* Live Precision GPS Coordinates Readout (Bottom Right) */}
      {mouseCoords && (
        <div className="absolute bottom-4 right-4 z-[1800] bg-slate-950/95 border border-cyan-500/50 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-200 shadow-xl backdrop-blur-md flex items-center space-x-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-slate-400 font-medium">CURSOR:</span>
          <span className="text-cyan-300 font-bold font-mono">
            {mouseCoords.lat.toFixed(5)}°N, {mouseCoords.lng.toFixed(5)}°E
          </span>
        </div>
      )}

      {/* Pinpoint Mode Helper Chip (Center Top) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1900] pointer-events-none hidden sm:flex items-center space-x-2 bg-slate-950/85 border border-cyan-500/40 rounded-full px-3.5 py-1 text-[11px] font-mono text-cyan-300 shadow-xl backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Click anywhere to pinpoint any coastal site or inland city</span>
      </div>

      {/* 2. Top-Left Floating Command Bar: Search + Inspection HUD (z-[2500] ALWAYS VISIBLE) */}
      <div className="absolute top-4 left-4 z-[2500] flex flex-col space-y-2.5 pointer-events-auto">
        <LocationSearchBar
          onSelectLocation={handleSelectLocation}
          onActivateSector={handleActivateSector}
          activeSectorName={studyArea?.name}
        />

        {/* Location Inspection HUD Card */}
        {selectedLocation && (
          <LocationInspectionCard
            searchedLocation={selectedLocation}
            onActivateSector={handleActivateSector}
            onReset={handleResetPinpoint}
            onClose={() => setSelectedLocation(null)}
          />
        )}

        {/* Active Focus Indicator for Zones */}
        {!selectedLocation && activeZone && (
          <div className="bg-slate-900/95 border-2 border-cyan-500/80 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 shadow-2xl backdrop-blur-md flex items-center justify-between space-x-3 w-fit">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>
                FOCUS: <strong>{activeZone.name}</strong>
              </span>
            </div>
            <button
              onClick={() => setActiveZone(null)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
            >
              Reset View
            </button>
          </div>
        )}
      </div>

      {/* 3. Top-Right Floating Controls: Basemap Selector & Layer Toggles (z-[2000]) */}
      <div className="absolute top-4 right-4 z-[2000] flex flex-col items-end space-y-2 pointer-events-auto">
        {/* Basemap Switcher Chips */}
        <div className="bg-slate-900/95 border border-slate-800/90 rounded-lg p-1.5 shadow-xl backdrop-blur-md flex items-center space-x-1 text-[11px] font-mono">
          <span className="text-slate-400 px-2 font-semibold flex items-center space-x-1">
            <span>🛰️</span>
            <span>STYLE:</span>
          </span>

          {Object.entries(BASEMAP_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => setCurrentBasemap(key)}
              className={`px-2.5 py-1 rounded transition font-medium flex items-center space-x-1 cursor-pointer ${
                currentBasemap === key
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
              }`}
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Layer Controls */}
        <div className="bg-slate-900/95 border border-slate-800/90 rounded-lg p-1.5 shadow-xl backdrop-blur-md flex items-center space-x-1 text-[11px] font-mono">
          <span className="text-slate-400 px-2 font-semibold">LAYERS:</span>

          <button
            onClick={() => toggleLayer('landmarks')}
            className={`px-2.5 py-1 rounded transition font-medium flex items-center space-x-1.5 cursor-pointer ${
              layerVisibility.landmarks
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 border border-transparent hover:text-slate-200'
            }`}
            title="Toggle Cities & Landmark Badges"
          >
            <span
              className={`w-2 h-2 rounded-full ${layerVisibility.landmarks ? 'bg-emerald-400' : 'bg-slate-600'}`}
            ></span>
            <span>🏷️ Places &amp; Cities</span>
          </button>

          <button
            onClick={() => toggleLayer('coastline')}
            className={`px-2.5 py-1 rounded transition font-medium flex items-center space-x-1.5 cursor-pointer ${
              layerVisibility.coastline
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 border border-transparent hover:text-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${layerVisibility.coastline ? 'bg-cyan-400' : 'bg-slate-600'}`}
            ></span>
            <span>Coastline</span>
          </button>

          <button
            onClick={() => toggleLayer('change')}
            className={`px-2.5 py-1 rounded transition font-medium flex items-center space-x-1.5 cursor-pointer ${
              layerVisibility.change
                ? 'bg-red-950/80 text-red-300 border border-red-500/50 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 border border-transparent hover:text-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${layerVisibility.change ? 'bg-red-400' : 'bg-slate-600'}`}
            ></span>
            <span>Change Vectors</span>
          </button>

          <button
            onClick={() => toggleLayer('heatmap')}
            className={`px-2.5 py-1 rounded transition font-medium flex items-center space-x-1.5 cursor-pointer ${
              layerVisibility.heatmap
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 border border-transparent hover:text-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${layerVisibility.heatmap ? 'bg-amber-400' : 'bg-slate-600'}`}
            ></span>
            <span>Risk Heatmap</span>
          </button>

          <button
            onClick={() => toggleLayer('baselineOverlay')}
            className={`px-2.5 py-1 rounded transition font-medium flex items-center space-x-1.5 cursor-pointer ${
              layerVisibility.baselineOverlay
                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 border border-transparent hover:text-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${layerVisibility.baselineOverlay ? 'bg-purple-400' : 'bg-slate-600'}`}
            ></span>
            <span>2018 Baseline</span>
          </button>
        </div>

        {/* Legend */}
        <MapLegend layerVisibility={layerVisibility} />
      </div>
    </div>
  );
}

import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Major Coastal & Inland Landmarks, Metros, and Key Places across Odisha, India, and Global Hubs
export const COASTAL_LANDMARKS = [
  // 1. Inland Metropolitan & Regional Capital Hubs
  {
    id: "inland-bhubaneswar-city",
    name: "Bhubaneswar Smart City",
    district: "Khordha District, Odisha",
    coords: [20.2961, 85.8245],
    category: "State Capital & High-Tech Urban Corridor",
    type: "Inland Watershed & Microclimate Heat Island",
    color: "#38bdf8",
    icon: "🏛️"
  },
  {
    id: "inland-cuttack-millennium",
    name: "Cuttack Millennium City",
    district: "Cuttack District, Odisha",
    coords: [20.4625, 85.8830],
    category: "Historic Riverine Delta Island",
    type: "Mahanadi-Kathajodi Embankment Ring",
    color: "#818cf8",
    icon: "🏙️"
  },
  {
    id: "inland-rourkela-brahmani",
    name: "Rourkela Steel City",
    district: "Sundargarh District, Odisha",
    coords: [22.2604, 84.8536],
    category: "Industrial Center & Brahmani Basin",
    type: "Riverine Valley & Terrain Inversion",
    color: "#f59e0b",
    icon: "🏭"
  },
  {
    id: "inland-sambalpur-hirakud",
    name: "Sambalpur & Hirakud Reservoir",
    district: "Sambalpur District, Odisha",
    coords: [21.5700, 83.8700],
    category: "Major Hydropower Earthen Dam Basin",
    type: "Reservoir Inflow & Hydro-Catchment",
    color: "#06b6d4",
    icon: "🌊"
  },
  {
    id: "inland-new-delhi-ncr",
    name: "New Delhi National Capital",
    district: "Delhi NCR, India",
    coords: [28.6139, 77.2090],
    category: "National Capital Megacity",
    type: "Yamuna Basin & Severe Urban Heat Island",
    color: "#ec4899",
    icon: "🇮🇳"
  },
  {
    id: "inland-bengaluru-tech",
    name: "Bengaluru Silicon Plateau",
    district: "Karnataka, India",
    coords: [12.9716, 77.5946],
    category: "High-Elevation Tech Watershed",
    type: "Cascade Lake System & Storm Runoff",
    color: "#a855f7",
    icon: "💻"
  },
  {
    id: "inland-kolkata-hooghly",
    name: "Kolkata Hooghly Riverfront",
    district: "West Bengal, India",
    coords: [22.5726, 88.3639],
    category: "Tidal Riverine Megacity",
    type: "Hooghly Tidal Floodplain & Wetlands",
    color: "#3b82f6",
    icon: "🌉"
  },

  // 2. Coastal Observatories & Marine Reaches
  {
    id: "odisha-puri-beach",
    name: "Puri Swargadwar Beach",
    district: "Puri District, Odisha",
    coords: [19.7980, 85.8250],
    category: "Urban Beach & Cultural Heritage",
    type: "Critical Swash Overwash Zone",
    color: "#f43f5e",
    icon: "🏖️"
  },
  {
    id: "odisha-pentha-beach",
    name: "Pentha Beach (Kendrapara)",
    district: "Kendrapara District, Odisha",
    coords: [20.5300, 86.9300],
    category: "Geotube Protection Barrier",
    type: "Accelerated Scour & Saline Inundation",
    color: "#ef4444",
    icon: "🛡️"
  },
  {
    id: "odisha-chilika-mouth",
    name: "Chilika Sea Mouth (Satapada)",
    district: "Puri / Ganjam, Odisha",
    coords: [19.6800, 85.4500],
    category: "Ramsar Wetland & Sand Spit Barrier",
    type: "Dynamic Tidal Inlet Migration",
    color: "#f59e0b",
    icon: "🌊"
  },
  {
    id: "odisha-gopalpur-rushikulya",
    name: "Gopalpur & Rushikulya Estuary",
    district: "Ganjam District, Odisha",
    coords: [19.3500, 85.0500],
    category: "Port & Marine Sanctuary",
    type: "Olive Ridley Arribada Nesting Reach",
    color: "#10b981",
    icon: "🐢"
  },
  {
    id: "odisha-paradip-port",
    name: "Paradip Port & Mahanadi Estuary",
    district: "Jagatsinghpur, Odisha",
    coords: [20.2700, 86.6800],
    category: "Deepwater Port & River Confluence",
    type: "Breakwater Jetty Sediment Trapping",
    color: "#06b6d4",
    icon: "⚓"
  },
  {
    id: "odisha-chandipur-sea",
    name: "Chandipur-on-Sea",
    district: "Balasore District, Odisha",
    coords: [21.4600, 87.0200],
    category: "Unique Macro-Tidal Mudflat",
    type: "5km Receding Tide Phenomemon",
    color: "#8b5cf6",
    icon: "🦀"
  },
  {
    id: "odisha-konark-marine",
    name: "Konark Chandrabhaga Beach",
    district: "Puri District, Odisha",
    coords: [19.8650, 86.1100],
    category: "Blue Flag Certified Beach",
    type: "Casuarina Plantation Dune Buffer",
    color: "#3b82f6",
    icon: "🚩"
  },
  {
    id: "odisha-devi-estuary",
    name: "Devi River Mouth (Astaranga)",
    district: "Puri District, Odisha",
    coords: [19.9800, 86.3800],
    category: "Mangrove & Estuarine Creek",
    type: "Estuarine Sand Bar Dynamics",
    color: "#14b8a6",
    icon: "🌿"
  }
];

// Custom HTML DivIcon creator with high-contrast text badge and glowing pin
function createLandmarkIcon(landmark, isSelected) {
  const borderRingClass = isSelected
    ? 'border-cyan-400 ring-4 ring-cyan-400/50 scale-110 animate-pulse'
    : 'border-white shadow-[0_0_12px_rgba(0,0,0,0.8)]';

  const badgeBgClass = isSelected
    ? 'bg-slate-950 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
    : 'bg-slate-950/95 border border-slate-700 shadow-[0_4px_16px_rgba(0,0,0,0.9)]';

  const html = `
    <div class="group relative flex items-center cursor-pointer select-none" style="transform: translate(-50%, -50%);">
      <!-- Outer Pulsing Ring -->
      <div class="relative flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all ${borderRingClass}" style="background-color: ${landmark.color};">
        <span class="text-xs">${landmark.icon}</span>
      </div>
      <!-- Prominent Label Tag (Always Clear & Visible on Satellite Hybrid) -->
      <div class="ml-2 px-2 py-0.5 rounded-md ${badgeBgClass} backdrop-blur-md flex flex-col whitespace-nowrap">
        <span class="text-[11px] font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-1">
          <span style="color: ${landmark.color};">●</span>
          <span>${landmark.name}</span>
          ${isSelected ? '<span class="text-[9px] bg-cyan-400 text-slate-950 px-1 rounded font-black ml-1">SELECTED</span>' : ''}
        </span>
        <span class="text-[9px] text-slate-400 font-mono font-medium">${landmark.district}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-coastal-landmark-marker',
    iconSize: [180, 40],
    iconAnchor: [14, 20]
  });
}

export default function CoastalLandmarksLayer({ onSelectLandmark, onAnalyzeSector, selectedLocation }) {
  return (
    <>
      {COASTAL_LANDMARKS.map((landmark) => {
        const isSelected = selectedLocation && (
          selectedLocation.id === landmark.id ||
          (Math.abs(selectedLocation.lat - landmark.coords[0]) < 0.002 &&
           Math.abs(selectedLocation.lng - landmark.coords[1]) < 0.002)
        );

        return (
          <Marker
            key={landmark.id}
            position={landmark.coords}
            icon={createLandmarkIcon(landmark, isSelected)}
            eventHandlers={{
              click: () => {
                if (onSelectLandmark) {
                  onSelectLandmark({
                    id: landmark.id,
                    name: `${landmark.name}, ${landmark.district}`,
                    displayName: landmark.name,
                    district: landmark.district,
                    lat: landmark.coords[0],
                    lng: landmark.coords[1],
                    type: landmark.category,
                    dynamics: landmark.type,
                    icon: landmark.icon,
                    color: landmark.color,
                    isLandmark: true
                  });
                }
              }
            }}
          >
            <Popup autoPan={false}>
              <div className="font-mono text-xs p-1 space-y-1.5 min-w-[220px]">
                <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-700">
                  <span className="text-base">{landmark.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs">{landmark.name}</h4>
                    <p className="text-[10px] text-slate-400">{landmark.district}</p>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400">Classification: </span>
                    <span className="text-cyan-300 font-semibold">{landmark.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Coastal Dynamics: </span>
                    <span className="text-amber-300">{landmark.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Coordinates: </span>
                    <span className="text-slate-200 font-mono">{landmark.coords[0].toFixed(4)}°N, {landmark.coords[1].toFixed(4)}°E</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-1.5">
                  <button
                    onClick={() => {
                      if (onAnalyzeSector) {
                        onAnalyzeSector({
                          name: `${landmark.name}, ${landmark.district}`,
                          lat: landmark.coords[0],
                          lng: landmark.coords[1],
                          type: landmark.category
                        });
                      }
                    }}
                    className="flex-1 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] rounded transition shadow-sm"
                  >
                    📊 Analyze Sector
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectLandmark) {
                        onSelectLandmark({
                          id: landmark.id,
                          name: `${landmark.name}, ${landmark.district}`,
                          displayName: landmark.name,
                          district: landmark.district,
                          lat: landmark.coords[0],
                          lng: landmark.coords[1],
                          type: landmark.category,
                          dynamics: landmark.type,
                          icon: landmark.icon,
                          color: landmark.color,
                          isLandmark: true
                        });
                      }
                    }}
                    className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded transition"
                  >
                    📍 Select
                  </button>
                </div>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -16]} opacity={0.95}>
              <span className="font-mono text-[10px] font-bold">
                {landmark.name} • {landmark.category}
              </span>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

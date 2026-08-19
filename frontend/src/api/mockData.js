/**
 * COAST-AI Demonstration / Fallback Dataset
 * Realistic coastal geomorphology data modeled after the ODISHA COASTLINE (India),
 * including Puri, Chilika Lagoon Spit, Pentha (Kendrapara), Gopalpur, and Paradip.
 */

export const MOCK_STUDY_AREA = {
  id: "odisha-coastal-observatory",
  name: "Odisha Coastal Observatory (Bay of Bengal)",
  region: "Odisha, India (Puri, Chilika, Kendrapara, Paradip)",
  center: [19.8135, 85.8312],
  zoom: 11,
  bounds: [
    [19.2000, 84.8000],
    [20.9000, 87.1000]
  ],
  metadata: {
    crs: "EPSG:4326 (WGS84)",
    sensor_platforms: ["Sentinel-2 MSI", "Landsat 8/9 OLI", "Oceansat-3 OCM", "Cartosat-3"],
    resolution_m: 10.0,
    last_survey_date: "2026-06-15",
    coastal_type: "Tropical Cyclone-Prone High-Energy Sandy Spit & Lagoonal Delta",
    total_shoreline_km: 480.0
  }
};

export const MOCK_TIMELINE = [
  { id: "2018", label: "2018 (Baseline)", year: 2018, date: "2018-05-12", is_baseline: true, sensor: "Landsat-8" },
  { id: "2020", label: "2020 Post-Fani", year: 2020, date: "2020-06-18", is_baseline: false, sensor: "Sentinel-2A" },
  { id: "2022", label: "2022 Post-Yaas", year: 2022, date: "2022-09-24", is_baseline: false, sensor: "Sentinel-2B" },
  { id: "2024", label: "2024 Epoch", year: 2024, date: "2024-04-10", is_baseline: false, sensor: "Sentinel-2 MSI" },
  { id: "2026", label: "2026 (Latest)", year: 2026, date: "2026-06-15", is_baseline: false, sensor: "Sentinel-2 + Oceansat-3" }
];

// Odisha Coast Baseline Transect Coordinates (Gopalpur -> Chilika -> Puri -> Konark -> Paradip -> Pentha)
const ODISHA_BASELINE_COORDS = [
  [84.9000, 19.2600], // Gopalpur
  [85.1000, 19.4500], // Rushikulya Mouth
  [85.4500, 19.6800], // Chilika Lagoon outer spit (Satapada)
  [85.8312, 19.8000], // Puri Beach
  [86.0900, 19.8800], // Konark Marine Drive
  [86.4000, 19.9800], // Devi River Estuary
  [86.6800, 20.2600], // Paradip Port & Mahanadi Confluence
  [86.9500, 20.5200], // Pentha Beach (Kendrapara)
  [87.0500, 20.7500]  // Bhitarkanika / Dhamra
];

export function getMockCoastlineGeoJSON(period = "2026") {
  const periodOffsets = {
    "2018": 0.0000,
    "2020": 0.0022, // Post-Fani cyclone shoreline retreat
    "2022": 0.0048, // Post-Yaas retreat
    "2024": 0.0075,
    "2026": 0.0105
  };

  const offset = periodOffsets[period] ?? 0.0050;

  // Oceanfront coastline shifting landward (erosion into Bay of Bengal)
  const coords = ODISHA_BASELINE_COORDS.map(([lng, lat], idx) => {
    // Greater retreat in Pentha & Chilika Spit (indices 2, 3, 7)
    const factor = idx === 7 ? 1.7 : (idx === 2 || idx === 3) ? 1.4 : 0.9;
    return [lng - (offset * factor), lat - (offset * factor * 0.40)];
  });

  return {
    type: "FeatureCollection",
    period,
    features: [
      {
        type: "Feature",
        id: `odisha-coastline-${period}-main`,
        properties: {
          period,
          name: `Odisha Shoreline Transect (${period})`,
          extraction_method: "MNDWI + Adaptive Otsu Thresholding (Sentinel-2)",
          confidence: 0.95,
          survey_date: MOCK_TIMELINE.find(t => t.id === period)?.date || "2026-06-15"
        },
        geometry: {
          type: "LineString",
          coordinates: coords
        }
      }
    ]
  };
}

export function getMockChangeGeoJSON(fromPeriod = "2018", toPeriod = "2026") {
  return {
    type: "FeatureCollection",
    from_period: fromPeriod,
    to_period: toPeriod,
    metrics: {
      net_loss_sq_km: 2.85,
      erosion_length_km: 74.2,
      accretion_length_km: 14.6,
      max_retreat_m: 48.2,
      avg_rate_m_yr: 4.65,
      critical_hotspots_count: 4
    },
    features: [
      // 1. Critical Erosion Hotspot: Pentha Beach (Kendrapara)
      {
        type: "Feature",
        id: "odisha-change-pentha",
        properties: {
          type: "erosion",
          severity: "CRITICAL",
          zone_name: "Pentha Kendrapara Geotube Sector",
          retreat_distance_m: 48.2,
          rate_m_yr: 5.12,
          area_lost_m2: 780000,
          vulnerability_index: 0.96
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [86.9500, 20.5200],
            [86.9200, 20.5600],
            [86.9050, 20.5450],
            [86.9350, 20.5050],
            [86.9500, 20.5200]
          ]]
        }
      },
      // 2. Critical Erosion Hotspot: Puri Swargadwar Beachfront
      {
        type: "Feature",
        id: "odisha-change-puri",
        properties: {
          type: "erosion",
          severity: "CRITICAL",
          zone_name: "Puri Swargadwar Urban Beach Reach",
          retreat_distance_m: 36.4,
          rate_m_yr: 4.10,
          area_lost_m2: 490000,
          vulnerability_index: 0.89
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [85.8312, 19.8000],
            [85.8600, 19.8250],
            [85.8450, 19.8350],
            [85.8150, 19.8100],
            [85.8312, 19.8000]
          ]]
        }
      },
      // 3. High Erosion Hotspot: Chilika Sea Mouth Spit (Satapada)
      {
        type: "Feature",
        id: "odisha-change-chilika",
        properties: {
          type: "erosion",
          severity: "HIGH",
          zone_name: "Chilika Sea Mouth Sand Spit",
          retreat_distance_m: 29.8,
          rate_m_yr: 3.45,
          area_lost_m2: 380000,
          vulnerability_index: 0.82
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [85.4500, 19.6800],
            [85.4800, 19.7100],
            [85.4650, 19.7250],
            [85.4350, 19.6950],
            [85.4500, 19.6800]
          ]]
        }
      },
      // 4. Accretion Polygon: Mahanadi Delta Shoals (Paradip south)
      {
        type: "Feature",
        id: "odisha-change-paradip-accretion",
        properties: {
          type: "accretion",
          severity: "LOW",
          zone_name: "Mahanadi Estuary Shoal Deposition",
          advance_distance_m: 22.0,
          rate_m_yr: 2.75,
          area_gained_m2: 340000,
          vulnerability_index: 0.15
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [86.6800, 20.2600],
            [86.7200, 20.2400],
            [86.7100, 20.2200],
            [86.6700, 20.2400],
            [86.6800, 20.2600]
          ]]
        }
      }
    ]
  };
}

export const MOCK_RISK = {
  overall_score: 86.4,
  classification: "CRITICAL",
  assessment_date: "2026-06-18",
  model_version: "COAST-AI Bay of Bengal Hazard Model v4.1",
  confidence: 0.95,
  factors: [
    { name: "Tropical Cyclone Surge (Bay of Bengal)", score: 96, weight: 0.30, description: "Category 4+ surge envelope > 3.8m above MSL during pre/post-monsoon" },
    { name: "Pentha Geotube Barrier Scour", score: 92, weight: 0.25, description: "Direct marine scarping exceeding design geotextile embankment threshold" },
    { name: "Historical Shoreline Retreat", score: 88, weight: 0.20, description: "Mean retreat rate of 4.65 m/yr along central Kendrapara & Puri reaches" },
    { name: "Chilika Lagoon Inlet Migration", score: 84, weight: 0.15, description: "Dynamic spit narrowing altering brackish water salinity equilibrium" },
    { name: "Mangrove & Sand Dune Deficit", score: 76, weight: 0.10, description: "Loss of natural casuarina and mangrove buffer in agricultural zones" }
  ],
  zones: [
    { id: "odisha-z1", name: "Pentha Beach Reach (Kendrapara)", score: 93.4, classification: "CRITICAL", key_drivers: ["Geotube scarping", "Cyclone Dana & Yaas erosion surge"] },
    { id: "odisha-z2", name: "Puri Swargadwar Beachfront", score: 88.2, classification: "CRITICAL", key_drivers: ["High tourist density", "Severe high-tide swash overwash"] },
    { id: "odisha-z3", name: "Chilika Sea Mouth Spit (Satapada)", score: 82.5, classification: "HIGH", key_drivers: ["Tidal inlet migration", "Sand spit narrowing"] },
    { id: "odisha-z4", name: "Gopalpur & Rushikulya Estuary", score: 74.0, classification: "HIGH", key_drivers: ["Olive Ridley nesting beach loss", "Seasonal berm retreat"] },
    { id: "odisha-z5", name: "Paradip Port & Mahanadi Confluence", score: 58.5, classification: "MODERATE", key_drivers: ["Jetties sediment trapping", "Estuarine dredging"] },
    { id: "odisha-z6", name: "Chandipur Intertidal Flats (Balasore)", score: 28.0, classification: "LOW", key_drivers: ["5km macro-tidal mudflats", "Stable accretionary balance"] }
  ]
};

export const MOCK_ZONES = [
  {
    id: "odisha-z1",
    name: "Pentha Beach Reach (Kendrapara)",
    priority_rank: 1,
    score: 93.4,
    classification: "CRITICAL",
    trend: "ACCELERATING_EROSION",
    erosion_rate_m_yr: 5.12,
    dominant_risk: "Geotube Embankment Breach & Saline Inundation",
    center: [20.5300, 86.9300],
    geometry: {
      type: "Polygon",
      coordinates: [[
        [86.9600, 20.5100],
        [86.9100, 20.5700],
        [86.8900, 20.5500],
        [86.9400, 20.4900],
        [86.9600, 20.5100]
      ]]
    }
  },
  {
    id: "odisha-z2",
    name: "Puri Swargadwar Beachfront",
    priority_rank: 2,
    score: 88.2,
    classification: "CRITICAL",
    trend: "CHRONIC_RETREAT",
    erosion_rate_m_yr: 4.10,
    dominant_risk: "Urban Beachfront & Coastal Road Scour",
    center: [19.7950, 85.8200],
    geometry: {
      type: "Polygon",
      coordinates: [[
        [85.8100, 19.7800],
        [85.8600, 19.8200],
        [85.8450, 19.8350],
        [85.7950, 19.7950],
        [85.8100, 19.7800]
      ]]
    }
  },
  {
    id: "odisha-z3",
    name: "Chilika Sea Mouth Spit (Satapada)",
    priority_rank: 3,
    score: 82.5,
    classification: "HIGH",
    trend: "SPIT_NARROWING",
    erosion_rate_m_yr: 3.45,
    dominant_risk: "Lagoon Outer Barrier Spit Breach",
    center: [19.6800, 85.4500],
    geometry: {
      type: "Polygon",
      coordinates: [[
        [85.4200, 19.6600],
        [85.4800, 19.7100],
        [85.4650, 19.7250],
        [85.4050, 19.6750],
        [85.4200, 19.6600]
      ]]
    }
  },
  {
    id: "odisha-z4",
    name: "Gopalpur & Rushikulya Estuary",
    priority_rank: 4,
    score: 74.0,
    classification: "HIGH",
    trend: "NESTING_HABITAT_LOSS",
    erosion_rate_m_yr: 2.80,
    dominant_risk: "Olive Ridley Arribada Nesting Beach Scour",
    center: [19.3500, 85.0500],
    geometry: {
      type: "Polygon",
      coordinates: [[
        [84.9500, 19.2800],
        [85.1500, 19.4600],
        [85.1300, 19.4800],
        [84.9300, 19.3000],
        [84.9500, 19.2800]
      ]]
    }
  },
  {
    id: "odisha-z5",
    name: "Paradip Port & Mahanadi Confluence",
    priority_rank: 5,
    score: 58.5,
    classification: "MODERATE",
    trend: "JETTY_INDUCED_TRAPPING",
    erosion_rate_m_yr: 1.40,
    dominant_risk: "Harbor Approach Shoaling & South Beach Erosion",
    center: [20.2700, 86.6800],
    geometry: {
      type: "Polygon",
      coordinates: [[
        [86.6500, 20.2400],
        [86.7100, 20.2900],
        [86.6900, 20.3100],
        [86.6300, 20.2600],
        [86.6500, 20.2400]
      ]]
    }
  },
  {
    id: "odisha-z6",
    name: "Chandipur Intertidal Flats (Balasore)",
    priority_rank: 6,
    score: 28.0,
    classification: "LOW",
    trend: "STABLE_TIDAL_OSCILLATION",
    erosion_rate_m_yr: -0.90,
    dominant_risk: "Low Risk — Extreme 5km Intertidal Recession",
    center: [21.4600, 87.0200],
    geometry: {
      type: "Polygon",
      coordinates: [[
        [86.9800, 21.4200],
        [87.0600, 21.5000],
        [87.0400, 21.5200],
        [86.9600, 21.4400],
        [86.9800, 21.4200]
      ]]
    }
  }
];

export const MOCK_WARNINGS = [
  {
    id: "WARN-ODI-01",
    severity: "CRITICAL",
    zone: "Pentha Kendrapara Geotube Sector",
    indicator: "Geotextile Scarping Elevation",
    observed_value: "1.15 m MSL",
    threshold: "2.80 m MSL",
    delta: "-1.65 m below embankment design limit",
    timestamp: "2026-08-18T08:30:00Z",
    message: "Severe marine scouring exposed primary geotube foundation at Pentha village. High tide storm surges present catastrophic saline embankment cut-through threat."
  },
  {
    id: "WARN-ODI-02",
    severity: "CRITICAL",
    zone: "Puri Swargadwar Beachfront",
    indicator: "High-Tide Swash Runup Exceedance",
    observed_value: "3.65 m MSL",
    threshold: "2.90 m MSL",
    delta: "+0.75 m above promenade crest",
    timestamp: "2026-08-18T06:15:00Z",
    message: "Bay of Bengal spring tide surge producing continuous swash overwash across Swargadwar tourist promenade and commercial kiosks."
  },
  {
    id: "WARN-ODI-03",
    severity: "HIGH",
    zone: "Chilika Lagoon Outer Spit (Satapada)",
    indicator: "Sand Spit Barrier Width",
    observed_value: "68.0 m",
    threshold: "120.0 m",
    delta: "-52.0 m below stable barrier threshold",
    timestamp: "2026-08-17T21:40:00Z",
    message: "Rapid spit narrowing at new inlet opening threatens to alter Chilika Lake estuarine salinity balance and fisheries ecology."
  }
];

export const MOCK_SUMMARY = {
  headline: "Acute Geomorphic Erosion & Cyclone Surge Threats Along Odisha Coastline",
  status: "CRITICAL ALERT ACTIVE",
  generated_at: "2026-08-18T09:00:00Z",
  study_area_name: "Odisha Coastal Observatory (Bay of Bengal)",
  key_metrics: {
    active_critical_zones: 2,
    total_erosion_observed_km: 74.2,
    net_sediment_loss_sq_km: 2.85,
    highest_risk_zone: "Pentha Kendrapara (93.4/100)",
    model_confidence_score: 95.8
  },
  situation_overview: "Multi-temporal satellite earth-observation analysis (2018-2026) reveals accelerated coastline erosion along 74.2 km of the Odisha coast. The Bay of Bengal cyclone corridor and seasonal monsoon swells have intensified retreat at Pentha, Puri, and Chilika sea mouth spits with max retreat exceeding 48.2 meters.",
  key_observations: [
    "Geotextile tube coastal protection embankment at Pentha experiencing acute toe scour with 5.12 m/yr retreat rate.",
    "Puri Swargadwar urban beach profile has lost 36.4m of dry sand buffer since Cyclone Fani baseline.",
    "Chilika Lake outer sand spit has narrowed to under 70m near Satapada, risking uncontrolled marine inlet breaching.",
    "Rushikulya estuary nesting beaches for Olive Ridley sea turtles have shrunk by 28% over 6 years."
  ],
  operational_recommendation: "Deploy emergency riprap boulders and bio-shield casuarina plantation at Pentha; install submerged geotextile reef breakers at Puri Swargadwar prior to cyclone season."
};

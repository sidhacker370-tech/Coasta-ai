/**
 * Comprehensive Environmental & Geospatial Observatories Database & Dynamic Sector Generator
 * Supports Coastal Observatories, Inland Metros, Riverine Basins, and Global Cities.
 */

export const PRESET_COASTAL_SECTORS = {
  "odisha-coast": {
    id: "odisha-coast",
    name: "Odisha Coastal Observatory (Bay of Bengal)",
    region: "Odisha, India (Puri, Chilika, Kendrapara, Paradip)",
    center: [19.8135, 85.8312],
    zoom: 11,
    bounds: [[19.2000, 84.8000], [20.9000, 87.1000]],
    coastal_type: "Cyclone-Prone High-Energy Sandy Spit & Estuarine Delta",
    total_shoreline_km: 480.0,
    risk: {
      overall_score: 86.4,
      classification: "CRITICAL",
      confidence: 0.95,
      factors: [
        { name: "Tropical Cyclone Surge (Bay of Bengal)", score: 96, weight: 0.30, description: "Category 4+ surge envelope > 3.8m above MSL during pre/post-monsoon" },
        { name: "Pentha Geotube Barrier Scour", score: 92, weight: 0.25, description: "Direct marine scarping exceeding design geotextile embankment threshold" },
        { name: "Historical Shoreline Retreat", score: 88, weight: 0.20, description: "Mean retreat rate of 4.65 m/yr along central Kendrapara & Puri reaches" },
        { name: "Chilika Lagoon Inlet Migration", score: 84, weight: 0.15, description: "Dynamic spit narrowing altering brackish water salinity equilibrium" },
        { name: "Mangrove & Sand Dune Deficit", score: 76, weight: 0.10, description: "Loss of natural casuarina and mangrove buffer in agricultural zones" }
      ]
    },
    zones: [
      { id: "odisha-z1", name: "Pentha Beach Reach (Kendrapara)", priority_rank: 1, score: 93.4, classification: "CRITICAL", trend: "ACCELERATING_EROSION", erosion_rate_m_yr: 5.12, dominant_risk: "Geotube Embankment Breach & Saline Inundation", center: [20.5300, 86.9300] },
      { id: "odisha-z2", name: "Puri Swargadwar Beachfront", priority_rank: 2, score: 88.2, classification: "CRITICAL", trend: "CHRONIC_RETREAT", erosion_rate_m_yr: 4.10, dominant_risk: "Urban Beachfront & Coastal Road Scour", center: [19.7950, 85.8200] },
      { id: "odisha-z3", name: "Chilika Sea Mouth Spit (Satapada)", priority_rank: 3, score: 82.5, classification: "HIGH", trend: "SPIT_NARROWING", erosion_rate_m_yr: 3.45, dominant_risk: "Lagoon Outer Barrier Spit Breach", center: [19.6800, 85.4500] },
      { id: "odisha-z4", name: "Gopalpur & Rushikulya Estuary", priority_rank: 4, score: 74.0, classification: "HIGH", trend: "NESTING_HABITAT_LOSS", erosion_rate_m_yr: 2.80, dominant_risk: "Olive Ridley Arribada Nesting Beach Scour", center: [19.3500, 85.0500] },
      { id: "odisha-z5", name: "Paradip Port & Mahanadi Confluence", priority_rank: 5, score: 58.5, classification: "MODERATE", trend: "JETTY_INDUCED_TRAPPING", erosion_rate_m_yr: 1.40, dominant_risk: "Harbor Approach Shoaling & South Beach Erosion", center: [20.2700, 86.6800] },
      { id: "odisha-z6", name: "Chandipur Intertidal Flats (Balasore)", priority_rank: 6, score: 28.0, classification: "LOW", trend: "STABLE_TIDAL_OSCILLATION", erosion_rate_m_yr: -0.90, dominant_risk: "Low Risk — Extreme 5km Intertidal Recession", center: [21.4600, 87.0200] }
    ],
    warnings: [
      { id: "WARN-ODI-01", severity: "CRITICAL", zone: "Pentha Kendrapara Geotube Sector", indicator: "Geotextile Scarping Elevation", observed_value: "1.15 m MSL", threshold: "2.80 m MSL", delta: "-1.65 m below embankment design limit", timestamp: "2026-08-18T08:30:00Z", message: "Severe marine scouring exposed primary geotube foundation at Pentha village. High tide storm surges present catastrophic saline embankment cut-through threat." },
      { id: "WARN-ODI-02", severity: "CRITICAL", zone: "Puri Swargadwar Beachfront", indicator: "High-Tide Swash Runup Exceedance", observed_value: "3.65 m MSL", threshold: "2.90 m MSL", delta: "+0.75 m above promenade crest", timestamp: "2026-08-18T06:15:00Z", message: "Bay of Bengal spring tide surge producing continuous swash overwash across Swargadwar tourist promenade and commercial kiosks." },
      { id: "WARN-ODI-03", severity: "HIGH", zone: "Chilika Lagoon Outer Spit (Satapada)", indicator: "Sand Spit Barrier Width", observed_value: "68.0 m", threshold: "120.0 m", delta: "-52.0 m below stable barrier threshold", timestamp: "2026-08-17T21:40:00Z", message: "Rapid spit narrowing at new inlet opening threatens to alter Chilika Lake estuarine salinity balance and fisheries ecology." }
    ],
    summary: {
      headline: "Acute Geomorphic Erosion & Cyclone Surge Threats Along Odisha Coastline",
      status: "CRITICAL ALERT ACTIVE",
      key_metrics: { active_critical_zones: 2, total_erosion_observed_km: 74.2, highest_risk_zone: "Pentha Kendrapara", model_confidence_score: 95.8 },
      situation_overview: "Multi-temporal satellite earth-observation analysis (2018-2026) reveals accelerated coastline erosion along 74.2 km of the Odisha coast. The Bay of Bengal cyclone corridor and seasonal monsoon swells have intensified retreat at Pentha, Puri, and Chilika sea mouth spits with max retreat exceeding 48.2 meters.",
      key_observations: [
        "Geotextile tube coastal protection embankment at Pentha experiencing acute toe scour with 5.12 m/yr retreat rate.",
        "Puri Swargadwar urban beach profile has lost 36.4m of dry sand buffer since Cyclone Fani baseline.",
        "Chilika Lake outer sand spit has narrowed to under 70m near Satapada, risking uncontrolled marine inlet breaching.",
        "Rushikulya estuary nesting beaches for Olive Ridley sea turtles have shrunk by 28% over 6 years."
      ],
      operational_recommendation: "Deploy emergency riprap boulders and bio-shield casuarina plantation at Pentha; install submerged geotextile reef breakers at Puri Swargadwar prior to cyclone season."
    }
  },

  "bhubaneswar-smart-city": {
    id: "bhubaneswar-smart-city",
    name: "Bhubaneswar Smart City & Daya Basin",
    region: "Khordha District, Odisha, India",
    center: [20.2961, 85.8245],
    zoom: 12,
    bounds: [[20.2000, 85.7000], [20.4000, 85.9500]],
    coastal_type: "Inland Capital Megacity & Daya-Kuakhai River Basin",
    total_shoreline_km: 0.0,
    risk: {
      overall_score: 72.5,
      classification: "HIGH",
      confidence: 0.94,
      factors: [
        { name: "Urban Heat Island & Concrete Albedo", score: 86, weight: 0.30, description: "Dense built-up expansion raising surface temperatures +4.2°C above rural baseline" },
        { name: "Daya & Kuakhai Monsoon Inundation", score: 79, weight: 0.25, description: "Riverine discharge bottlenecks near Sundarpada and southern lowlands" },
        { name: "Impervious Surface Stormwater Runoff", score: 75, weight: 0.25, description: "Gangua Nallah natural drainage congestion during cloudburst events" },
        { name: "Groundwater Table Stress", score: 68, weight: 0.20, description: "Rapid depletion of unconfined aquifers across Patia and Infocity corridors" }
      ]
    },
    zones: [
      { id: "bbsr-z1", name: "Sundarpada & Daya Floodplain Basin", priority_rank: 1, score: 84.2, classification: "CRITICAL", trend: "HIGH_FLOOD_SUSCEPTIBILITY", erosion_rate_m_yr: 0.0, dominant_risk: "Monsoon Waterlogging & River Overflow", center: [20.2400, 85.8100] },
      { id: "bbsr-z2", name: "Patia & Infocity High-Density Corridor", priority_rank: 2, score: 76.5, classification: "HIGH", trend: "URBAN_HEAT_EXPANSION", erosion_rate_m_yr: 0.0, dominant_risk: "Microclimate Thermal Stress & Runoff", center: [20.3550, 85.8180] },
      { id: "bbsr-z3", name: "Old Town Heritage & Bindusagar Reach", priority_rank: 3, score: 62.0, classification: "MODERATE", trend: "HYDROLOGIC_CONGESTION", erosion_rate_m_yr: 0.0, dominant_risk: "Heritage Waterbody Sedimentation", center: [20.2430, 85.8340] }
    ],
    warnings: [
      { id: "WARN-BBS-01", severity: "HIGH", zone: "Sundarpada Lowland Sector", indicator: "Gangua Canal Drainage Capacity", observed_value: "92% Full", threshold: "80%", delta: "+12% capacity exceedance", timestamp: "2026-08-18T08:00:00Z", message: "Intense pre-monsoon precipitation causing acute backflow along Daya river distributary canals." }
    ],
    summary: {
      headline: "Urban Hydrology & Surface Heat Dynamics in Bhubaneswar Smart City",
      status: "HIGH ENVIRONMENTAL SURVEILLANCE",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 0.0, highest_risk_zone: "Sundarpada Floodplain", model_confidence_score: 94.0 },
      situation_overview: "Bhubaneswar capital region exhibits rapid urban infrastructure expansion. Satellite thermal infrared (TIR) and SAR hydrology indices detect intense heat island hotspots in north IT corridors and localized drainage congestion in southern Daya river basins.",
      key_observations: [
        "Northern IT hub (Patia/Infocity) shows +3.8°C thermal variance over Chandaka forest sanctuary.",
        "Southern low-elevation urban sectors vulnerable to Gangua Nallah overflow during heavy rain.",
        "Groundwater recharge zones near Kuakhai riverbed requiring spatial zoning protection."
      ],
      operational_recommendation: "Accelerate Gangua canal desiltation, enforce permeable pavers in commercial complexes, and expand urban tree canopy corridors."
    }
  },

  "cuttack-millennium-city": {
    id: "cuttack-millennium-city",
    name: "Cuttack Millennium City & Mahanadi-Kathajodi Delta",
    region: "Cuttack District, Odisha, India",
    center: [20.4625, 85.8830],
    zoom: 12,
    bounds: [[20.3800, 85.7800], [20.5500, 86.0000]],
    coastal_type: "Inland Riverine Island & Embankment Confluence",
    total_shoreline_km: 0.0,
    risk: {
      overall_score: 76.8,
      classification: "CRITICAL",
      confidence: 0.93,
      factors: [
        { name: "Mahanadi & Kathajodi River Surge", score: 88, weight: 0.35, description: "High-volume monsoon discharge from upstream Hirakud reservoir" },
        { name: "Ring Road Embankment Geotechnical Stress", score: 82, weight: 0.25, description: "Hydraulic pressure on millennium earthen flood protection dykes" },
        { name: "Bowl-Shaped Urban Drainage Inversion", score: 78, weight: 0.25, description: "City interior sits below high river flood level, requiring pumping" },
        { name: "Siltation & Riverbed Agglutination", score: 65, weight: 0.15, description: "Sandbar buildup reducing active discharge channel cross-section" }
      ]
    },
    zones: [
      { id: "ctc-z1", name: "Kathajodi Ring Road Embankment Reach", priority_rank: 1, score: 87.0, classification: "CRITICAL", trend: "HYDRAULIC_PRESSURE_HIGH", erosion_rate_m_yr: 0.0, dominant_risk: "Dyke Seepage & Overtopping Risk", center: [20.4450, 85.8650] },
      { id: "ctc-z2", name: "Jobra Barrage & Mahanadi North Channel", priority_rank: 2, score: 74.5, classification: "HIGH", trend: "BARRAGE_DISCHARGE_MONITORED", erosion_rate_m_yr: 0.0, dominant_risk: "Scour at Barrage Apron", center: [20.4800, 85.9000] },
      { id: "ctc-z3", name: "Barabati Heritage & Cantonment Reach", priority_rank: 3, score: 58.0, classification: "MODERATE", trend: "STABLE", erosion_rate_m_yr: 0.0, dominant_risk: "Localized Sluice Gate Backflow", center: [20.4780, 85.8600] }
    ],
    warnings: [
      { id: "WARN-CTC-01", severity: "HIGH", zone: "Kathajodi South Embankment", indicator: "River Crest Level", observed_value: "26.4 m MSL", threshold: "28.5 m MSL", delta: "-2.1 m below danger level", timestamp: "2026-08-18T07:45:00Z", message: "Monsoon inflow through Naraj gorge elevating Kathajodi water levels. Automated sluice gates placed on standby." }
    ],
    summary: {
      headline: "Riverine Hydrodynamic Monitoring Across Cuttack River Island",
      status: "ACTIVE RIVERINE SURVEILLANCE",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 0.0, highest_risk_zone: "Kathajodi Embankment", model_confidence_score: 93.0 },
      situation_overview: "Surrounded by the mighty Mahanadi and Kathajodi rivers, Cuttack functions as a high-density riverine island. Satellite altimetry and Sentinel-1 SAR flood mapping continuously monitor river channel velocities and ring dyke stability.",
      key_observations: [
        "Kathajodi ring road embankment showing high structural integrity with zero localized slippage detected.",
        "Mahanadi riverbed sand deposits at Jobra barrage being mapped for hydraulic clearance.",
        "Stormwater sluice pumping stations operating under optimal SCADA parameters."
      ],
      operational_recommendation: "Maintain 24/7 telemetry on Naraj barrage inflow and inspect ring bund boulder riprap along southern embankment."
    }
  },

  "new-delhi-ncr": {
    id: "new-delhi-ncr",
    name: "New Delhi National Capital Region",
    region: "Delhi NCR, India",
    center: [28.6139, 77.2090],
    zoom: 11,
    bounds: [[28.4000, 76.9000], [28.8500, 77.4500]],
    coastal_type: "Metropolitan Megacity & Yamuna Floodplain Basin",
    total_shoreline_km: 0.0,
    risk: {
      overall_score: 79.8,
      classification: "CRITICAL",
      confidence: 0.95,
      factors: [
        { name: "Yamuna River Floodplain Encroachment", score: 92, weight: 0.35, description: "Monsoon overflow breaching 205.33m danger mark during Hathnikund releases" },
        { name: "Extreme Urban Heat Island (UHI)", score: 88, weight: 0.25, description: "High-density concrete surface temperatures exceeding +46°C in summer" },
        { name: "Aquifer Overexploitation", score: 84, weight: 0.20, description: "Severe groundwater table decline across south and southwest districts" },
        { name: "Air Quality Particulate Stagnation", score: 82, weight: 0.20, description: "Winter thermal inversion trapping PM2.5 within the basin" }
      ]
    },
    zones: [
      { id: "del-z1", name: "Yamuna Floodplain (ITO & Old Bridge)", priority_rank: 1, score: 91.0, classification: "CRITICAL", trend: "HIGH_FLOOD_RISK", erosion_rate_m_yr: 0.0, dominant_risk: "Yamuna River Inundation & Sluice Failure", center: [28.6300, 77.2500] },
      { id: "del-z2", name: "Central Ridge & Urban Core Heat Zone", priority_rank: 2, score: 82.0, classification: "HIGH", trend: "THERMAL_MAXIMUM", erosion_rate_m_yr: 0.0, dominant_risk: "Extreme Urban Heat Island", center: [28.6139, 77.2090] },
      { id: "del-z3", name: "Najafgarh Drain Corridor", priority_rank: 3, score: 71.0, classification: "HIGH", trend: "DRAINAGE_OVERLOAD", erosion_rate_m_yr: 0.0, dominant_risk: "Stormwater Waterlogging", center: [28.6000, 77.0500] }
    ],
    warnings: [
      { id: "WARN-DEL-01", severity: "HIGH", zone: "Yamuna ITO Barrage Reach", indicator: "Yamuna Water Level at Old Bridge", observed_value: "204.85 m", threshold: "205.33 m", delta: "-0.48 m below danger mark", timestamp: "2026-08-18T06:00:00Z", message: "Hathnikund barrage upstream release maintaining high flow velocities along Delhi riverfront." }
    ],
    summary: {
      headline: "Yamuna Basin Hydrology & Urban Heat Island Surveillance in Delhi NCR",
      status: "HIGH ALERT SURVEILLANCE",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 0.0, highest_risk_zone: "Yamuna ITO Reach", model_confidence_score: 95.0 },
      situation_overview: "Earth-observation intelligence tracks compound environmental pressures across Delhi NCR, integrating Landsat thermal data for heat islands and Sentinel SAR for Yamuna floodplain flood dynamics.",
      key_observations: [
        "Yamuna active channel buffered by floodplain bio-diversity parks.",
        "Built-up areas show +5.5°C thermal differential over Delhi Ridge forest.",
        "Automated flood telemetry active across all 32 stormwater drains."
      ],
      operational_recommendation: "Enforce strict floodplain setback regulations and scale rooftop cool-roof coatings."
    }
  },

  "bengaluru-tech-corridor": {
    id: "bengaluru-tech-corridor",
    name: "Bengaluru Tech Corridor & Watershed",
    region: "Karnataka, India",
    center: [12.9716, 77.5946],
    zoom: 11,
    bounds: [[12.8000, 77.4500], [13.1500, 77.7500]],
    coastal_type: "Deccan Plateau Watershed & Cascade Lake System",
    total_shoreline_km: 0.0,
    risk: {
      overall_score: 71.2,
      classification: "HIGH",
      confidence: 0.92,
      factors: [
        { name: "Cascade Lake System Obstruction", score: 86, weight: 0.35, description: "Stormwater rajkaluve channel encroachment triggering flash floods in Bellandur" },
        { name: "Groundwater Table Stress", score: 82, weight: 0.25, description: "Deep borewell exploitation in peripheral IT corridors" },
        { name: "Urban Imperviousness Expansion", score: 76, weight: 0.20, description: "Concrete pavement growth reducing natural rainwater infiltration" },
        { name: "Lake Waterbody Eutrophication", score: 68, weight: 0.20, description: "Organic pollution and foaming dynamics in Bellandur & Varthur lakes" }
      ]
    },
    zones: [
      { id: "blr-z1", name: "Bellandur & Varthur Lake Basin", priority_rank: 1, score: 85.5, classification: "CRITICAL", trend: "DRAINAGE_OVERFLOW", erosion_rate_m_yr: 0.0, dominant_risk: "Flash Flooding & Rajakaluve Choke", center: [12.9350, 77.6750] },
      { id: "blr-z2", name: "Whitefield & Outer Ring Road Tech Belt", priority_rank: 2, score: 74.0, classification: "HIGH", trend: "IMPERVIOUS_RUNOFF", erosion_rate_m_yr: 0.0, dominant_risk: "Urban Waterlogging & Traffic Snarls", center: [12.9800, 77.7300] }
    ],
    warnings: [
      { id: "WARN-BLR-01", severity: "HIGH", zone: "Bellandur Outflow Channel", indicator: "Stormwater Surcharge Rate", observed_value: "88%", threshold: "75%", delta: "+13% over threshold", timestamp: "2026-08-18T05:00:00Z", message: "Convective rainfall triggering heavy runoff into Bellandur lake inlet channels." }
    ],
    summary: {
      headline: "Watershed Dynamics & Lake Cascade Management in Bengaluru",
      status: "HIGH SURVEILLANCE ACTIVE",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 0.0, highest_risk_zone: "Bellandur Basin", model_confidence_score: 92.0 },
      situation_overview: "Satellite analysis of Bengaluru's historical interconnected lake system reveals vital drainage bottlenecks and urban imperviousness hotspots.",
      key_observations: ["Rajakaluve storm drain restoration ongoing across major valleys.", "Lake aeration projects showing improved water quality."],
      operational_recommendation: "Re-establish natural wetland buffers along valley lines and expand rainwater harvesting enforcement."
    }
  },

  "sundarbans-delta": {
    id: "sundarbans-delta",
    name: "Sundarbans Biosphere & Estuarine Delta",
    region: "West Bengal, India",
    center: [21.7500, 88.3500],
    zoom: 11,
    bounds: [[21.5000, 88.0000], [22.2000, 89.0000]],
    coastal_type: "Mangrove Tidal Mudflat & Sinking Islands",
    total_shoreline_km: 320.0,
    risk: {
      overall_score: 91.2,
      classification: "CRITICAL",
      confidence: 0.96,
      factors: [
        { name: "Relative Sea Level Rise", score: 98, weight: 0.35, description: "Deltaic subsidence + sea level rise exceeding 8.5 mm/yr" },
        { name: "Island Landmass Submergence", score: 94, weight: 0.30, description: "Ghoramara and Mousuni island embankment loss" },
        { name: "Cyclone Storm Surge Envelope", score: 90, weight: 0.20, description: "Catastrophic saline inundation of freshwater ponds" },
        { name: "Mangrove Forest Degradation", score: 82, weight: 0.15, description: "Loss of protective Sundari tree barrier" }
      ]
    },
    zones: [
      { id: "sundar-z1", name: "Ghoramara Sinking Island", priority_rank: 1, score: 96.5, classification: "CRITICAL", trend: "CHRONIC_SUBMERGENCE", erosion_rate_m_yr: 7.20, dominant_risk: "Total Landmass Loss & Climate Displacement", center: [21.9160, 88.1330] },
      { id: "sundar-z2", name: "Mousuni Island Embankment", priority_rank: 2, score: 92.0, classification: "CRITICAL", trend: "BREACH_CYCLIC", erosion_rate_m_yr: 5.40, dominant_risk: "Earthen Dike Failure & Saline Flood", center: [21.6800, 88.2200] },
      { id: "sundar-z3", name: "Sagar Island South Point", priority_rank: 3, score: 84.0, classification: "HIGH", trend: "PILGRIMAGE_SHORE_SCOUR", erosion_rate_m_yr: 3.80, dominant_risk: "Ganga Sagar Mela Shoreline Erosion", center: [21.6400, 88.0500] }
    ],
    warnings: [
      { id: "WARN-SUN-01", severity: "CRITICAL", zone: "Ghoramara Island West Bank", indicator: "Embankment Scour Rate", observed_value: "7.2 m/yr", threshold: "3.5 m/yr", delta: "+3.7 m/yr over threshold", timestamp: "2026-08-18T08:00:00Z", message: "Muriganga river tidal bore tearing away western earthen ring bund of Ghoramara." }
    ],
    summary: {
      headline: "Rapid Landmass Submergence in Indian Sundarbans Delta",
      status: "CRITICAL ALERT ACTIVE",
      key_metrics: { active_critical_zones: 2, total_erosion_observed_km: 68.0, highest_risk_zone: "Ghoramara Island", model_confidence_score: 96.0 },
      situation_overview: "Sundarbans archipelago facing acute land loss due to high-energy tidal currents, subsidence, and frequent cyclonic surges.",
      key_observations: [
        "Ghoramara island reduced in area by over 50% in the last 2 decades.",
        "Mousuni island earthen dikes breaching on every lunar high tide.",
        "Salinity intrusion damaging mangrove regenerations."
      ],
      operational_recommendation: "Construct heavy rock boulder armored seawalls on vulnerable village boundaries and restore dense mangrove green belts."
    }
  },

  "chennai-marina": {
    id: "chennai-marina",
    name: "Chennai Marina & Ennore Coastal Observatory",
    region: "Tamil Nadu, India",
    center: [13.0500, 80.2824],
    zoom: 12,
    bounds: [[12.9000, 80.2000], [13.2500, 80.3500]],
    coastal_type: "Coromandel Urban Beach & Port Jetty System",
    total_shoreline_km: 45.0,
    risk: {
      overall_score: 68.4,
      classification: "MODERATE",
      confidence: 0.93,
      factors: [
        { name: "Ennore Port Downdrift Erosion", score: 86, weight: 0.30, description: "Severe northern coastal erosion caused by harbor breakwaters" },
        { name: "Northeast Monsoon Wave Climate", score: 78, weight: 0.25, description: "Oct-Dec cyclonic high swell impacts" },
        { name: "Marina Beach Accretion Trap", score: 58, weight: 0.25, description: "South jetty trapping littoral drift into ultra-wide beach" },
        { name: "Urban Stormwater Scour", score: 52, weight: 0.20, description: "Cooum and Adyar river mouth scouring" }
      ]
    },
    zones: [
      { id: "chn-z1", name: "Royapuram & Ennore Coast", priority_rank: 1, score: 85.4, classification: "CRITICAL", trend: "DOWNDRIFT_SCOUR", erosion_rate_m_yr: 4.20, dominant_risk: "Ennore Expressway & Village Scour", center: [13.2200, 80.3250] },
      { id: "chn-z2", name: "Marina Beach Promanade", priority_rank: 2, score: 42.0, classification: "MODERATE", trend: "ACCRETION_WIDE", erosion_rate_m_yr: -1.80, dominant_risk: "Sediment Over-accumulation", center: [13.0500, 80.2824] },
      { id: "chn-z3", name: "Thiruvanmiyur & Kovalam Reach", priority_rank: 3, score: 62.0, classification: "MODERATE", trend: "SEASONAL_RECESSION", erosion_rate_m_yr: 1.60, dominant_risk: "Berm Erosion", center: [12.9800, 80.2600] }
    ],
    warnings: [
      { id: "WARN-CHN-01", severity: "HIGH", zone: "Ennore Express Road", indicator: "Wave Toe Scour", observed_value: "3.8 m Hs", threshold: "2.8 m Hs", delta: "+1.0 m exceedance", timestamp: "2026-08-18T06:00:00Z", message: "High northeast monsoon waves directly striking coastal protection groynes." }
    ],
    summary: {
      headline: "Asymmetric Coastal Drift: Marina Accretion vs Ennore Northern Scour",
      status: "MODERATE TO HIGH RISK",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 14.5, highest_risk_zone: "Ennore Coastal Reach", model_confidence_score: 93.0 },
      situation_overview: "Chennai coast illustrates stark asymmetric coastal engineering effects: Chennai Port breakwaters trap massive sand at Marina while starving northern Ennore shores.",
      key_observations: [
        "Marina beach continues to expand seaward at +1.8 m/yr.",
        "North Chennai and Ennore fishing hamlets losing beachfront rapidly.",
        "Groynes and seawall maintenance required on northern corridor."
      ],
      operational_recommendation: "Implement artificial sand bypassing from south of harbor to starved northern Ennore beaches."
    }
  },

  "kerala-coast": {
    id: "kerala-coast",
    name: "Kerala Arabian Sea Observatory (Kochi & Varkala)",
    region: "Kerala, India",
    center: [9.9312, 76.2673],
    zoom: 11,
    bounds: [[8.7000, 75.8000], [10.2000, 76.6000]],
    coastal_type: "Southwest Monsoon Sea Cliff & Estuarine Barrier",
    total_shoreline_km: 590.0,
    risk: {
      overall_score: 79.5,
      classification: "CRITICAL",
      confidence: 0.94,
      factors: [
        { name: "Southwest Monsoon Swell Energy", score: 94, weight: 0.35, description: "High-energy Arabian sea waves during Jun-Sep" },
        { name: "Varkala Laterite Cliff Slumping", score: 88, weight: 0.25, description: "Geo-heritage cliff toe erosion and landslides" },
        { name: "Chellanam Seawall Overtopping", score: 86, weight: 0.25, description: "Chronic wave runup into coastal fishing households" },
        { name: "Mud Bank (Chakara) Dynamics", score: 48, weight: 0.15, description: "Seasonal floating mud calming zones" }
      ]
    },
    zones: [
      { id: "ker-z1", name: "Chellanam Beach & Groynes (Kochi)", priority_rank: 1, score: 91.0, classification: "CRITICAL", trend: "MONSOON_OVERWASH", erosion_rate_m_yr: 4.40, dominant_risk: "Village Sea Inundation & Seawall Breach", center: [9.7900, 76.2750] },
      { id: "ker-z2", name: "Varkala Helipad Laterite Cliff", priority_rank: 2, score: 84.5, classification: "HIGH", trend: "CLIFF_COLLAPSE", erosion_rate_m_yr: 2.90, dominant_risk: "Geo-Heritage Cliff Failure & Fall", center: [8.7350, 76.7050] },
      { id: "ker-z3", name: "Alappuzha Beach & Pier", priority_rank: 3, score: 62.0, classification: "MODERATE", trend: "CYCLIC_EROSION", erosion_rate_m_yr: 1.40, dominant_risk: "Heritage Pier Foundation Scour", center: [9.4900, 76.3200] }
    ],
    warnings: [
      { id: "WARN-KER-01", severity: "CRITICAL", zone: "Chellanam Coastal Reach", indicator: "Monsoon Swash Height", observed_value: "3.9 m MSL", threshold: "2.8 m MSL", delta: "+1.1 m above revetment", timestamp: "2026-08-18T05:30:00Z", message: "Arabian Sea monsoon surges overtopping tetrapod revetments along Chellanam." }
    ],
    summary: {
      headline: "Intense Monsoon Wave Attacks Along Kerala Coast & Varkala Cliffs",
      status: "CRITICAL ALERT ACTIVE",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 42.0, highest_risk_zone: "Chellanam Reach", model_confidence_score: 94.0 },
      situation_overview: "Kerala coastline experiencing severe monsoon wave energy, impacting dense coastal habitations in Chellanam and eroding ancient geo-heritage cliffs at Varkala.",
      key_observations: [
        "Tetrapod seawall construction in Chellanam has mitigated 60% of direct household inundation.",
        "Varkala laterite cliffs showing structural crack propagation due to basal toe scour.",
        "Seasonal mud-bank formations shifting northward."
      ],
      operational_recommendation: "Extend tetrapod breakwater protection to northern Chellanam and reinforce Varkala cliff base with eco-friendly bio-turfing."
    }
  },

  "mumbai-coast": {
    id: "mumbai-coast",
    name: "Mumbai Coastal Observatory (Marine Drive & Versova)",
    region: "Maharashtra, India",
    center: [18.9440, 72.8230],
    zoom: 12,
    bounds: [[18.8800, 72.7500], [19.2500, 72.9000]],
    coastal_type: "Reclaimed Megacity Island & Coastal Road",
    total_shoreline_km: 140.0,
    risk: {
      overall_score: 75.2,
      classification: "CRITICAL",
      confidence: 0.94,
      factors: [
        { name: "Extreme Monsoon High-Tide Flood", score: 92, weight: 0.35, description: "Concurrent 4.8m spring tide + heavy monsoon rainfall" },
        { name: "Reclaimed Coastal Road Stress", score: 82, weight: 0.25, description: "Reclamation armor seawall wave reflection and scour" },
        { name: "Versova & Juhu Beach Erosion", score: 74, weight: 0.25, description: "Koli fishing village beach recession" },
        { name: "Mithi River Estuary Surge", score: 68, weight: 0.15, description: "Mahim creek tidal choke point" }
      ]
    },
    zones: [
      { id: "mum-z1", name: "Versova Koliwada Reach", priority_rank: 1, score: 86.5, classification: "CRITICAL", trend: "HIGH_TIDE_EROSION", erosion_rate_m_yr: 3.20, dominant_risk: "Fishing Settlement Sea Incursion", center: [19.1350, 72.8120] },
      { id: "mum-z2", name: "Marine Drive Promanade", priority_rank: 2, score: 72.0, classification: "HIGH", trend: "TETRAPOD_ARMORED", erosion_rate_m_yr: 0.40, dominant_risk: "High-Tide Splashover & Urban Disruption", center: [18.9440, 72.8230] },
      { id: "mum-z3", name: "Juhu Beach Tourist Reach", priority_rank: 3, score: 64.0, classification: "MODERATE", trend: "SEASONAL_LOSS", erosion_rate_m_yr: 1.50, dominant_risk: "Berm Recession", center: [19.0980, 72.8260] }
    ],
    warnings: [
      { id: "WARN-MUM-01", severity: "HIGH", zone: "Marine Drive Promenade", indicator: "Spring High Tide Height", observed_value: "4.87 m MSL", threshold: "4.50 m MSL", delta: "+0.37 m above high-water mark", timestamp: "2026-08-18T07:00:00Z", message: "Arabian Sea spring tide combined with monsoon gust producing massive splashover on promenade." }
    ],
    summary: {
      headline: "Monsoon High Tide Inundation & Reclamation Armor Monitoring in Mumbai",
      status: "HIGH RISK MONITORING ACTIVE",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 22.0, highest_risk_zone: "Versova Koliwada", model_confidence_score: 94.0 },
      situation_overview: "Mumbai metropolitan coast protected by artificial tetrapod armor seawalls and newly reclaimed Coastal Road, while natural sandy pockets in Versova and Juhu require continuous nourishment.",
      key_observations: [
        "Coastal Road seawall tetrapods dissipating 75% of wave energy efficiently.",
        "Versova village shoreline experiencing localized scouring during high tide cycles.",
        "Stormwater floodgates operating under automated SCADA control."
      ],
      operational_recommendation: "Reinforce Versova Koliwada shoreline with additional tetrapod armor and maintain Mithi river mouth dredging."
    }
  },

  "cape-hatteras": {
    id: "cape-hatteras",
    name: "Cape Hatteras Coastal Observatory",
    region: "Outer Banks, North Carolina, USA",
    center: [35.2505, -75.5285],
    zoom: 12,
    bounds: [[35.1500, -75.6500], [35.3500, -75.4000]],
    coastal_type: "Microtidal Barrier Island Spit",
    total_shoreline_km: 42.8,
    risk: {
      overall_score: 78.4,
      classification: "CRITICAL",
      confidence: 0.94,
      factors: [
        { name: "Wave Energy Exposure", score: 86, weight: 0.25, description: "Mean wave height > 2.8m from Atlantic swells" },
        { name: "Dune Barrier Integrity", score: 92, weight: 0.25, description: "Primary crest collapsed below 3.5m NAVD88" },
        { name: "Historical Retreat Rate", score: 79, weight: 0.20, description: "Observed shoreline retreat > 3.8 m/yr" },
        { name: "Storm Surge Inundation", score: 84, weight: 0.20, description: "10-year storm flood zone envelope" },
        { name: "Sediment Supply Deficit", score: 62, weight: 0.10, description: "Negative alongshore littoral drift budget" }
      ]
    },
    zones: [
      { id: "hatteras-z1", name: "Hatteras Inlet Spit", priority_rank: 1, score: 91.2, classification: "CRITICAL", trend: "ACCELERATING_EROSION", erosion_rate_m_yr: 4.82, dominant_risk: "Barrier Breach & Cut-through", center: [35.2300, -75.5200] },
      { id: "hatteras-z2", name: "Buxton Overwash Sector", priority_rank: 2, score: 82.5, classification: "CRITICAL", trend: "CHRONIC_RETREAT", erosion_rate_m_yr: 3.95, dominant_risk: "NC-12 Lifeline Overwash", center: [35.3100, -75.4720] }
    ],
    warnings: [
      { id: "WARN-HAT-01", severity: "CRITICAL", zone: "Hatteras Inlet Spit", indicator: "Dune Scarp Breach", observed_value: "1.42 m", threshold: "2.50 m", delta: "-1.08 m below safety line", timestamp: "2026-08-18T06:30:00Z", message: "Primary dune crest breach detected." }
    ],
    summary: {
      headline: "Severe Barrier Spit Contraction at Cape Hatteras",
      status: "CRITICAL ALERT ACTIVE",
      key_metrics: { active_critical_zones: 2, total_erosion_observed_km: 26.4, highest_risk_zone: "Hatteras Inlet Spit", model_confidence_score: 94.2 },
      situation_overview: "Multi-temporal satellite observation indicates acute sediment starvation along 62% of oceanfront transect.",
      key_observations: ["Primary dune barrier lost 64% volume.", "Highway 12 buffered by less than 45m beach width."],
      operational_recommendation: "Deploy emergency beach nourishment and sand-fencing."
    }
  },

  "miami-beach": {
    id: "miami-beach",
    name: "Miami Beach & Biscayne Bay Observatory",
    region: "Florida, USA",
    center: [25.7907, -80.1300],
    zoom: 13,
    bounds: [[25.7400, -80.1800], [25.8600, -80.1000]],
    coastal_type: "Urban Barrier Island & Seawall",
    total_shoreline_km: 24.6,
    risk: {
      overall_score: 84.6,
      classification: "CRITICAL",
      confidence: 0.96,
      factors: [
        { name: "Sunny Day Tidal Flooding", score: 94, weight: 0.30, description: "King tide inundation" },
        { name: "Sea Level Rise Acceleration", score: 91, weight: 0.25, description: "+9.2mm/yr rise" }
      ]
    },
    zones: [
      { id: "miami-z1", name: "South Beach 1st to 15th St", priority_rank: 1, score: 89.4, classification: "CRITICAL", trend: "HIGH_VULNERABILITY", erosion_rate_m_yr: 2.85, dominant_risk: "Urban Flooding", center: [25.7780, -80.1310] }
    ],
    warnings: [
      { id: "WARN-MIA-01", severity: "CRITICAL", zone: "Indian Creek Bulkhead", indicator: "Tidal Surcharge Height", observed_value: "+0.85 m", threshold: "+0.60 m", delta: "+0.25 m above crest", timestamp: "2026-08-18T07:15:00Z", message: "King tide peak water levels causing street flooding." }
    ],
    summary: {
      headline: "Tidal Surge & Karst Subsurface Inundation in Miami Beach",
      status: "CRITICAL ALERT ACTIVE",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 18.2, highest_risk_zone: "South Beach", model_confidence_score: 96.0 },
      situation_overview: "Miami Beach exhibits compound flood risks driven by king tides.",
      key_observations: ["Indian Creek seawall overtopping observed.", "Sand loss rate accelerated."],
      operational_recommendation: "Activate auxiliary high-capacity mobile pumps."
    }
  }
};

/**
 * Generate synthetic environmental dataset for ANY arbitrary searched coordinate on Earth,
 * dynamically adapting between Coastal Marine and Inland Urban/Riverine/Terrestrial environments.
 */
export function generateDynamicCoastalSector(name, lat, lng) {
  const safeName = name.split(',')[0];
  const delta = 0.08;

  // Simple heuristic: check if location is inland vs coastal based on keyword or coordinates
  const nameLower = name.toLowerCase();
  const isInland =
    nameLower.includes('delhi') ||
    nameLower.includes('bhubaneswar') ||
    nameLower.includes('cuttack') ||
    nameLower.includes('bengaluru') ||
    nameLower.includes('bangalore') ||
    nameLower.includes('hyderabad') ||
    nameLower.includes('pune') ||
    nameLower.includes('jaipur') ||
    nameLower.includes('lucknow') ||
    nameLower.includes('rourkela') ||
    nameLower.includes('sambalpur') ||
    nameLower.includes('london') ||
    nameLower.includes('paris') ||
    nameLower.includes('chicago') ||
    (!nameLower.includes('beach') &&
     !nameLower.includes('coast') &&
     !nameLower.includes('port') &&
     !nameLower.includes('island') &&
     !nameLower.includes('sea') &&
     !nameLower.includes('bay') &&
     !nameLower.includes('ocean'));

  if (isInland) {
    return {
      id: `custom-inland-${lat.toFixed(2)}-${lng.toFixed(2)}`,
      name: `${safeName} Environmental & Terrestrial Observatory`,
      region: name,
      center: [lat, lng],
      zoom: 12,
      bounds: [[lat - delta, lng - delta], [lat + delta, lng + delta]],
      coastal_type: "Inland Urban & Riverine Terrestrial Sector",
      total_shoreline_km: 0.0,
      risk: {
        overall_score: 71.4,
        classification: "HIGH",
        confidence: 0.93,
        factors: [
          { name: "Urban Heat Island & Thermal Load", score: 84, weight: 0.30, description: `Satellite thermal infrared reflectance for ${safeName}` },
          { name: "River Basin & Rainfall Drainage Runoff", score: 78, weight: 0.25, description: "Hydrologic elevation gradient & stormwater imperviousness" },
          { name: "Groundwater Table & Soil Moisture Deficit", score: 72, weight: 0.25, description: "Subsurface aquifer depletion and seasonal soil dryness" },
          { name: "Vegetative Buffer & Tree Canopy Index (NDVI)", score: 66, weight: 0.20, description: "Satellite multispectral vegetation health and canopy density" }
        ]
      },
      zones: [
        { id: "custom-z1", name: `${safeName} Central Built-Up District`, priority_rank: 1, score: 82.5, classification: "CRITICAL", trend: "HIGH_THERMAL_STRESS", erosion_rate_m_yr: 0.0, dominant_risk: "Urban Heat & Drainage Congestion", center: [lat + 0.008, lng - 0.008] },
        { id: "custom-z2", name: `${safeName} Watershed Lowland Reach`, priority_rank: 2, score: 68.0, classification: "MODERATE", trend: "SEASONAL_WATERLOGGING", erosion_rate_m_yr: 0.0, dominant_risk: "Runoff Accumulation", center: [lat - 0.015, lng + 0.008] }
      ],
      warnings: [
        { id: `WARN-${safeName.substring(0, 3).toUpperCase()}-01`, severity: "HIGH", zone: `${safeName} Urban Core`, indicator: "Surface Thermal & Runoff Index", observed_value: "82.5 / 100", threshold: "70.0", delta: "+12.5 exceedance", timestamp: new Date().toISOString(), message: `Automated satellite environmental surveillance detected elevated thermal load and low rainwater infiltration in ${safeName}.` }
      ],
      summary: {
        headline: `Urban Environmental & Hydrologic Assessment for ${safeName}`,
        status: "ENVIRONMENTAL SURVEILLANCE ACTIVE",
        key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 0.0, highest_risk_zone: `${safeName} Central Built-Up District`, model_confidence_score: 93.0 },
        situation_overview: `COAST-AI satellite intelligence generated for ${name}. High-resolution Earth observation analysis provides multi-spectral insights on urban microclimates, stormwater catchment, and terrain stability.`,
        key_observations: [
          `Built-up sector exhibits high impervious surface density resulting in increased storm runoff.`,
          `Urban green cover (NDVI) requires targeted expansion along transportation corridors.`,
          `Satellite SAR and thermal infrared models demonstrate 93.0% confidence.`
        ],
        operational_recommendation: `Deploy green roofs, permeable drainage pavements, and municipal tree canopy expansion.`
      }
    };
  }

  // Coastal / Marine generator
  return {
    id: `custom-coast-${lat.toFixed(2)}-${lng.toFixed(2)}`,
    name: `${safeName} Coastal Observatory`,
    region: name,
    center: [lat, lng],
    zoom: 12,
    bounds: [[lat - delta, lng - delta], [lat + delta, lng + delta]],
    coastal_type: "Satellite Monitored Coastal Sector",
    total_shoreline_km: 34.5,
    risk: {
      overall_score: 76.8,
      classification: "HIGH",
      confidence: 0.93,
      factors: [
        { name: "Wave Energy Exposure", score: 84, weight: 0.30, description: `Satellite estimated wave swell envelope for ${safeName}` },
        { name: "Shoreline Retreat Trend", score: 78, weight: 0.25, description: "Multi-year optical SAR reflectance displacement" },
        { name: "Storm Surge Susceptibility", score: 76, weight: 0.25, description: "Low-elevation coastal zone envelope" },
        { name: "Geomorphic Stability Index", score: 68, weight: 0.20, description: "Vegetation index (NDVI/MNDWI) spectral buffer" }
      ]
    },
    zones: [
      { id: "custom-z1", name: `${safeName} Oceanfront Reach`, priority_rank: 1, score: 85.5, classification: "CRITICAL", trend: "RETREAT_ACTIVE", erosion_rate_m_yr: 3.65, dominant_risk: "Shoreline Recession", center: [lat + 0.01, lng - 0.01] },
      { id: "custom-z2", name: `${safeName} Buffer Zone`, priority_rank: 2, score: 69.0, classification: "MODERATE", trend: "CYCLIC_CHANGE", erosion_rate_m_yr: 1.85, dominant_risk: "Tidal Scour", center: [lat - 0.02, lng + 0.01] }
    ],
    warnings: [
      { id: `WARN-${safeName.substring(0, 3).toUpperCase()}-01`, severity: "HIGH", zone: `${safeName} Primary Reach`, indicator: "Satellite Observed Retreat", observed_value: "3.65 m/yr", threshold: "2.50 m/yr", delta: "+1.15 m/yr exceedance", timestamp: new Date().toISOString(), message: `Automated change detection identified accelerated shoreline retreat along ${safeName} transect.` }
    ],
    summary: {
      headline: `Geomorphic Assessment for ${safeName} Coastal Sector`,
      status: "HIGH RISK MONITORING ACTIVE",
      key_metrics: { active_critical_zones: 1, total_erosion_observed_km: 24.5, highest_risk_zone: `${safeName} Oceanfront Reach`, model_confidence_score: 93.0 },
      situation_overview: `COAST-AI automated inference generated for ${name}. High-resolution satellite change analysis indicates active shoreline retreat with localized erosion hotspots.`,
      key_observations: [
        `Primary oceanfront transect exhibits estimated retreat rate of 3.65 m/yr.`,
        `Low-elevation coastal zone vulnerable to compound surge and high tide flooding.`,
        `Autonomous AI model confidence rated at 93.0% based on Sentinel-2 optical and SAR time-series.`
      ],
      operational_recommendation: `Establish localized drone LiDAR transect survey and monitor high-tide swash runup.`
    }
  };
}

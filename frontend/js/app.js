/**
 * COAST-AI Geospatial Intelligence & Decision Support Platform
 * Frontend Interactive Dashboard Controller
 */

const API_BASE = window.location.origin;

// Application State
const state = {
  baseline: "2016",
  comparison: "2026",
  numTransects: 30,
  studyAreaGeo: null,
  timelineData: null,
  changeData: null,
  riskData: null,
  zonesData: null,
  warningsData: null,
  summaryData: null,
  layers: {
    zones: true,
    baselineCoast: true,
    comparisonCoast: true,
    transects: true,
    riskColors: true
  },
  map: null,
  layerGroups: {
    zones: null,
    coastlines: null,
    transects: null
  },
  charts: {
    displacement: null
  }
};

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initEventListeners();
  loadInitialData();
});

// 1. Initialize Leaflet Map
function initMap() {
  const mapCenter = [19.805, 85.845]; // Puri Coastal Sector
  state.map = L.map("map", {
    center: mapCenter,
    zoom: 12,
    zoomControl: false
  });

  L.control.zoom({ position: "bottomright" }).addTo(state.map);

  // Basemaps
  const darkMatter = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    maxZoom: 19
  });

  const esriSatellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    maxZoom: 18
  });

  darkMatter.addTo(state.map);

  state.baseMaps = {
    "Dark Matter (Carto)": darkMatter,
    "High-Res Satellite (Esri)": esriSatellite
  };

  state.layerGroups.zones = L.layerGroup().addTo(state.map);
  state.layerGroups.coastlines = L.layerGroup().addTo(state.map);
  state.layerGroups.transects = L.layerGroup().addTo(state.map);
}

// 2. Fetch and render all data
async function loadInitialData() {
  try {
    showLoading(true);

    // Fetch Timeline & Study Area
    const [timelineRes, studyAreaRes] = await Promise.all([
      fetch(`${API_BASE}/api/timeline`).then(r => r.json()),
      fetch(`${API_BASE}/api/study-area`).then(r => r.json())
    ]);

    state.timelineData = timelineRes;
    state.studyAreaGeo = studyAreaRes;

    populateTimelineSelects(timelineRes.historical_periods);
    await updateAnalyticsAndLayers();

    showLoading(false);
  } catch (err) {
    console.error("Error loading initial platform data:", err);
    showLoading(false);
  }
}

function populateTimelineSelects(periods) {
  const baseSelect = document.getElementById("baseline-select");
  const compSelect = document.getElementById("comparison-select");

  baseSelect.innerHTML = "";
  compSelect.innerHTML = "";

  periods.forEach(p => {
    baseSelect.innerHTML += `<option value="${p}">${p}</option>`;
    compSelect.innerHTML += `<option value="${p}">${p}</option>`;
  });

  baseSelect.value = state.baseline;
  compSelect.value = state.comparison;
}

// 3. Update all analytics, map layers, and graphs
async function updateAnalyticsAndLayers() {
  const { baseline, comparison, numTransects } = state;

  try {
    const [changeRes, riskRes, zonesRes, warningsRes] = await Promise.all([
      fetch(`${API_BASE}/api/change?baseline=${baseline}&comparison=${comparison}&transects=${numTransects}`).then(r => r.json()),
      fetch(`${API_BASE}/api/risk?baseline=${baseline}&comparison=${comparison}`).then(r => r.json()),
      fetch(`${API_BASE}/api/zones?baseline=${baseline}&comparison=${comparison}`).then(r => r.json()),
      fetch(`${API_BASE}/api/warnings?baseline=${baseline}&comparison=${comparison}`).then(r => r.json())
    ]);

    state.changeData = changeRes;
    state.riskData = riskRes;
    state.zonesData = zonesRes;
    state.warningsData = warningsRes;

    renderMapLayers();
    renderQuickKPIs();
    renderDisplacementChart();
    renderPriorityTable();
    renderWarningsBanner();
  } catch (err) {
    console.error("Failed to update analytics:", err);
  }
}

// 4. Map Layer Rendering
function renderMapLayers() {
  // Clear previous layers
  state.layerGroups.zones.clearLayers();
  state.layerGroups.coastlines.clearLayers();
  state.layerGroups.transects.clearLayers();

  const riskLookup = {};
  if (state.riskData && state.riskData.risk_assessment) {
    state.riskData.risk_assessment.forEach(r => {
      riskLookup[r.zone_id] = r;
    });
  }

  // 1. Render Monitoring Zones
  if (state.layers.zones && state.studyAreaGeo) {
    L.geoJSON(state.studyAreaGeo, {
      style: (feature) => {
        const zoneId = feature.properties.zone_id;
        const risk = riskLookup[zoneId];
        let color = "#3b82f6";
        let fillOpacity = 0.22;

        if (state.layers.riskColors && risk) {
          if (risk.risk_category === "Critical Risk") color = "#ef4444";
          else if (risk.risk_category === "High Risk") color = "#f97316";
          else if (risk.risk_category === "Moderate Risk") color = "#eab308";
          else color = "#10b981";
          fillOpacity = 0.35;
        }

        return {
          color: color,
          weight: 2,
          opacity: 0.9,
          fillColor: color,
          fillOpacity: fillOpacity,
          dashArray: "3, 3"
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const r = riskLookup[p.zone_id] || {};
        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #111;">
            <strong style="color: #0284c7; font-size: 14px;">${p.zone_id}: ${p.zone_name}</strong><br/>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #ddd;"/>
            <b>Coastal Type:</b> ${p.coastal_type}<br/>
            <b>Vulnerability:</b> ${p.vulnerability_profile}<br/>
            <b>Critical Assets:</b> ${p.critical_infrastructure}<br/>
            ${r.composite_risk_score ? `<b>Composite Risk:</b> <span style="color:${getRiskHex(r.risk_category)};font-weight:bold;">${r.composite_risk_score} (${r.risk_category})</span><br/>` : ''}
            ${r.net_shoreline_shift_m ? `<b>Net Shift:</b> ${r.net_shoreline_shift_m} m (${r.shoreline_change_rate_m_yr} m/yr)` : ''}
          </div>
        `;
        layer.bindPopup(popupContent);
      }
    }).addTo(state.layerGroups.zones);
  }

  // 2. Render Coastline Lines (Baseline & Comparison)
  if (state.changeData && state.changeData.features) {
    const baselineFeat = state.changeData.features.find(f => f.properties && f.properties.layer_type === "baseline_shoreline");
    const compFeat = state.changeData.features.find(f => f.properties && f.properties.layer_type === "comparison_shoreline");

    if (state.layers.baselineCoast && baselineFeat) {
      L.geoJSON(baselineFeat, {
        style: {
          color: "#06b6d4",
          weight: 3.5,
          opacity: 0.95
        }
      }).bindTooltip(`Baseline Coastline (${state.baseline})`, { sticky: true }).addTo(state.layerGroups.coastlines);
    }

    if (state.layers.comparisonCoast && compFeat) {
      L.geoJSON(compFeat, {
        style: {
          color: "#f43f5e",
          weight: 3.5,
          opacity: 0.95,
          dashArray: "6, 4"
        }
      }).bindTooltip(`Comparison Coastline (${state.comparison})`, { sticky: true }).addTo(state.layerGroups.coastlines);
    }

    // 3. Render Transects
    if (state.layers.transects) {
      const transects = state.changeData.features.filter(f => f.properties && f.properties.layer_type === "transect");
      transects.forEach(t => {
        const p = t.properties;
        const isErosion = p.displacement_m < 0;
        const color = isErosion ? "#ef4444" : "#10b981";

        const lineLayer = L.geoJSON(t, {
          style: {
            color: color,
            weight: 2.2,
            opacity: 0.85
          }
        });

        lineLayer.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #111;">
            <strong>Transect #${p.transect_index + 1} (${p.transect_id})</strong><br/>
            <hr style="margin: 4px 0; border: 0; border-top: 1px solid #ddd;"/>
            <b>Status:</b> <span style="color:${color};font-weight:bold;">${p.status}</span><br/>
            <b>Displacement:</b> ${p.displacement_m} m<br/>
            <b>Annual Rate:</b> ${p.rate_m_per_year} m/yr
          </div>
        `);

        lineLayer.addTo(state.layerGroups.transects);
      });
    }
  }
}

// 5. Render KPIs
function renderQuickKPIs() {
  if (!state.changeData || !state.riskData) return;

  const stats = state.changeData.properties || {};
  const risks = state.riskData.risk_assessment || [];

  const maxErosion = stats.max_erosion_m !== undefined ? `${stats.max_erosion_m} m` : "--";
  const meanShift = stats.mean_displacement_m !== undefined ? `${stats.mean_displacement_m} m` : "--";
  const criticalCount = risks.filter(r => r.risk_category === "Critical Risk").length;
  const warningCount = state.warningsData && state.warningsData.warnings ? state.warningsData.warnings.length : 0;

  document.getElementById("kpi-max-erosion").innerText = maxErosion;
  document.getElementById("kpi-mean-shift").innerText = meanShift;
  document.getElementById("kpi-critical-zones").innerText = `${criticalCount} Zones`;
  document.getElementById("kpi-active-warnings").innerText = `${warningCount} Active`;
}

// 6. Render Cross-Shore Displacement Chart
function renderDisplacementChart() {
  if (!state.changeData || !state.changeData.features) return;

  const transects = state.changeData.features.filter(f => f.properties && f.properties.layer_type === "transect");
  const labels = transects.map(t => `#${t.properties.transect_index + 1}`);
  const displacements = transects.map(t => t.properties.displacement_m);
  const backgroundColors = displacements.map(d => d < 0 ? "rgba(239, 68, 68, 0.7)" : "rgba(16, 185, 129, 0.7)");

  const ctx = document.getElementById("displacementChart").getContext("2d");

  if (state.charts.displacement) {
    state.charts.displacement.destroy();
  }

  state.charts.displacement = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Displacement (m)",
        data: displacements,
        backgroundColor: backgroundColors,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => `Shift: ${item.raw} m`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#94a3b8", font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
          grid: { display: false }
        },
        y: {
          ticks: { color: "#94a3b8", font: { size: 10 } },
          grid: { color: "rgba(255, 255, 255, 0.06)" }
        }
      }
    }
  });
}

// 7. Render Priority Zones Table
function renderPriorityTable() {
  const tbody = document.getElementById("priority-table-body");
  tbody.innerHTML = "";

  if (!state.zonesData || !state.zonesData.priority_ranking) return;

  state.zonesData.priority_ranking.forEach((z, idx) => {
    const badgeClass = getBadgeClass(z.risk_category);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>#${idx + 1}</strong></td>
      <td><strong>${z.zone_name}</strong><br/><span style="color:#64748b;font-size:10px;">${z.zone_id}</span></td>
      <td><span class="badge ${badgeClass}">${z.composite_risk_score}</span></td>
      <td style="color:${z.shoreline_change_rate_m_yr < 0 ? '#ef4444' : '#10b981'};font-weight:600;">
        ${z.shoreline_change_rate_m_yr} m/yr
      </td>
    `;

    row.addEventListener("click", () => {
      // Zoom map to zone polygon
      if (state.studyAreaGeo && state.studyAreaGeo.features) {
        const feat = state.studyAreaGeo.features.find(f => f.properties.zone_id === z.zone_id);
        if (feat) {
          const bbox = L.geoJSON(feat).getBounds();
          state.map.flyToBounds(bbox, { maxZoom: 14, duration: 1.2 });
        }
      }
    });

    tbody.appendChild(row);
  });
}

// 8. Render Early Warnings Feed
function renderWarningsBanner() {
  const container = document.getElementById("warnings-feed");
  container.innerHTML = "";

  if (!state.warningsData || !state.warningsData.warnings || state.warningsData.warnings.length === 0) {
    container.innerHTML = `<div class="alert-desc" style="color:#10b981;">No active critical coastal warnings.</div>`;
    return;
  }

  state.warningsData.warnings.forEach(w => {
    const card = document.createElement("div");
    card.className = "alert-banner";
    if (w.severity === "CRITICAL") {
      card.style.background = "rgba(239, 68, 68, 0.12)";
      card.style.borderColor = "rgba(239, 68, 68, 0.4)";
    } else if (w.severity === "HIGH") {
      card.style.background = "rgba(249, 115, 22, 0.12)";
      card.style.borderColor = "rgba(249, 115, 22, 0.4)";
    } else {
      card.style.background = "rgba(234, 179, 8, 0.12)";
      card.style.borderColor = "rgba(234, 179, 8, 0.4)";
    }

    card.innerHTML = `
      <div class="alert-header">
        <span class="alert-tag" style="background:${getSeverityBg(w.severity)}">${w.severity}</span>
        <span style="font-size:11px;color:#94a3b8;">${w.zone_id}</span>
      </div>
      <div class="alert-headline">${w.zone_name}</div>
      <div class="alert-desc">${w.message}</div>
      <div style="font-size:11px;color:#38bdf8;margin-top:4px;"><strong>Recommended:</strong> ${w.recommended_action}</div>
    `;
    container.appendChild(card);
  });
}

// 9. Event Listeners
function initEventListeners() {
  // Baseline / Comparison Change
  document.getElementById("baseline-select").addEventListener("change", (e) => {
    state.baseline = e.target.value;
    updateAnalyticsAndLayers();
  });

  document.getElementById("comparison-select").addEventListener("change", (e) => {
    state.comparison = e.target.value;
    updateAnalyticsAndLayers();
  });

  // Transect Slider
  const transectSlider = document.getElementById("transect-slider");
  const transectVal = document.getElementById("transect-val");
  transectSlider.addEventListener("input", (e) => {
    state.numTransects = parseInt(e.target.value, 10);
    transectVal.innerText = state.numTransects;
  });
  transectSlider.addEventListener("change", () => {
    updateAnalyticsAndLayers();
  });

  // Layer Toggles
  document.getElementById("layer-zones").addEventListener("change", (e) => {
    state.layers.zones = e.target.checked;
    renderMapLayers();
  });
  document.getElementById("layer-baseline").addEventListener("change", (e) => {
    state.layers.baselineCoast = e.target.checked;
    renderMapLayers();
  });
  document.getElementById("layer-comparison").addEventListener("change", (e) => {
    state.layers.comparisonCoast = e.target.checked;
    renderMapLayers();
  });
  document.getElementById("layer-transects").addEventListener("change", (e) => {
    state.layers.transects = e.target.checked;
    renderMapLayers();
  });
  document.getElementById("layer-risk").addEventListener("change", (e) => {
    state.layers.riskColors = e.target.checked;
    renderMapLayers();
  });

  // Basemap Selector
  document.getElementById("basemap-select").addEventListener("change", (e) => {
    const selected = e.target.value;
    if (selected === "satellite") {
      state.map.removeLayer(state.baseMaps["Dark Matter (Carto)"]);
      state.baseMaps["High-Res Satellite (Esri)"].addTo(state.map);
    } else {
      state.map.removeLayer(state.baseMaps["High-Res Satellite (Esri)"]);
      state.baseMaps["Dark Matter (Carto)"].addTo(state.map);
    }
  });

  // Executive Summary Button & Modal
  document.getElementById("btn-summary").addEventListener("click", openSummaryModal);
  document.getElementById("modal-close-btn").addEventListener("click", closeSummaryModal);
  document.getElementById("modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") closeSummaryModal();
  });
}

async function openSummaryModal() {
  const modal = document.getElementById("modal-backdrop");
  const modalBody = document.getElementById("modal-summary-content");
  modal.classList.add("active");
  modalBody.innerHTML = `<div style="text-align:center;padding:20px;color:#94a3b8;">Generating data-backed executive situation report...</div>`;

  try {
    const res = await fetch(`${API_BASE}/api/summary?baseline=${state.baseline}&comparison=${state.comparison}`).then(r => r.json());
    state.summaryData = res;

    modalBody.innerHTML = `
      <div class="summary-block">
        <h4>Executive Overview</h4>
        <p>${res.executive_summary || 'Situation assessment complete.'}</p>
      </div>

      <div class="summary-block" style="border-left-color:#ef4444;">
        <h4>Highest Vulnerability Sector</h4>
        <p><strong>${res.highest_risk_zone ? res.highest_risk_zone.zone_name : 'N/A'}</strong> (Score: ${res.highest_risk_zone ? res.highest_risk_zone.composite_risk_score : 'N/A'})<br/>
        Critical Infrastructure: ${res.highest_risk_zone ? res.highest_risk_zone.critical_infrastructure : 'N/A'}</p>
      </div>

      <div class="summary-block" style="border-left-color:#38bdf8;">
        <h4>Study Area Metadata</h4>
        <p>Sector: ${res.study_area ? res.study_area.title : 'Puri Coastal Sector'}<br/>
        Reference CRS: ${res.study_area ? res.study_area.reference_crs : 'EPSG:4326'} | Projected: EPSG:32645<br/>
        Observation Range: ${state.baseline} &rarr; ${state.comparison}</p>
      </div>
    `;
  } catch (err) {
    modalBody.innerHTML = `<div style="color:#ef4444;">Failed to load summary: ${err.message}</div>`;
  }
}

function closeSummaryModal() {
  document.getElementById("modal-backdrop").classList.remove("active");
}

function showLoading(isLoading) {
  const el = document.getElementById("status-indicator");
  if (el) {
    el.innerHTML = isLoading 
      ? `<span class="pulse-dot" style="background:#38bdf8;"></span> Computing Geospatial Analytics...`
      : `<span class="pulse-dot"></span> System Live &amp; Operational`;
  }
}

function getRiskHex(category) {
  if (category === "Critical Risk") return "#ef4444";
  if (category === "High Risk") return "#f97316";
  if (category === "Moderate Risk") return "#eab308";
  return "#10b981";
}

function getBadgeClass(category) {
  if (category === "Critical Risk") return "badge-critical";
  if (category === "High Risk") return "badge-high";
  if (category === "Moderate Risk") return "badge-moderate";
  return "badge-low";
}

function getSeverityBg(sev) {
  if (sev === "CRITICAL") return "#ef4444";
  if (sev === "HIGH") return "#f97316";
  return "#eab308";
}

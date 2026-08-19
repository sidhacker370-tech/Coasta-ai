import {
  MOCK_STUDY_AREA,
  MOCK_TIMELINE,
  getMockCoastlineGeoJSON,
  getMockChangeGeoJSON,
  MOCK_RISK,
  MOCK_ZONES,
  MOCK_WARNINGS,
  MOCK_SUMMARY
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT_MS = 3500;

/**
 * Generic fetch helper with timeout and automatic demonstration fallback.
 */
async function fetchWithFallback(endpoint, fallbackDataFn) {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json, application/geo+json'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[COAST-AI API] ${endpoint} returned status ${response.status}. Using demonstration data.`);
      return {
        data: typeof fallbackDataFn === 'function' ? fallbackDataFn() : fallbackDataFn,
        isDemo: true,
        endpoint,
        status: response.status
      };
    }

    const json = await response.json();
    return {
      data: json,
      isDemo: false,
      endpoint,
      status: response.status
    };
  } catch (err) {
    console.info(`[COAST-AI API] Backend unreachable at ${url} (${err.name || err.message}). Serving demonstration data.`);
    return {
      data: typeof fallbackDataFn === 'function' ? fallbackDataFn() : fallbackDataFn,
      isDemo: true,
      endpoint,
      error: err.message
    };
  }
}

export const api = {
  /**
   * GET /api/study-area
   */
  async getStudyArea() {
    return fetchWithFallback('/api/study-area', MOCK_STUDY_AREA);
  },

  /**
   * GET /api/timeline
   */
  async getTimeline() {
    return fetchWithFallback('/api/timeline', MOCK_TIMELINE);
  },

  /**
   * GET /api/coastline?period=<period>
   */
  async getCoastline(period) {
    const query = period ? `?period=${encodeURIComponent(period)}` : '';
    return fetchWithFallback(`/api/coastline${query}`, () => getMockCoastlineGeoJSON(period));
  },

  /**
   * GET /api/change?from=<from>&to=<to>
   */
  async getChange(fromPeriod, toPeriod) {
    const fromP = fromPeriod || '2018';
    const toP = toPeriod || '2026';
    return fetchWithFallback(
      `/api/change?from=${encodeURIComponent(fromP)}&to=${encodeURIComponent(toP)}`,
      () => getMockChangeGeoJSON(fromP, toP)
    );
  },

  /**
   * GET /api/risk
   */
  async getRisk() {
    return fetchWithFallback('/api/risk', MOCK_RISK);
  },

  /**
   * GET /api/zones
   */
  async getZones() {
    return fetchWithFallback('/api/zones', MOCK_ZONES);
  },

  /**
   * GET /api/warnings
   */
  async getWarnings() {
    return fetchWithFallback('/api/warnings', MOCK_WARNINGS);
  },

  /**
   * GET /api/summary
   */
  async getSummary() {
    return fetchWithFallback('/api/summary', MOCK_SUMMARY);
  },

  /**
   * Helper to check raw connectivity status
   */
  async checkHealth() {
    try {
      const res = await fetch(`${BASE_URL}/api/study-area`, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  getBaseUrl() {
    return BASE_URL;
  }
};

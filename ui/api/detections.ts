
import { CONFIG } from '../config';
import { MOCK_ALERTS } from '../constants/mockData/detections';
import { Alert, Severity, AlertStatus } from '../types';

export interface AlertFilter {
  severity?: Severity[];
  status?: AlertStatus[];
  search?: string;
  limit?: number;
  offset?: number;
}

export interface FetchAlertsResponse {
  alerts: Alert[];
  total: number;
  summary: {
    critical: number;
    high: number;
    investigating: number;
    resolved: number;
  };
}

/**
 * Simulates a server-side fetch with filtering and pagination.
 */
export const fetchAlerts = async (filters?: AlertFilter): Promise<FetchAlertsResponse> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.search) params.append('search', filters.search);
    
    // In a real app, this would be an actual HTTP call
    const res = await fetch(`${CONFIG.API_BASE_URL}/detections/alerts?${params.toString()}`);
    if (res.ok) return await res.json();
    throw new Error('Fallback to mock');
  } catch {
    // SERVER-SIDE LOGIC SIMULATION
    let filtered = [...MOCK_ALERTS];
    
    // 1. Search Filter (Case insensitive)
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(s) || 
        a.id.toLowerCase().includes(s) || 
        a.description?.toLowerCase().includes(s) ||
        a.sourceIp.toLowerCase().includes(s) ||
        a.destinationIp.toLowerCase().includes(s)
      );
    }

    // 2. Severity Filter (Multi-select)
    if (filters?.severity && filters.severity.length > 0) {
      filtered = filtered.filter(a => filters.severity!.includes(a.severity));
    }

    // 3. Status Filter (Multi-select)
    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(a => filters.status!.includes(a.status));
    }

    const total = filtered.length;
    
    // 4. Pagination
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 5;
    const paginated = filtered.slice(offset, offset + limit);

    // 5. Global Summary Stats (Simulating a separate dashboard calculation)
    const summary = {
      critical: MOCK_ALERTS.filter(a => a.severity === 'critical').length,
      high: MOCK_ALERTS.filter(a => a.severity === 'high').length,
      investigating: MOCK_ALERTS.filter(a => a.status === 'investigating').length,
      resolved: MOCK_ALERTS.filter(a => a.status === 'resolved').length,
    };

    return {
      alerts: paginated,
      total: total,
      summary
    };
  }
};

export const fetchRecentAlerts = async (): Promise<Alert[]> => {
  const response = await fetchAlerts({ limit: 5 });
  return response.alerts;
};

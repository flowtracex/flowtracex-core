
import { CONFIG } from '../config';
import { MOCK_DASHBOARD, MOCK_PROTOCOLS } from '../constants/mockData/dashboard';
import { DashboardOverview, TrafficPoint, ProtocolData } from '../types';

const handleResponse = async (res: Response) => {
  if (!res.ok) throw new Error('API Error');
  return res.json();
};

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/dashboard/overview`);
    return await handleResponse(res);
  } catch {
    return MOCK_DASHBOARD;
  }
};

export const fetchNetworkTraffic = async (): Promise<TrafficPoint[]> => {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/dashboard/network-traffic`);
    const data = await handleResponse(res);
    return data.dataPoints;
  } catch {
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${i}:00`,
      trafficMBps: 1200 + Math.random() * 800,
      alerts: Math.random() > 0.9 ? 1 : 0
    }));
  }
};

export const fetchProtocolDistribution = async (): Promise<ProtocolData[]> => {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/dashboard/protocol-distribution`);
    const data = await handleResponse(res);
    return data.protocols;
  } catch {
    return MOCK_PROTOCOLS;
  }
};

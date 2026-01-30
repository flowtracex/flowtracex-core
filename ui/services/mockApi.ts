
import { DashboardOverview, TrafficPoint, ProtocolData, Alert, ThreatCategory } from '../types';
import { CONFIG } from '../config';

/**
 * Standard response handler for fetch requests.
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }
  return response.json();
};

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/dashboard/overview`);
    return await handleResponse(response);
  } catch (e) {
    // Dummy Data from Documentation (Page 1)
    return {
      critical_alerts: { count: 12, change: "+3", period: "24h" },
      high_alerts: { count: 23, change: "-5", period: "24h" },
      assets_monitored: { count: 1247, change: "+12", period: "24h" },
      network_health: { percentage: 98.2, status: "operational" }
    };
  }
};

export const fetchNetworkTraffic = async (): Promise<TrafficPoint[]> => {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/dashboard/network-traffic?timeRange=24h`);
    const data = await handleResponse(response);
    return data.dataPoints;
  } catch (e) {
    // Generate synthetic timeline for last 24h
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${i.toString().padStart(2, '0')}:00`,
      trafficMBps: 1500 + Math.random() * 2000,
      alerts: Math.random() > 0.8 ? 1 : 0
    }));
  }
};

export const fetchProtocolDistribution = async (): Promise<ProtocolData[]> => {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/dashboard/protocol-distribution`);
    const data = await handleResponse(response);
    return data.protocols;
  } catch (e) {
    // Dummy Data from Documentation (Page 1)
    return [
      { name: "HTTP/HTTPS", percentage: 45, volume: "2.4 TB" },
      { name: "DNS", percentage: 25, volume: "980 GB", anomaly: "15% spike" },
      { name: "SMB", percentage: 15, volume: "815 GB" },
      { name: "SSH", percentage: 4, volume: "217 GB" },
      { name: "RDP", percentage: 2, volume: "108 GB" },
      { name: "Other", percentage: 9, volume: "489 GB", anomaly: "Unknown detected" }
    ];
  }
};

export const fetchRecentAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/detections/alerts?limit=5`);
    const data = await handleResponse(response);
    return data.alerts;
  } catch (e) {
    // Dummy Data from Documentation (Page 2-3)
    return [
      {
        id: "ALT-001",
        severity: "critical",
        name: "C2 Beaconing Activity Detected",
        confidence: 94,
        mitreId: "T1071.001",
        mitreTactic: "Command and Control",
        sourceIp: "10.0.5.42",
        destinationIp: "185.220.101.34",
        timestamp: new Date().toISOString(),
        status: "new",
        description: "Periodic outbound connections detected to known C2 infrastructure."
      },
      {
        id: "ALT-002",
        severity: "critical",
        name: "Lateral Movement via SMB",
        confidence: 87,
        mitreId: "T1021.002",
        mitreTactic: "Lateral Movement",
        sourceIp: "10.0.3.15",
        destinationIp: "10.0.3.22",
        timestamp: new Date().toISOString(),
        status: "investigating"
      }
    ];
  }
};

export const fetchTopThreats = async (): Promise<ThreatCategory[]> => {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/threat-hunting/categories`);
    const data = await handleResponse(response);
    const hunts = data.preBuiltHunts || {};
    return [
      { name: "Command & Control", category: "C2 Beaconing", count: hunts.c2Detection || 12, trend: "increasing" },
      { name: "Data Exfiltration", category: "DNS Tunneling", count: hunts.dataExfiltration || 8, trend: "stable" },
      { name: "Lateral Movement", category: "East-West Flow", count: hunts.lateralMovement || 15, trend: "stable" },
      { name: "Credential Access", category: "Auth Monitoring", count: hunts.credentialAccess || 6, trend: "decreasing" }
    ];
  } catch (e) {
    // Dummy Data from Documentation (Page 12)
    return [
      { name: "Command & Control", category: "C2 Detection", count: 12, trend: "increasing" },
      { name: "Data Exfiltration", category: "Data Leakage", count: 8, trend: "stable" },
      { name: "Lateral Movement", category: "Network Pivot", count: 15, trend: "stable" },
      { name: "Credential Access", category: "Account Abuse", count: 6, trend: "stable" }
    ];
  }
};

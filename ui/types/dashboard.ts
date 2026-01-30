
export interface DashboardOverview {
  critical_alerts: { count: number; change: string; period: string };
  high_alerts: { count: number; change: string; period: string };
  assets_monitored: { count: number; change: string; period: string };
  network_health: { percentage: number; status: string };
}

export interface TrafficPoint {
  timestamp: string;
  trafficMBps: number;
  alerts: number;
}

export interface ProtocolData {
  name: string;
  percentage: number;
  volume: string;
  anomaly?: string;
}

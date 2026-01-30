
import { DashboardOverview, ProtocolData } from '../../types';

export const MOCK_DASHBOARD: DashboardOverview = {
  critical_alerts: { count: 12, change: "+3", period: "24h" },
  high_alerts: { count: 23, change: "-5", period: "24h" },
  assets_monitored: { count: 1247, change: "+12", period: "24h" },
  network_health: { percentage: 98.2, status: "operational" }
};

export const MOCK_PROTOCOLS: ProtocolData[] = [
  { name: "HTTP/HTTPS", percentage: 45, volume: "2.4 TB" },
  { name: "DNS", percentage: 25, volume: "980 GB", anomaly: "15% spike" },
  { name: "SMB", percentage: 15, volume: "815 GB" },
  { name: "SSH", percentage: 4, volume: "217 GB" },
  { name: "RDP", percentage: 2, volume: "108 GB" },
  { name: "Other", percentage: 9, volume: "489 GB", anomaly: "Unknown detected" }
];

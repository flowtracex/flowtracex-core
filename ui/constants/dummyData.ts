
import { DashboardOverview, Alert, ProtocolData, TrafficPoint, ThreatCategory } from '../types';

export const DUMMY_DASHBOARD: DashboardOverview = {
  critical_alerts: { count: 12, change: "+3", period: "24h" },
  high_alerts: { count: 23, change: "-5", period: "24h" },
  assets_monitored: { count: 1247, change: "+12", period: "24h" },
  network_health: { percentage: 98.2, status: "operational" }
};

export const DUMMY_ALERTS: Alert[] = [
  {
    id: "ALT-001",
    severity: "critical",
    name: "C2 Beaconing Activity Detected",
    confidence: 94,
    mitreId: "T1071.001",
    mitreTactic: "Command and Control",
    sourceIp: "10.0.5.42",
    destinationIp: "185.220.101.34",
    timestamp: "Jan 15, 08:02 PM",
    status: "new",
    protocol: "TCP/443",
    description: "Periodic outbound connections detected via conn.log matching Cobalt Strike beacon profile."
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
    timestamp: "Jan 15, 07:58 PM",
    status: "investigating",
    protocol: "TCP/445",
    description: "East-west connection burst detected in smb.log with multiple NTLM authentication failures."
  }
];

export const DUMMY_PROTOCOLS: ProtocolData[] = [
  { name: "HTTP/HTTPS", percentage: 45, volume: "2.4 TB" },
  { name: "DNS", percentage: 25, volume: "980 GB", anomaly: "15% spike" },
  { name: "SMB", percentage: 15, volume: "815 GB" },
  { name: "SSH", percentage: 4, volume: "217 GB" },
  { name: "RDP", percentage: 2, volume: "108 GB" },
  { name: "Other", percentage: 9, volume: "489 GB", anomaly: "Unknown detected" }
];

export const DUMMY_THREATS: ThreatCategory[] = [
  { name: "Command & Control", category: "C2 Detection", count: 12, trend: "increasing", evidence: "Detected via beaconing analysis in conn.log" },
  { name: "Data Exfiltration", category: "Data Leakage", count: 8, trend: "stable", evidence: "Detected via entropy analysis in dns.log" },
  { name: "Lateral Movement", category: "Network Pivot", count: 15, trend: "stable", evidence: "Detected via RPC/SMB pattern matching in smb.log" },
  { name: "Credential Access", category: "Account Abuse", count: 6, trend: "stable", evidence: "Detected via brute-force triggers in notice.log" }
];

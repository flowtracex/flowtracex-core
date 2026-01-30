
import { Alert } from '../../types';

export const MOCK_ALERTS: Alert[] = [
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
    description: "Periodic 60-second outbound connections detected in conn.log matching Cobalt Strike beaconing profile.",
    sources: ["ZEEK:CONN", "ZEEK:SSL", "ZEEK:INTEL"],
    triggerSignals: [
      { label: "Beacon Periodicity", value: "60s (±2s jitter)", status: "alert" },
      { label: "JA3 Match", value: "CobaltStrike Profile", status: "alert" },
      { label: "SSL SNI", value: "update-check.org", status: "info" }
    ],
    coverage: [
      { type: "FLOW", active: true },
      { type: "DNS", active: true },
      { type: "SSL", active: true },
      { type: "HTTP", active: false }
    ],
    assetContext: {
      subnet: "Engineering",
      firstSeen: "12 days ago",
      previousAlerts: 3,
      riskScore: 92,
      hostname: "WKSTN-ENG-042"
    }
  },
  {
    id: "ALT-002",
    severity: "critical",
    name: "Lateral Movement via SMB",
    confidence: 87,
    mitreId: "T1021.002",
    mitreTactic: "Lateral Movement",
    sourceIp: "10.0.3.15",
    destinationIp: "10.0.1.10",
    timestamp: "Jan 15, 07:58 PM",
    status: "investigating",
    protocol: "TCP/445",
    description: "East-west connection burst detected in smb.log. Multiple NTLM authentication failures observed in notice.log.",
    sources: ["ZEEK:CONN", "ZEEK:SMB"],
    triggerSignals: [
      { label: "Auth Failures", value: "45 events / 30s", status: "alert" },
      { label: "Share Access", value: "ADMIN$", status: "alert" }
    ],
    coverage: [
      { type: "FLOW", active: true },
      { type: "DNS", active: false },
      { type: "SSL", active: false },
      { type: "HTTP", active: false }
    ],
    assetContext: {
      subnet: "Production",
      firstSeen: "180 days ago",
      previousAlerts: 0,
      riskScore: 78,
      hostname: "SRV-PROD-APP"
    }
  },
  {
    id: "ALT-003",
    severity: "high",
    name: "DNS Tunneling Exfiltration Suspected",
    confidence: 78,
    mitreId: "T1071.004",
    mitreTactic: "Exfiltration",
    sourceIp: "10.0.2.88",
    destinationIp: "8.8.8.8",
    timestamp: "Jan 15, 07:45 PM",
    status: "new",
    protocol: "UDP/53",
    description: "High entropy DNS queries detected in dns.log. Unique subdomains per hour exceeds network baseline.",
    sources: ["ZEEK:DNS"],
    triggerSignals: [
      { label: "DNS Entropy", value: "4.8", status: "alert" },
      { label: "Query Length", value: "184 chars avg", status: "alert" }
    ],
    coverage: [
      { type: "FLOW", active: true },
      { type: "DNS", active: true },
      { type: "SSL", active: false },
      { type: "HTTP", active: false }
    ],
    assetContext: {
      subnet: "Finance",
      firstSeen: "45 days ago",
      previousAlerts: 1,
      riskScore: 65,
      hostname: "WKSTN-FIN-88"
    }
  }
];

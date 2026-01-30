
export interface Asset {
  ip: string;
  hostname: string;
  type: 'workstation' | 'server' | 'network' | 'database';
  os: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  activeAlerts: number;
  lastSeen: string;
  tags: string[];
}

export const MOCK_ASSETS: Asset[] = [
  {
    ip: "10.0.5.42",
    hostname: "WS-ENG-042",
    type: "workstation",
    os: "Windows 11",
    riskLevel: "critical",
    activeAlerts: 5,
    lastSeen: "2024-01-15T20:00:00Z",
    tags: ["Engineering", "High Value", "C2 Target"]
  },
  {
    ip: "10.0.3.15",
    hostname: "SRV-DC-01",
    type: "server",
    os: "Windows Server 2022",
    riskLevel: "high",
    activeAlerts: 2,
    lastSeen: "2024-01-15T19:58:00Z",
    tags: ["Domain Controller", "Critical Infrastructure"]
  },
  {
    ip: "10.0.1.10",
    hostname: "DB-PROD-SQL",
    type: "database",
    os: "Linux / PostgreSQL",
    riskLevel: "medium",
    activeAlerts: 0,
    lastSeen: "2024-01-15T18:45:00Z",
    tags: ["Production", "PII Data"]
  }
];

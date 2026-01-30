
export interface ThreatHunt {
  id: string;
  name: string;
  description: string;
  tactic: string;
  query: string;
  severity: 'high' | 'medium' | 'low';
}

export const MOCK_HUNTS: ThreatHunt[] = [
  {
    id: "HNT-001",
    name: "C2 Over DNS (Entropy)",
    description: "Search for high entropy DNS queries that might indicate tunneling.",
    tactic: "Command and Control",
    query: "dns.query_length > 50 and dns.entropy > 4.5",
    severity: "high"
  },
  {
    id: "HNT-002",
    name: "Rare User-Agent Strings",
    description: "Identify uncommon User-Agent strings in HTTP traffic.",
    tactic: "Discovery",
    query: "http.user_agent not in global_top_1000",
    severity: "medium"
  },
  {
    id: "HNT-003",
    name: "Suspicious SMB Share Enumeration",
    description: "Detect rapid access to multiple administrative shares.",
    tactic: "Lateral Movement",
    query: "smb.share_access_count > 10 within 1m",
    severity: "high"
  }
];

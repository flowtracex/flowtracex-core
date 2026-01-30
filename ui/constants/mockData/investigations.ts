
import { Investigation } from '../../types';

export const MOCK_INVESTIGATIONS: Investigation[] = [
  {
    id: "INV-2024-001",
    severity: "critical",
    name: "C2 Beaconing Activity Detected - 10.0.5.42",
    status: "active",
    alertCount: 12,
    assetCount: 3,
    owner: "Sarah Chen",
    assignedTo: { id: "u1", name: "Sarah Chen" },
    segment: "Engineering",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-15T14:23:00Z",
    mitreTactic: "Command & Control",
    sla: {
      targetHours: 4,
      remainingHours: 1.75,
      breached: false,
      percentRemaining: 43
    },
    killChain: {
      stages: [
        { name: 'Reconnaissance', status: 'completed' },
        { name: 'Initial Access', status: 'completed' },
        { name: 'Execution', status: 'completed' },
        { name: 'Persistence', status: 'in-progress' },
        { name: 'Defense Evasion', status: 'pending' },
      ]
    },
    lastComment: {
      user: "Sarah Chen",
      timestamp: "15m ago",
      text: "Lateral movement detected to DC-PROD-01. Investigating compromised credentials."
    }
  },
  {
    id: "INV-2024-002",
    severity: "high",
    name: "Lateral Movement - Domain Controller Access",
    status: "active",
    alertCount: 8,
    assetCount: 3,
    owner: "Mike Johnson",
    assignedTo: { id: "u2", name: "Mike Johnson" },
    segment: "Production",
    createdAt: "2024-01-15T06:20:00Z",
    updatedAt: "2024-01-15T13:45:00Z",
    mitreTactic: "Lateral Movement",
    sla: {
      targetHours: 8,
      remainingHours: 4.3,
      breached: false,
      percentRemaining: 54
    },
    killChain: {
      stages: [
        { name: 'Initial Access', status: 'completed' },
        { name: 'Lateral Movement', status: 'in-progress' },
      ]
    },
    lastComment: {
      user: "Mike Johnson",
      timestamp: "2h ago",
      text: "Analyzing SMB traffic patterns for NTLM relay attempts."
    }
  },
  {
    id: "INV-2024-003",
    severity: "medium",
    name: "Suspicious DNS Infiltration Investigation",
    status: "new",
    alertCount: 3,
    assetCount: 1,
    owner: "Sarah Chen",
    segment: "Finance",
    createdAt: "2024-01-14T10:15:00Z",
    updatedAt: "2024-01-14T10:15:00Z",
    mitreTactic: "Exfiltration",
    sla: {
      targetHours: 24,
      remainingHours: 18.05,
      breached: false,
      percentRemaining: 75
    },
    killChain: {
      stages: [
        { name: 'Exfiltration', status: 'in-progress' },
      ]
    }
  },
  {
    id: "INV-2024-004",
    severity: "low",
    name: "False Positive - Port Scan from Security Tool",
    status: "closed",
    alertCount: 5,
    assetCount: 2,
    owner: "Lisa Wang",
    assignedTo: { id: "u3", name: "Lisa Wang" },
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-12T11:00:00Z",
    closedAt: "2024-01-12T11:00:00Z",
    mitreTactic: "Discovery",
    sla: {
      targetHours: 48,
      remainingHours: 46.8,
      breached: false,
      percentRemaining: 97
    },
    killChain: {
      stages: []
    },
    lastComment: {
      user: "Lisa Wang",
      timestamp: "3d ago",
      text: "Confirmed as vulnerability scanner from IT team (Rapid7)."
    }
  }
];

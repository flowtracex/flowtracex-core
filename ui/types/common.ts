
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'investigating' | 'resolved' | 'dismissed';
export type InvestigationStatus = 'new' | 'active' | 'escalated' | 'on-hold' | 'closed';

export interface ThreatCategory {
  name: string;
  category: string;
  count: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  evidence?: string;
}

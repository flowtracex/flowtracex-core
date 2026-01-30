
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'investigating' | 'resolved' | 'dismissed' | 'suppressed';
export type InvestigationStatus = 'new' | 'active' | 'escalated' | 'on-hold' | 'closed';
export type Verdict = 'true_positive' | 'false_positive' | 'benign' | 'pending';

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
  source?: 'Zeek' | 'Flow' | 'Hybrid';
}

export interface TriggerSignal {
  label: string;
  value: string;
  status: 'alert' | 'info';
}

export interface CoverageSource {
  type: 'FLOW' | 'DNS' | 'SSL' | 'HTTP' | 'INTEL';
  active: boolean;
}

export interface Alert {
  id: string;
  severity: Severity;
  name: string;
  confidence: number;
  mitreId?: string;
  mitreTactic?: string;
  sourceIp: string;
  destinationIp: string;
  timestamp: string;
  status: AlertStatus;
  description?: string;
  protocol?: string;
  assignedTo?: string;
  verdict?: Verdict;
  assetTier?: 0 | 1 | 2 | 3;
  sources?: string[];
  riskContext?: string[];
  triggerSignals?: TriggerSignal[];
  coverage?: CoverageSource[];
  blastRadius?: {
    affectedAssets: number;
    segments: string[];
    externalIps: number;
  };
  assetContext?: {
    subnet: string;
    firstSeen: string;
    previousAlerts: number;
    riskScore: number;
    hostname?: string;
  };
}

export interface ThreatCategory {
  name: string;
  category: string;
  count: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  evidence?: string;
}

export interface Investigation {
  id: string;
  name: string;
  description?: string;
  status: InvestigationStatus;
  severity: Severity;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  segment?: string;
  sla: {
    targetHours: number;
    remainingHours: number;
    breached: boolean;
    percentRemaining: number;
  };
  mitreTactic: string;
  killChain: {
    stages: Array<{
      name: string;
      status: 'completed' | 'in-progress' | 'pending';
    }>;
  };
  lastComment?: {
    text: string;
    user: string;
    timestamp: string;
  };
  alertCount: number;
  assetCount: number;
  owner: string; 
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  type: 'custom_query' | 'threshold' | 'ml';
  source: 'system' | 'custom';
  enabled: boolean;
  severity: Severity;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  mitre: {
    tactic: string;
    technique: string;
    subtechnique?: string;
  };
  tags: string[];
  stats: {
    detections24h: number;
    detections7d: number;
    detections30d: number;
    falsePositiveRate: number;
    lastTriggered?: string;
    avgExecutionTime: number;
  };
  query?: string;
  threshold?: {
    field: string;
    value: number;
    groupBy: string[];
    timeWindow: number;
  };
  suppressDuplicates: boolean;
  suppressionWindow?: number;
  groupBy?: string[];
  enrichWithThreatIntel: boolean;
  enrichWithAssetContext: boolean;
  actions: {
    createAlert: boolean;
    notify?: string[];
    blockSource?: boolean;
  };
}

export interface RuleAnalytics {
  timeRange: string;
  summary: {
    activeRules: { value: number; trend: number };
    totalDetections: { value: number; trend: number };
    avgFalsePositiveRate: { value: number; trend: number };
    coverageScore: number;
  };
  topPerformers: Array<{
    ruleId: string;
    ruleName: string;
    detections: number;
    fpRate: number;
    source: string;
    severity: Severity;
  }>;
  rulesByType: Array<{ type: string; count: number; percentage: number }>;
  fpTrend: Array<{ date: string; fpRate: number }>;
  detectionTimeline: Array<{
    date: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>;
  mitreCoverage: Array<{
    tactic: string;
    ruleCount: number;
    coverage: number;
  }>;
  rulesNeedingAttention: {
    highPriority: Array<{ ruleId: string; name: string; reason: string }>;
    reviewNeeded: Array<{ ruleId: string; name: string; reason: string }>;
  };
  systemVsCustom: {
    system: { count: number; avgFpRate: number; avgDetections: number; reliability: number };
    custom: { count: number; avgFpRate: number; avgDetections: number; reliability: number };
  };
  recentChanges: {
    new: number;
    edited: number;
    disabled: number;
    deleted: number;
    timeline: Array<{
      timestamp: string;
      action: string;
      ruleName: string;
      user: string;
    }>;
  };
}

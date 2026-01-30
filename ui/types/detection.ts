
import { Severity, AlertStatus } from './common';

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
  actions: {
    createAlert: boolean;
    notify?: string[];
    blockSource?: boolean;
  };
}

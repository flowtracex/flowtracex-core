
export * from './common';
export * from './dashboard';
export * from './detection';
export * from './investigation';

// Local temporary type for Assets until asset.ts is created
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

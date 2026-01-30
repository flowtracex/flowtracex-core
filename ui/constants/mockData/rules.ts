
import { Rule, RuleAnalytics } from '../../types';

export const MOCK_RULES: Rule[] = [
  {
    id: 'rule-sys-001',
    name: 'C2 Beaconing Pattern (HTTPS)',
    description: 'Detects periodic outbound HTTPS traffic patterns matching known C2 beacon profiles with jitter analysis.',
    type: 'custom_query',
    source: 'system',
    enabled: true,
    severity: 'critical',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    mitre: { tactic: 'Command and Control', technique: 'T1071.001', subtechnique: 'Web Protocols' },
    tags: ['C2', 'HTTPS', 'Beaconing'],
    stats: {
      detections24h: 45,
      detections7d: 312,
      detections30d: 1240,
      falsePositiveRate: 2.1,
      lastTriggered: '2 mins ago',
      avgExecutionTime: 4.2
    },
    query: 'event.category: "network_traffic" AND destination.port: 443 AND network.transport: "tcp"',
    suppressDuplicates: true,
    suppressionWindow: 5,
    groupBy: ['source.ip'],
    enrichWithThreatIntel: true,
    enrichWithAssetContext: true,
    actions: { createAlert: true, notify: ['SOC Team'], blockSource: false }
  },
  {
    id: 'rule-sys-002',
    name: 'DNS Tunneling Attempt',
    description: 'Identify high-entropy DNS queries used for data exfiltration or command encapsulation via TXT records.',
    type: 'custom_query',
    source: 'system',
    enabled: true,
    severity: 'high',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    mitre: { tactic: 'Exfiltration', technique: 'T1048', subtechnique: 'Exfiltration Over Alternative Protocol' },
    tags: ['DNS', 'Exfiltration', 'Tunneling'],
    stats: {
      detections24h: 12,
      detections7d: 84,
      detections30d: 245,
      falsePositiveRate: 5.3,
      lastTriggered: '15 mins ago',
      avgExecutionTime: 8.7
    },
    query: 'dns.question.type: "TXT" AND dns.question.name.length > 100',
    suppressDuplicates: true,
    suppressionWindow: 10,
    groupBy: ['source.ip'],
    enrichWithThreatIntel: true,
    enrichWithAssetContext: true,
    actions: { createAlert: true, notify: ['SOC Team'] }
  },
  {
    id: 'rule-cust-001',
    name: 'Suspicious DNS Queries to Finance Segment',
    description: 'Monitor for unusual volume of DNS requests originating from the finance segment to external domains.',
    type: 'threshold',
    source: 'custom',
    enabled: false,
    severity: 'medium',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
    createdBy: 'Sarah Chen',
    mitre: { tactic: 'Exfiltration', technique: 'T1071.004', subtechnique: 'DNS' },
    tags: ['Finance', 'DNS', 'Custom'],
    stats: {
      detections24h: 2,
      detections7d: 12,
      detections30d: 45,
      falsePositiveRate: 67,
      lastTriggered: '5 days ago',
      avgExecutionTime: 12.4
    },
    threshold: {
      field: 'dns.question.name',
      value: 50,
      groupBy: ['source.ip'],
      timeWindow: 5
    },
    suppressDuplicates: true,
    suppressionWindow: 60,
    enrichWithThreatIntel: false,
    enrichWithAssetContext: true,
    actions: { createAlert: true }
  },
  {
    id: 'rule-sys-003',
    name: 'SMB Shadow Copy Delete',
    description: 'Detection of VSS shadow copy deletion over SMB, commonly associated with ransomware operations.',
    type: 'custom_query',
    source: 'system',
    enabled: true,
    severity: 'high',
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2024-01-05T11:00:00Z',
    mitre: { tactic: 'Impact', technique: 'T1490', subtechnique: 'Inhibit System Recovery' },
    tags: ['SMB', 'Ransomware', 'Impact'],
    stats: {
      detections24h: 3,
      detections7d: 5,
      detections30d: 8,
      falsePositiveRate: 0.8,
      lastTriggered: '1 hour ago',
      avgExecutionTime: 3.5
    },
    query: 'event.action: "smb_file_delete" AND file.name: "*vss*"',
    suppressDuplicates: true,
    // Comment: Added missing properties required by Rule interface
    enrichWithThreatIntel: true,
    enrichWithAssetContext: true,
    actions: { createAlert: true, notify: ['Incident Response'] }
  }
];

export const MOCK_RULE_ANALYTICS: RuleAnalytics = {
  timeRange: '24h',
  summary: {
    activeRules: { value: 232, trend: 12 },
    totalDetections: { value: 1247, trend: 234 },
    avgFalsePositiveRate: { value: 4.2, trend: -1.3 },
    coverageScore: 14.2
  },
  topPerformers: [
    { ruleId: '1', ruleName: 'C2 HTTPS Beaconing', detections: 456, fpRate: 2.1, source: 'system', severity: 'critical' },
    { ruleId: '2', ruleName: 'DNS Tunneling Attempt', detections: 234, fpRate: 5.3, source: 'system', severity: 'high' },
    { ruleId: '3', ruleName: 'SMB Shadow Copy Delete', detections: 123, fpRate: 0.8, source: 'system', severity: 'high' },
    { ruleId: '4', ruleName: 'Port Scan Threshold', detections: 89, fpRate: 15.7, source: 'custom', severity: 'medium' },
    { ruleId: '5', ruleName: 'Rare User-Agent', detections: 67, fpRate: 34.2, source: 'custom', severity: 'low' },
  ],
  rulesByType: [
    { type: 'Custom Query', count: 289, percentage: 89 },
    { type: 'Threshold', count: 35, percentage: 11 },
    { type: 'ML Models', count: 0, percentage: 0 },
  ],
  fpTrend: [
    { date: 'Jan 1', fpRate: 6.8 },
    { date: 'Jan 5', fpRate: 6.2 },
    { date: 'Jan 10', fpRate: 5.5 },
    { date: 'Jan 15', fpRate: 4.8 },
    { date: 'Jan 20', fpRate: 4.4 },
    { date: 'Jan 25', fpRate: 4.2 },
  ],
  detectionTimeline: Array.from({ length: 30 }, (_, i) => ({
    date: `Jan ${i + 1}`,
    critical: 5 + Math.floor(Math.random() * 15),
    high: 20 + Math.floor(Math.random() * 30),
    medium: 40 + Math.floor(Math.random() * 60),
    low: 30 + Math.floor(Math.random() * 40),
  })),
  mitreCoverage: [
    { tactic: 'Command & Control', ruleCount: 45, coverage: 90 },
    { tactic: 'Exfiltration', ruleCount: 34, coverage: 85 },
    { tactic: 'Defense Evasion', ruleCount: 28, coverage: 75 },
    { tactic: 'Lateral Movement', ruleCount: 23, coverage: 60 },
    { tactic: 'Credential Access', ruleCount: 18, coverage: 50 },
    { tactic: 'Discovery', ruleCount: 12, coverage: 40 },
    { tactic: 'Execution', ruleCount: 8, coverage: 30 },
    { tactic: 'Persistence', ruleCount: 4, coverage: 15 },
    { tactic: 'Privilege Escalation', ruleCount: 2, coverage: 10 },
  ],
  rulesNeedingAttention: {
    highPriority: [
      { ruleId: 'cust-ps', name: 'Custom Port Scan', reason: '67% FP rate' },
      { ruleId: 'sys-dns', name: 'Rare DNS Query', reason: 'Not triggered in 30 days' },
      { ruleId: 'sys-tls', name: 'Suspicious TLS', reason: 'Parse error rate 15%' },
    ],
    reviewNeeded: [
      { ruleId: 'c1', name: 'Low Entropy SSH', reason: 'FP rate > 10%' },
      { ruleId: 'c2', name: 'Dev Segment Access', reason: 'Disabled > 7 days' },
    ]
  },
  systemVsCustom: {
    system: { count: 312, avgFpRate: 3.2, avgDetections: 3.8, reliability: 98.5 },
    custom: { count: 12, avgFpRate: 18.7, avgDetections: 1.2, reliability: 76.3 },
  },
  recentChanges: {
    new: 2, edited: 5, disabled: 3, deleted: 1,
    timeline: [
      { timestamp: '2h ago', action: 'Created', ruleName: 'Custom Exfil Rule', user: 'Sarah Chen' },
      { timestamp: '5h ago', action: 'Tuned', ruleName: 'C2 HTTPS', user: 'System' },
      { timestamp: '1d ago', action: 'Disabled', ruleName: 'Noisy Scanner', user: 'Mike Torres' },
    ]
  }
};

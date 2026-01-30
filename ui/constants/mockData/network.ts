
export interface NetworkFlow {
  id: string;
  timestamp: string;
  srcIp: string;
  srcPort: number;
  destIp: string;
  destPort: number;
  protocol: string;
  bytes: string;
  packets: number;
}

export const MOCK_FLOWS: NetworkFlow[] = Array.from({ length: 15 }, (_, i) => ({
  id: `flow-${i}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString(),
  srcIp: `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 254)}`,
  srcPort: Math.floor(Math.random() * 65535),
  destIp: i % 3 === 0 ? "8.8.8.8" : `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 254)}`,
  destPort: [80, 443, 53, 445, 22][Math.floor(Math.random() * 5)],
  protocol: ["TCP", "UDP", "ICMP"][Math.floor(Math.random() * 3)],
  bytes: `${(Math.random() * 500).toFixed(1)} KB`,
  packets: Math.floor(Math.random() * 100)
}));

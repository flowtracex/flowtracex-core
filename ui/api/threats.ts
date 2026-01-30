
import { CONFIG } from '../config';
import { DUMMY_THREATS } from '../constants/dummyData';
import { ThreatCategory } from '../types';

export const fetchTopThreats = async (): Promise<ThreatCategory[]> => {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/threat-hunting/categories`);
    const data = await res.json();
    const hunts = data.preBuiltHunts || {};
    return [
      { name: "Command & Control", category: "C2 Detection", count: hunts.c2Detection, trend: "increasing" },
      { name: "Data Exfiltration", category: "Data Leakage", count: hunts.dataExfiltration, trend: "stable" },
      // ... map others
    ];
  } catch {
    return DUMMY_THREATS;
  }
};

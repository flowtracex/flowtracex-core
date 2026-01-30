
import { MOCK_HUNTS, ThreatHunt } from '../constants/mockData/threatHunting';

export const fetchHunts = async (): Promise<ThreatHunt[]> => {
  await new Promise(r => setTimeout(r, 400));
  return MOCK_HUNTS;
};

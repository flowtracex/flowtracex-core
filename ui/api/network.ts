
import { MOCK_FLOWS, NetworkFlow } from '../constants/mockData/network';

export const fetchNetworkFlows = async (): Promise<NetworkFlow[]> => {
  await new Promise(r => setTimeout(r, 600));
  return MOCK_FLOWS;
};

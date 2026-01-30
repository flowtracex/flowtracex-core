
import { CONFIG } from '../config';
import { MOCK_ASSETS, Asset } from '../constants/mockData/assets';

export const fetchAssets = async (): Promise<Asset[]> => {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/assets`);
    const data = await res.json();
    return data.assets;
  } catch {
    return MOCK_ASSETS;
  }
};

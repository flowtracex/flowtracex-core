
import { CONFIG } from '../config';
// Comment: Fixed incorrect import of Investigation from mockData module. It should come from types.
import { Investigation } from '../types';
import { MOCK_INVESTIGATIONS } from '../constants/mockData/investigations';

export const fetchInvestigations = async (): Promise<Investigation[]> => {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/investigations`);
    const data = await res.json();
    return data.investigations;
  } catch {
    return MOCK_INVESTIGATIONS;
  }
};

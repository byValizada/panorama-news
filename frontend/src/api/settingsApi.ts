import axiosClient from './axiosClient';
import { SiteSetting, DashboardStats } from '../types';

export const settingsApi = {
  // Public APIs
  getAll: (lang?: string): Promise<SiteSetting[]> => {
    const url = lang ? `/settings?lang=${lang}` : '/settings';
    return axiosClient.get(url);
  },
  getByKey: (key: string, lang?: string): Promise<SiteSetting> => {
    const url = lang ? `/settings/${key}?lang=${lang}` : `/settings/${key}`;
    return axiosClient.get(url);
  },

  // Admin APIs
  getAllAdmin: (lang?: string): Promise<SiteSetting[]> => {
    const url = lang ? `/admin/settings?lang=${lang}` : '/admin/settings';
    return axiosClient.get(url);
  },
  updateSetting: (data: SiteSetting): Promise<SiteSetting> => {
    return axiosClient.put('/admin/settings', data);
  },
  updateBulk: (data: SiteSetting[]): Promise<{ message: string }> => {
    return axiosClient.put('/admin/settings/bulk', data);
  },
  getDashboardStats: (): Promise<DashboardStats> => {
    return axiosClient.get('/admin/dashboard');
  },
};

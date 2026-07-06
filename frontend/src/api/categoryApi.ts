import axiosClient from './axiosClient';
import { Category } from '../types';

// Let's create type aliases inline in types or export them, wait, since we wrote record types, let's make sure we pass correct parameters.
export const categoryApi = {
  // Public APIs
  getAll: (lang = 'az'): Promise<Category[]> => {
    return axiosClient.get(`/categories?lang=${lang}`);
  },
  getBySlug: (slug: string, lang = 'az'): Promise<Category> => {
    return axiosClient.get(`/categories/${slug}?lang=${lang}`);
  },

  // Admin APIs
  getAllAdmin: (lang = 'az'): Promise<Category[]> => {
    return axiosClient.get(`/admin/categories?lang=${lang}`);
  },
  create: (data: any): Promise<Category> => {
    return axiosClient.post('/admin/categories', data);
  },
  update: (id: number, data: any): Promise<Category> => {
    return axiosClient.put(`/admin/categories/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return axiosClient.delete(`/admin/categories/${id}`);
  },
};

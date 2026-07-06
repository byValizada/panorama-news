import axiosClient from './axiosClient';
import { Article, ArticleListDto, PagedResult } from '../types';

export const articleApi = {
  // Public APIs
  getAll: (lang = 'az', page = 1, size = 20): Promise<PagedResult<ArticleListDto>> => {
    return axiosClient.get(`/articles?lang=${lang}&page=${page}&size=${size}`);
  },
  getBySlug: (slug: string, lang = 'az'): Promise<Article> => {
    return axiosClient.get(`/articles/${slug}?lang=${lang}`);
  },
  getByCategory: (categorySlug: string, lang = 'az', page = 1, size = 20): Promise<PagedResult<ArticleListDto>> => {
    return axiosClient.get(`/articles/category/${categorySlug}?lang=${lang}&page=${page}&size=${size}`);
  },
  getFeatured: (lang = 'az', count = 5): Promise<ArticleListDto[]> => {
    return axiosClient.get(`/articles/featured?lang=${lang}&count=${count}`);
  },
  getBreaking: (lang = 'az', count = 10): Promise<ArticleListDto[]> => {
    return axiosClient.get(`/articles/breaking?lang=${lang}&count=${count}`);
  },
  getTrending: (lang = 'az', count = 10): Promise<ArticleListDto[]> => {
    return axiosClient.get(`/articles/trending?lang=${lang}&count=${count}`);
  },
  getLatest: (lang = 'az', count = 10): Promise<ArticleListDto[]> => {
    return axiosClient.get(`/articles/latest?lang=${lang}&count=${count}`);
  },
  search: (q: string, lang = 'az', page = 1, size = 20): Promise<PagedResult<ArticleListDto>> => {
    return axiosClient.get(`/articles/search?q=${encodeURIComponent(q)}&lang=${lang}&page=${page}&size=${size}`);
  },

  // Admin APIs
  getAllAdmin: (lang = 'az', page = 1, size = 20): Promise<PagedResult<ArticleListDto>> => {
    return axiosClient.get(`/admin/articles?lang=${lang}&page=${page}&size=${size}`);
  },
  getByIdAdmin: (id: number, lang = 'az'): Promise<Article> => {
    return axiosClient.get(`/admin/articles/${id}?lang=${lang}`);
  },
  create: (data: any): Promise<Article> => {
    return axiosClient.post('/admin/articles', data);
  },
  update: (id: number, data: any): Promise<Article> => {
    return axiosClient.put(`/admin/articles/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return axiosClient.delete(`/admin/articles/${id}`);
  },
};

import axiosClient from './axiosClient';
import { MediaFile } from '../types';

export const mediaApi = {
  getAll: (): Promise<MediaFile[]> => {
    return axiosClient.get('/admin/media');
  },
  upload: (file: File, altText?: string): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('altText', altText);

    return axiosClient.post('/admin/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id: number): Promise<void> => {
    return axiosClient.delete(`/admin/media/${id}`);
  },
};

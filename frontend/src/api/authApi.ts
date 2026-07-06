import axiosClient from './axiosClient';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return axiosClient.post('/auth/login', data);
  },
  register: (data: RegisterRequest): Promise<User> => {
    return axiosClient.post('/auth/register', data);
  },
  getCurrentUser: (): Promise<User> => {
    return axiosClient.get('/auth/me');
  },
};

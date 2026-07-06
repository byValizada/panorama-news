import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5277/api', // default ASP.NET Core port
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('panorama_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest); // use raw axios to avoid intercepting again
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const token = localStorage.getItem('panorama_token');
      const refreshToken = localStorage.getItem('panorama_refresh_token');

      if (token && refreshToken) {
        try {
          const response = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5277/api') + '/auth/refresh', {
            token,
            refreshToken
          });
          const data = response.data;
          
          localStorage.setItem('panorama_token', data.token);
          localStorage.setItem('panorama_refresh_token', data.refreshToken);
          
          originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
          
          processQueue(null, data.token);
          isRefreshing = false;
          return axios(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          localStorage.removeItem('panorama_token');
          localStorage.removeItem('panorama_refresh_token');
          localStorage.removeItem('panorama_user');
          window.location.href = '/admin/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('panorama_token');
        localStorage.removeItem('panorama_refresh_token');
        localStorage.removeItem('panorama_user');
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;

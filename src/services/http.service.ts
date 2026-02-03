import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from '../config/firebase.config';

class HttpService {
  private baseUrl: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001';
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to inject Firebase auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const user = auth.currentUser;
          if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - could trigger logout
          console.error('Unauthorized request');
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET Request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const config: AxiosRequestConfig = params ? { params } : {};
    const response: AxiosResponse<T> = await this.axiosInstance.get(
      endpoint,
      config
    );
    return response.data;
  }

  // Generic POST Request
  async post<T>(endpoint: string, body: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      endpoint,
      body
    );
    return response.data;
  }

  // Generic PUT Request
  async put<T>(endpoint: string, body: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      endpoint,
      body
    );
    return response.data;
  }

  // Generic PATCH Request
  async patch<T>(endpoint: string, body: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(
      endpoint,
      body
    );
    return response.data;
  }

  // Generic DELETE Request
  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const httpService = new HttpService();
export default httpService;



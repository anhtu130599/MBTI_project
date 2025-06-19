import { API_BASE_URL } from '@/shared/constants';
import { getAuthHeaders } from '@/shared/utils/auth';

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const authHeaders = await getAuthHeaders();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    } as HeadersInit,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const userService = {
  getProfile: async () => {
    return request('/users/profile');
  },

  updateProfile: async (data: { name: string }) => {
    return request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: { currentPassword?: string; newPassword?: string }) => {
    return request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getTestHistory: async () => {
    return request('/users/test-history');
  }
}; 
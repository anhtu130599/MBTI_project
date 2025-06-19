export const getAuthHeaders = async () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}; 
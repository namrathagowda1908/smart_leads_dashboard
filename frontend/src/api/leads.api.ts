import api from './client';

export const fetchLeads = async (params: Record<string, string | number | undefined>) => {
  const response = await api.get('/leads', { params });
  return response.data;
};

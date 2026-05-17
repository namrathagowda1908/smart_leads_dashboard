import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '../api/leads.api';

export const useLeads = (params: Record<string, string | number | undefined>) => {
  return useQuery<any, Error>({
    queryKey: ['leads', params],
    queryFn: () => fetchLeads(params),
  });
};

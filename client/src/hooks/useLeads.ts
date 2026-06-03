import { useQuery } from '@tanstack/react-query';
import { leadService } from '../services/leadService';
import type { LeadQueryParams, LeadSearchParams } from '../types';

export function useLeads(params: LeadQueryParams = {}) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadService.getLeads(params),
  });
}

export function useLeadById(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLeadById(id),
    enabled: !!id,
  });
}

export function useSearchLeads(params: LeadSearchParams) {
  return useQuery({
    queryKey: ['leads', 'search', params],
    queryFn: () => leadService.searchLeads(params),
    enabled: params.q.length > 0,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: ['leads', 'stats'],
    queryFn: () => leadService.getStats(),
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ['leads', 'companies'],
    queryFn: () => leadService.getCompanies(),
  });
}

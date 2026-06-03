import { LeadStatus, Lead } from '@prisma/client';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  conversionRate: number;
  recentLeads: Lead[];
}

export interface LeadFilters {
  status?: LeadStatus;
  company?: string;
}

export interface LeadSort {
  field: string;
  order: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

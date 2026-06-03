export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  notes?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  conversionRate: number;
  recentLeads: Lead[];
}

export interface LeadQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: LeadStatus;
  company?: string;
}

export interface LeadSearchParams {
  q: string;
  page?: number;
  limit?: number;
}

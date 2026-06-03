import axios from 'axios';
import type {
  Lead,
  ApiResponse,
  LeadStats,
  CreateLeadData,
  UpdateLeadData,
  LeadQueryParams,
  LeadSearchParams,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leadService = {
  async getLeads(params: LeadQueryParams = {}): Promise<ApiResponse<Lead[]>> {
    const { data } = await api.get<ApiResponse<Lead[]>>('/leads', { params });
    return data;
  },

  async getLeadById(id: string): Promise<ApiResponse<Lead>> {
    const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data;
  },

  async searchLeads(params: LeadSearchParams): Promise<ApiResponse<Lead[]>> {
    const { data } = await api.get<ApiResponse<Lead[]>>('/leads/search', { params });
    return data;
  },

  async createLead(leadData: CreateLeadData): Promise<ApiResponse<Lead>> {
    const { data } = await api.post<ApiResponse<Lead>>('/leads', leadData);
    return data;
  },

  async updateLead(id: string, leadData: UpdateLeadData): Promise<ApiResponse<Lead>> {
    const { data } = await api.put<ApiResponse<Lead>>(`/leads/${id}`, leadData);
    return data;
  },

  async deleteLead(id: string): Promise<ApiResponse<{ id: string }>> {
    const { data } = await api.delete<ApiResponse<{ id: string }>>(`/leads/${id}`);
    return data;
  },

  async getStats(): Promise<ApiResponse<LeadStats>> {
    const { data } = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return data;
  },

  async getCompanies(): Promise<ApiResponse<string[]>> {
    const { data } = await api.get<ApiResponse<string[]>>('/leads/companies');
    return data;
  },
};

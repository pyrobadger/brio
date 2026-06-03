import { leadRepository } from '../repositories/leadRepository';
import {
  CreateLeadInput,
  UpdateLeadInput,
  QueryLeadsInput,
  SearchLeadsInput,
} from '../validators/leadValidators';
import { PaginationMeta } from '../types';

export class LeadService {
  async createLead(data: CreateLeadInput) {
    // Check for duplicate email
    const existingLead = await leadRepository.findByEmail(data.email);
    if (existingLead) {
      throw new AppError('A lead with this email already exists', 409);
    }

    return leadRepository.create(data);
  }

  async getLeadById(id: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead;
  }

  async getLeads(query: QueryLeadsInput) {
    const { page, limit, sortBy, sortOrder, status, company } = query;

    const { leads, total } = await leadRepository.findAll(
      { page, limit },
      { field: sortBy, order: sortOrder },
      { status, company }
    );

    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return { leads, meta };
  }

  async searchLeads(query: SearchLeadsInput) {
    const { q, page, limit } = query;

    const { leads, total } = await leadRepository.search(q, { page, limit });

    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return { leads, meta };
  }

  async updateLead(id: string, data: UpdateLeadInput) {
    // Verify lead exists
    const existingLead = await leadRepository.findById(id);
    if (!existingLead) {
      throw new AppError('Lead not found', 404);
    }

    // Check email uniqueness if email is being updated
    if (data.email && data.email !== existingLead.email) {
      const emailTaken = await leadRepository.findByEmail(data.email);
      if (emailTaken) {
        throw new AppError('A lead with this email already exists', 409);
      }
    }

    return leadRepository.update(id, data);
  }

  async deleteLead(id: string) {
    const existingLead = await leadRepository.findById(id);
    if (!existingLead) {
      throw new AppError('Lead not found', 404);
    }

    await leadRepository.delete(id);
    return { id };
  }

  async getStats() {
    return leadRepository.getStats();
  }

  async getCompanies() {
    return leadRepository.getDistinctCompanies();
  }
}

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const leadService = new LeadService();

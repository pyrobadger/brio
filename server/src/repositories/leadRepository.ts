import prisma from '../utils/prismaClient';
import { LeadStatus, Prisma } from '@prisma/client';
import { CreateLeadInput, UpdateLeadInput } from '../validators/leadValidators';
import { LeadFilters, LeadSort, PaginationParams } from '../types';

export class LeadRepository {
  async create(data: CreateLeadInput) {
    return prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        status: data.status as LeadStatus,
        notes: data.notes || '',
      },
    });
  }

  async findById(id: string) {
    return prisma.lead.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.lead.findUnique({ where: { email } });
  }

  async findAll(
    pagination: PaginationParams,
    sort: LeadSort,
    filters: LeadFilters
  ) {
    const where: Prisma.LeadWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.company) {
      where.company = {
        contains: filters.company,
        mode: 'insensitive',
      };
    }

    const orderBy: Prisma.LeadOrderByWithRelationInput = {
      [sort.field]: sort.order,
    };

    const skip = (pagination.page - 1) * pagination.limit;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: pagination.limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total };
  }

  async search(query: string, pagination: PaginationParams) {
    const where: Prisma.LeadWhereInput = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
      ],
    };

    const skip = (pagination.page - 1) * pagination.limit;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pagination.limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total };
  }

  async update(id: string, data: UpdateLeadInput) {
    return prisma.lead.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.status !== undefined && { status: data.status as LeadStatus }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
  }

  async delete(id: string) {
    return prisma.lead.delete({ where: { id } });
  }

  async getStats() {
    const [total, statusCounts, recentLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const byStatus: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
    };

    statusCounts.forEach((item) => {
      byStatus[item.status] = item._count.status;
    });

    const converted = byStatus['Converted'] || 0;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    return {
      total,
      byStatus,
      conversionRate: Math.round(conversionRate * 10) / 10,
      recentLeads,
    };
  }

  async getDistinctCompanies() {
    const companies = await prisma.lead.findMany({
      select: { company: true },
      distinct: ['company'],
      orderBy: { company: 'asc' },
    });
    return companies.map((c) => c.company);
  }
}

export const leadRepository = new LeadRepository();

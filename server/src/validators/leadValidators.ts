import { z } from 'zod';

export const LeadStatusEnum = z.enum([
  'New',
  'Contacted',
  'Qualified',
  'Converted',
  'Lost',
]);

export type LeadStatusType = z.infer<typeof LeadStatusEnum>;

export const createLeadSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string({ error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  phone: z
    .string({ error: 'Phone number is required' })
    .min(1, 'Phone number is required')
    .max(20, 'Phone number must be less than 20 characters')
    .trim(),
  company: z
    .string({ error: 'Company name is required' })
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  status: LeadStatusEnum.default('New'),
  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .trim()
    .optional()
    .nullable()
    .default(''),
});

export const updateLeadSchema = createLeadSchema.partial();

export const queryLeadsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(['name', 'company', 'status', 'createdAt', 'email'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: LeadStatusEnum.optional(),
  company: z.string().optional(),
});

export const searchLeadsSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type QueryLeadsInput = z.infer<typeof queryLeadsSchema>;
export type SearchLeadsInput = z.infer<typeof searchLeadsSchema>;

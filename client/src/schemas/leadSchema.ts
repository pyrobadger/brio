import { z } from 'zod';

export const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Converted', 'Lost']);

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number must be less than 20 characters'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters'),
  status: leadStatusEnum,
  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional(),
});

export const updateLeadSchema = createLeadSchema;

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;

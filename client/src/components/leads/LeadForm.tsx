import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadSchema, type CreateLeadFormData } from '../../schemas/leadSchema';
import { LEAD_STATUSES } from '../../lib/constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import type { Lead } from '../../types';

interface LeadFormProps {
  defaultValues?: Partial<CreateLeadFormData>;
  onSubmit: (data: CreateLeadFormData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function LeadForm({ defaultValues, onSubmit, isLoading, isEdit }: LeadFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'New',
      notes: '',
      ...defaultValues,
    },
  });

  const statusOptions = LEAD_STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name"
          placeholder="e.g. John Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="e.g. john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone Number"
          placeholder="e.g. (555) 123-4567"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Company Name"
          placeholder="e.g. Acme Inc"
          error={errors.company?.message}
          {...register('company')}
        />
        <Select
          label="Lead Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
      </div>

      <Textarea
        label="Notes (Optional)"
        placeholder="Add any relevant notes about this lead..."
        rows={4}
        error={errors.notes?.message}
        {...register('notes')}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-border-light">
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Update Lead' : 'Create Lead'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

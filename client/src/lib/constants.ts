import type { LeadStatus } from '../types';

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; icon: string }> = {
  New: {
    label: 'New',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
    icon: '✨',
  },
  Contacted: {
    label: 'Contacted',
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-200',
    icon: '📞',
  },
  Qualified: {
    label: 'Qualified',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: '⭐',
  },
  Converted: {
    label: 'Converted',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: '🎉',
  },
  Lost: {
    label: 'Lost',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: '💔',
  },
};

export const STATUS_CHART_COLORS: Record<LeadStatus, string> = {
  New: '#818CF8',
  Contacted: '#38BDF8',
  Qualified: '#FBBF24',
  Converted: '#34D399',
  Lost: '#F87171',
};

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

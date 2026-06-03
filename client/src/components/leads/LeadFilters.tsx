import { Search, X } from 'lucide-react';
import { LEAD_STATUSES } from '../../lib/constants';
import type { LeadStatus } from '../../types';

interface LeadFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: LeadStatus | '';
  onStatusFilterChange: (status: LeadStatus | '') => void;
  companyFilter: string;
  onCompanyFilterChange: (company: string) => void;
  companies: string[];
}

export default function LeadFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  companyFilter,
  onCompanyFilterChange,
  companies,
}: LeadFiltersProps) {
  const hasActiveFilters = statusFilter || companyFilter;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search leads by name, email, or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-border bg-white text-sm text-dark placeholder:text-muted/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lilac-dark/30 focus:border-lilac-dark hover:border-lilac/50"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted hover:text-dark hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wide">Status:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onStatusFilterChange('')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                !statusFilter
                  ? 'bg-brand border-brand text-white shadow-sm hover:bg-brand-dark'
                  : 'bg-white text-dark border-border hover:bg-surface-2 hover:text-dark'
              }`}
            >
              All
            </button>
            {LEAD_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => onStatusFilterChange(status === statusFilter ? '' : status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                  status === statusFilter
                    ? 'bg-brand border-brand text-white shadow-sm hover:bg-brand-dark'
                    : 'bg-white text-dark border-border hover:bg-surface-2 hover:text-dark'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {companies.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wide">Company:</span>
            <select
              value={companyFilter}
              onChange={(e) => onCompanyFilterChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs border border-border bg-white text-dark hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer font-semibold"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={() => {
              onStatusFilterChange('');
              onCompanyFilterChange('');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

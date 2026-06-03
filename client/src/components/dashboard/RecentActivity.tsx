import { motion } from 'framer-motion';
import { Clock, Building2 } from 'lucide-react';
import type { Lead } from '../../types';
import Badge from '../ui/Badge';

interface RecentActivityProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
}

export default function RecentActivity({ leads, onLeadClick }: RecentActivityProps) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl border border-border-light p-6 shadow-soft"
    >
      <h3 className="font-heading text-base font-semibold text-dark mb-4">
        Recent Leads
      </h3>
      <div className="space-y-3">
        {leads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.08 }}
            whileHover={onLeadClick ? { scale: 1.01, x: 2 } : undefined}
            whileTap={onLeadClick ? { scale: 0.99 } : undefined}
            onClick={() => onLeadClick && onLeadClick(lead)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              onLeadClick ? 'cursor-pointer hover:bg-surface-2 hover:shadow-sm' : 'hover:bg-surface-2/50'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lilac/30 to-pink/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-lilac-deep">
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark truncate">{lead.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Building2 className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted truncate">{lead.company}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge status={lead.status} size="sm" />
              <div className="flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3 h-3" />
                <span>{formatDate(lead.createdAt)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

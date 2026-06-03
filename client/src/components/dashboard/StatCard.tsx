import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  compareText: string;
  badgeText: string;
  badgeType: 'success' | 'danger';
  onClick?: () => void;
  isActive?: boolean;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  compareText,
  badgeText,
  badgeType,
  onClick,
  isActive = false,
  delay = 0,
}: StatCardProps) {
  const isSuccess = badgeType === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={`bg-white border rounded-2xl p-5 shadow-soft transition-all duration-300 relative ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isActive
          ? 'border-brand ring-2 ring-brand/10 shadow-glow-lilac'
          : 'border-border hover:border-brand/40'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
          <HelpCircle className="w-3.5 h-3.5 text-muted/40 cursor-help" />
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
            isSuccess
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-rose-50 text-rose-600 border border-rose-100'
          }`}
        >
          {isSuccess ? '▲' : '▼'} {badgeText}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-heading font-bold text-dark leading-none">{value}</p>
        <p className="text-xs text-muted font-medium">
          <span className={isSuccess ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
            {compareText.split(' ')[0]}
          </span>{' '}
          {compareText.split(' ').slice(1).join(' ')}
        </p>
      </div>
    </motion.div>
  );
}

import type { LeadStatus } from '../../types';
import { STATUS_CONFIG } from '../../lib/constants';

interface BadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export default function Badge({ status, size = 'md' }: BadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${config.bg} ${config.color} ${sizeClasses} transition-all duration-200`}
    >
      <span className="text-[10px]">{config.icon}</span>
      {config.label}
    </span>
  );
}

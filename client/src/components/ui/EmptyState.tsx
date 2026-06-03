import { Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lilac/30 via-pink/20 to-yellow/20 flex items-center justify-center mb-6">
        <Search className="w-8 h-8 text-lilac-dark" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-dark mb-2">{title}</h3>
      <p className="text-sm text-muted text-center max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

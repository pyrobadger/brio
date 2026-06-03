import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Mail, Phone, Building2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Lead } from '../../types';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { useDeleteLead } from '../../hooks/useLeadMutations';

interface LeadCardListProps {
  leads: Lead[];
}

export default function LeadCardList({ leads }: LeadCardListProps) {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const deleteMutation = useDeleteLead();

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {leads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-border-light p-4 shadow-soft hover:shadow-card transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-dark text-sm">{lead.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-muted" />
                  <span className="text-xs text-muted">{lead.company}</span>
                </div>
              </div>
              <Badge status={lead.status} size="sm" />
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Phone className="w-3.5 h-3.5" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(lead.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border-light">
              <button
                onClick={() => navigate(`/leads/${lead.id}/edit`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-lilac-deep bg-lilac/10 hover:bg-lilac/20 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(lead)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}

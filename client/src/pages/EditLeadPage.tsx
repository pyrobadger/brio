import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LeadForm from '../components/leads/LeadForm';
import { useLeadById } from '../hooks/useLeads';
import { useUpdateLead } from '../hooks/useLeadMutations';
import { PageSpinner } from '../components/ui/Spinner';
import type { CreateLeadFormData } from '../schemas/leadSchema';

export default function EditLeadPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: leadResponse, isLoading } = useLeadById(id || '');
  const updateMutation = useUpdateLead();

  const lead = leadResponse?.data;

  const handleSubmit = (data: CreateLeadFormData) => {
    if (!id) return;
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate('/');
        },
      }
    );
  };

  if (isLoading) return <PageSpinner />;

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-heading text-xl font-semibold text-dark mb-2">Lead Not Found</h2>
        <p className="text-sm text-muted mb-6">The lead you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-lilac-dark text-white text-sm font-medium hover:bg-lilac-deep transition-colors cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl text-muted hover:text-dark hover:bg-surface-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Edit Lead</h1>
          <p className="text-sm text-muted mt-1">Update information for {lead.name}</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-border-light p-6 md:p-8 shadow-soft">
        <LeadForm
          defaultValues={{
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            status: lead.status,
            notes: lead.notes || '',
          }}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          isEdit
        />
      </div>
    </motion.div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LeadForm from '../components/leads/LeadForm';
import { useCreateLead } from '../hooks/useLeadMutations';
import type { CreateLeadFormData } from '../schemas/leadSchema';

export default function CreateLeadPage() {
  const navigate = useNavigate();
  const createMutation = useCreateLead();

  const handleSubmit = (data: CreateLeadFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

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
          <h1 className="font-heading text-2xl font-bold text-dark">Create New Lead</h1>
          <p className="text-sm text-muted mt-1">Add a new lead to your CRM</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-border-light p-6 md:p-8 shadow-soft">
        <LeadForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </div>
    </motion.div>
  );
}

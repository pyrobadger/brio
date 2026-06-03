import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Lead } from '../../types';
import Modal from '../ui/Modal';
import { useDeleteLead } from '../../hooks/useLeadMutations';

interface LeadTableProps {
  leads: Lead[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

// Inline Branded Company Logos
const AdobeLogo = () => (
  <svg className="w-5 h-5 shrink-0 rounded" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" fill="#FF0000" rx="4" />
    <path d="M14.2 5H20v14h-5.8zM9.8 5H4v14h5.8zM12 9.2l3.4 8.3H8.6z" fill="#FFF"/>
  </svg>
);

const AtomLogo = () => (
  <svg className="w-5 h-5 shrink-0 rounded-full" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#10B981"/>
    <ellipse cx="12" cy="12" rx="3" ry="9" stroke="#FFF" strokeWidth="1.5" transform="rotate(30 12 12)"/>
    <ellipse cx="12" cy="12" rx="3" ry="9" stroke="#FFF" strokeWidth="1.5" transform="rotate(-30 12 12)"/>
    <circle cx="12" cy="12" r="1.5" fill="#FFF"/>
  </svg>
);

const AirtableLogo = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M3 13.5L12 9l9 4.5L12 18l-9-4.5z" fill="#1890ff"/>
    <path d="M12 2l9 4.5v7L12 9V2z" fill="#fadb14"/>
    <path d="M3 6.5L12 2v7L3 11.5v-5z" fill="#ff4d4f"/>
  </svg>
);

const AlfaBankLogo = () => (
  <svg className="w-5 h-5 shrink-0 rounded-full" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#ef4444"/>
    <path d="M8 17h8M12 6l-4 8.5h8L12 6z" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CanvaLogo = () => (
  <svg className="w-5 h-5 shrink-0 rounded-full" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="url(#canvaGrad)"/>
    <defs>
      <linearGradient id="canvaGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00c2ff"/>
        <stop offset="100%" stopColor="#7d2ae8"/>
      </linearGradient>
    </defs>
    <path d="M8 13.5c.5-1.5 2-2.5 4-2.5s3.5 1 4 2.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="9" r="2.5" fill="#FFF"/>
  </svg>
);

const CoinbaseLogo = () => (
  <svg className="w-5 h-5 shrink-0 rounded-full" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#0052FF"/>
    <circle cx="12" cy="12" r="6" stroke="#FFF" strokeWidth="2.5" fill="none"/>
  </svg>
);

const ConfluenceLogo = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L5 9v6l7 6 7-6V9l-7-6z" fill="#2684FF" />
    <path d="M12 3L5 9l7 6 7-6-7-6z" fill="#0052CC" opacity="0.8" />
  </svg>
);

const DiscordLogo = () => (
  <svg className="w-5 h-5 shrink-0 rounded-full" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#5865F2"/>
    <path d="M16.5 8.5c-.8-.7-1.8-.9-2.5-1l-.1.2c.8.2 1.6.6 2.2 1.1-.7-.4-1.5-.7-2.3-.8-.8-.1-1.6-.1-2.4 0-.8.1-1.6.4-2.3.8.6-.5 1.4-.9 2.2-1.1l-.1-.2c-.7.1-1.7.3-2.5 1-1.2 1.8-1.5 4.3-.8 6.5.6.5 1.5.8 2.4.8l.5-.6c-.6-.2-1.1-.5-1.6-.9l.2-.2c1 .5 2 .8 3.1.8s2.1-.3 3.1-.8l.2.2c-.5.4-1 .7-1.6.9l.5.6c.9 0 1.8-.3 2.4-.8.7-2.2.4-4.7-.8-6.5zm-5.5 4c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm4 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" fill="#FFF"/>
  </svg>
);

const DockerLogo = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" fill="#0db7ed" rx="4"/>
    <path d="M4 14h2v2H4zM7 14h2v2H7zM10 14h2v2h-2zM13 14h2v2h-2zM7 11h2v2H7zM10 11h2v2h-2zM13 11h2v2h-2zM10 8h2v2h-2zM16 11h2v5h-2z" fill="#FFF"/>
  </svg>
);

// Map Company names to SVG Logos
const getCompanyLogo = (companyName: string) => {
  const name = companyName.toLowerCase();
  if (name.includes('adobe')) return <AdobeLogo />;
  if (name.includes('atom')) return <AtomLogo />;
  if (name.includes('airtable')) return <AirtableLogo />;
  if (name.includes('alfa')) return <AlfaBankLogo />;
  if (name.includes('canva')) return <CanvaLogo />;
  if (name.includes('coinbase')) return <CoinbaseLogo />;
  if (name.includes('confluence')) return <ConfluenceLogo />;
  if (name.includes('discord')) return <DiscordLogo />;
  if (name.includes('docker')) return <DockerLogo />;
  
  // Fallbacks for seeded database companies
  if (name.includes('techcorp')) return <AdobeLogo />;
  if (name.includes('innovatech')) return <AtomLogo />;
  if (name.includes('cloudwave')) return <AirtableLogo />;
  if (name.includes('nexus')) return <AlfaBankLogo />;
  if (name.includes('startup')) return <CanvaLogo />;
  if (name.includes('brightpath')) return <CoinbaseLogo />;
  if (name.includes('fusion')) return <ConfluenceLogo />;
  if (name.includes('meridian')) return <DiscordLogo />;
  if (name.includes('blueprint')) return <DockerLogo />;
  if (name.includes('summit')) return <CanvaLogo />;
  if (name.includes('quantum')) return <CoinbaseLogo />;
  if (name.includes('verde')) return <AtomLogo />;
  if (name.includes('ironclad')) return <AlfaBankLogo />;
  if (name.includes('spark')) return <DiscordLogo />;
  if (name.includes('horizon')) return <AirtableLogo />;
  if (name.includes('artisan')) return <AdobeLogo />;
  if (name.includes('pinnacle')) return <DockerLogo />;
  if (name.includes('mosaic')) return <ConfluenceLogo />;
  if (name.includes('alpine')) return <AlfaBankLogo />;
  if (name.includes('crescent')) return <CoinbaseLogo />;
  if (name.includes('oasis')) return <CanvaLogo />;
  if (name.includes('lumina')) return <AdobeLogo />;
  if (name.includes('vertex')) return <AtomLogo />;
  if (name.includes('terragreen')) return <AirtableLogo />;

  const firstLetter = companyName.charAt(0).toUpperCase();
  const colors = [
    'bg-red-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500'
  ];
  const charCode = firstLetter.charCodeAt(0) || 0;
  const colorClass = colors[charCode % colors.length];
  
  return (
    <div className={`w-5 h-5 rounded-full ${colorClass} text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm`}>
      {firstLetter}
    </div>
  );
};

// Map names/emails to professional job titles
const getLeadPosition = (leadName: string) => {
  const name = leadName.toLowerCase();
  if (name.includes('sarah')) return 'Creative Software Developer';
  if (name.includes('james')) return 'Code Editor Specialist';
  if (name.includes('emily')) return 'Database Manager';
  if (name.includes('michael')) return 'Financial Services Consultant';
  if (name.includes('priya')) return 'Graphic Design Specialist';
  if (name.includes('david')) return 'Cryptocurrency Analyst';
  if (name.includes('lisa')) return 'Project Manager';
  if (name.includes('robert')) return 'Community Manager';
  if (name.includes('amanda')) return 'Containerization Engineer';
  if (name.includes('tanaka')) return 'Lead Infrastructure Architect';
  if (name.includes('jennifer')) return 'VP of Product Management';
  if (name.includes('alex')) return 'Security Compliance Engineer';
  if (name.includes('maria')) return 'Senior Account Executive';
  if (name.includes('christopher')) return 'Full Stack Developer';
  if (name.includes('natasha')) return 'DevOps Specialist';
  if (name.includes('daniel')) return 'Digital Marketing Lead';
  if (name.includes('sophie')) return 'UI/UX Design Director';
  if (name.includes('kevin')) return 'Cloud Infrastructure Lead';
  if (name.includes('rachel')) return 'Lead Analytics Manager';
  if (name.includes('thomas')) return 'Backend Systems Engineer';
  if (name.includes('olivia')) return 'Director of Customer Growth';
  if (name.includes('hassan')) return 'Venture Capital Associate';
  if (name.includes('carla')) return 'Principal EHR Developer';
  if (name.includes('nathan')) return 'AI/ML Research Scientist';
  if (name.includes('ashley')) return 'Sustainability Analyst';
  
  return 'SaaS Consultant';
};

const columns = [
  { key: 'company', label: 'Company', sortable: true },
  { key: 'linkedin', label: 'Linkedin', sortable: false },
  { key: 'status', label: 'Stage', sortable: true },
  { key: 'name', label: 'Contacts', sortable: true },
  { key: 'position', label: 'Position', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false },
];

export default function LeadTable({ leads, sortBy, sortOrder, onSort }: LeadTableProps) {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const deleteMutation = useDeleteLead();

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((l) => l.id));
    }
  };

  const toggleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter((item) => item !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-muted/40" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-brand" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand" />
    );
  };

  const renderStageBadge = (status: string) => {
    let bgClass = 'bg-gray-100 text-gray-700';
    let label = 'Leads';

    switch (status) {
      case 'New':
        bgClass = 'bg-slate-100 text-slate-700 border border-slate-200/50';
        label = 'Leads';
        break;
      case 'Contacted':
        bgClass = 'bg-blue-50 text-blue-700 border border-blue-100';
        label = 'Discovery';
        break;
      case 'Qualified':
        bgClass = 'bg-purple-50 text-purple-700 border border-purple-100';
        label = 'Proposal';
        break;
      case 'Converted':
        bgClass = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
        label = 'Won';
        break;
      case 'Lost':
        bgClass = 'bg-rose-50 text-rose-700 border border-rose-100';
        label = 'Lost';
        break;
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-tight leading-none ${bgClass}`}>
        {label}
      </span>
    );
  };

  const renderContact = (name: string, index: number) => {
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&fit=crop&auto=format&q=80',
    ];

    const useInitials = index % 3 === 1;

    if (useInitials) {
      const firstLetter = name.charAt(0).toUpperCase();
      const initialsColors = [
        'bg-amber-100 text-amber-700 border border-amber-200/50',
        'bg-purple-100 text-purple-700 border border-purple-200/50',
        'bg-blue-100 text-blue-700 border border-blue-200/50',
      ];
      const colorClass = initialsColors[index % initialsColors.length];
      return (
        <div className="flex items-center gap-2.5">
          <div className={`w-6 h-6 rounded-full ${colorClass} flex items-center justify-center text-[10px] font-bold shrink-0`}>
            {firstLetter}
          </div>
          <span className="text-xs font-semibold text-dark truncate">{name}</span>
        </div>
      );
    }

    const avatarUrl = avatars[index % avatars.length];
    return (
      <div className="flex items-center gap-2.5">
        <img
          src={avatarUrl}
          alt={name}
          className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-100 shadow-sm"
        />
        <span className="text-xs font-semibold text-dark truncate">{name}</span>
      </div>
    );
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border-light bg-white shadow-soft">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-light bg-surface-2/30">
              {/* Checkbox Header */}
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={leads.length > 0 && selectedLeads.length === leads.length}
                  onChange={toggleSelectAll}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-left text-[11px] font-semibold text-muted tracking-tight ${
                    col.sortable ? 'cursor-pointer select-none hover:text-dark transition-colors' : ''
                  }`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {leads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="hover:bg-surface-2/40 transition-colors group"
              >
                {/* Row Checkbox */}
                <td className="px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleSelectLead(lead.id)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
                  />
                </td>
                
                {/* Company (Logo + Name) */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {getCompanyLogo(lead.company)}
                    <span className="font-semibold text-dark text-xs truncate max-w-[150px]">{lead.company}</span>
                  </div>
                </td>

                {/* LinkedIn Link */}
                <td className="px-5 py-3.5">
                  <a
                    href={`https://linkedin.com/company/${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-dark hover:text-brand underline decoration-dark/20 hover:decoration-brand/40"
                  >
                    {lead.company}
                  </a>
                </td>

                {/* Stage Badge */}
                <td className="px-5 py-3.5">
                  {renderStageBadge(lead.status)}
                </td>

                {/* Contacts (Avatar + Name) */}
                <td className="px-5 py-3.5">
                  {renderContact(lead.name, index)}
                </td>

                {/* Position */}
                <td className="px-5 py-3.5">
                  <span className="text-xs text-muted font-medium block truncate max-w-[200px]" title={getLeadPosition(lead.name)}>
                    {getLeadPosition(lead.name)}
                  </span>
                </td>

                {/* Actions (Hover Reveal) */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <button
                      onClick={() => navigate(`/leads/${lead.id}/edit`)}
                      className="p-1 rounded text-muted hover:text-brand hover:bg-brand-light transition-colors cursor-pointer"
                      title="Edit lead"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(lead)}
                      className="p-1 rounded text-muted hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
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

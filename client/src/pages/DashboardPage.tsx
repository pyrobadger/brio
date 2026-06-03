import { useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Sliders,
  Check,
  Bell,
  Search,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLeads, useSearchLeads, useLeadStats, useCompanies } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import type { LeadStatus, LeadQueryParams } from '../types';
import StatCard from '../components/dashboard/StatCard';
import LeadTable from '../components/leads/LeadTable';
import LeadCardList from '../components/leads/LeadCardList';
import LeadFilters from '../components/leads/LeadFilters';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import { PageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';

// Recharts imports for high fidelity graphs
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

// Mock data for the Leads Acquisition Wavy Line Chart (1Y view)
const leadsGrowthData = [
  { name: 'Mar', value: 8 },
  { name: 'Apr', value: 14 },
  { name: 'May', value: 11 },
  { name: 'Jun', value: 19 },
  { name: 'Jul', value: 15 },
  { name: 'Aug', value: 12 },
  { name: 'Sept', value: 22 },
  { name: 'Oct', value: 17 },
  { name: 'Nov', value: 24 },
  { name: 'Dec', value: 16 },
  { name: 'Jan', value: 20 },
  { name: 'Feb', value: 22 },
  { name: 'Mar', value: 25 }
];

const leadsData1D = [
  { name: '09:00 AM', value: 2 },
  { name: '11:00 AM', value: 5 },
  { name: '01:00 PM', value: 8 },
  { name: '03:00 PM', value: 14 },
  { name: '05:00 PM', value: 19 },
  { name: '07:00 PM', value: 25 }
];

const leadsData1W = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 9 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 11 },
  { name: 'Fri', value: 18 },
  { name: 'Sat', value: 22 },
  { name: 'Sun', value: 25 }
];

const leadsData1M = [
  { name: 'Week 1', value: 8 },
  { name: 'Week 2', value: 14 },
  { name: 'Week 3', value: 20 },
  { name: 'Week 4', value: 25 }
];

const leadsData6M = [
  { name: 'Oct', value: 12 },
  { name: 'Nov', value: 19 },
  { name: 'Dec', value: 15 },
  { name: 'Jan', value: 22 },
  { name: 'Feb', value: 20 },
  { name: 'Mar', value: 25 }
];

const leadsData1Y = leadsGrowthData;

const leadsDataALL = [
  { name: '2022', value: 5 },
  { name: '2023', value: 12 },
  { name: '2024', value: 18 },
  { name: '2025', value: 25 }
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const leadsSectionRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [timeRange, setTimeRange] = useState('1 Y');
  const [companyFilter, setCompanyFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [activeTab, setActiveTab] = useState<'status' | 'sources' | 'qualification'>('status');

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Build query params
  const queryParams: LeadQueryParams = useMemo(() => ({
    page,
    limit,
    sortBy,
    sortOrder,
    ...(statusFilter && { status: statusFilter }),
    ...(companyFilter && { company: companyFilter }),
  }), [page, limit, sortBy, sortOrder, statusFilter, companyFilter]);

  // Data fetching
  const { data: leadsResponse, isLoading: leadsLoading } = useLeads(
    debouncedSearch ? undefined : queryParams
  );
  const { data: searchResponse, isLoading: searchLoading } = useSearchLeads({
    q: debouncedSearch,
    page,
    limit,
  });
  const { data: statsResponse, isLoading: statsLoading } = useLeadStats();
  const { data: companiesResponse } = useCompanies();

  // Dynamic leads acquisition chart data linking to database total leads
  const leadsAcquisitionData = useMemo(() => {
    let rawData = leadsData1Y;
    if (timeRange === '1 D') rawData = leadsData1D;
    else if (timeRange === '1 W') rawData = leadsData1W;
    else if (timeRange === '1 M') rawData = leadsData1M;
    else if (timeRange === '6 M') rawData = leadsData6M;
    else if (timeRange === '1 Y') rawData = leadsData1Y;
    else if (timeRange === 'ALL') rawData = leadsDataALL;

    const data = [...rawData];
    if (statsResponse?.data && data.length > 0) {
      const lastIndex = data.length - 1;
      data[lastIndex] = { ...data[lastIndex], value: statsResponse.data.total };
    }
    return data;
  }, [statsResponse, timeRange]);

  const isSearchMode = debouncedSearch.length > 0;
  const currentResponse = isSearchMode ? searchResponse : leadsResponse;
  const leads = currentResponse?.data || [];
  const meta = currentResponse?.meta;
  const isLoading = isSearchMode ? searchLoading : leadsLoading;
  const stats = statsResponse?.data;
  const companies = companiesResponse?.data || [];

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Handle filter changes
  const handleStatusFilter = (status: LeadStatus | '') => {
    setStatusFilter(status);
    setPage(1);
    
    // Smooth scroll to leads section
    setTimeout(() => {
      leadsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCompanyFilter = (company: string) => {
    setCompanyFilter(company);
    setPage(1);
    
    // Smooth scroll to leads section
    setTimeout(() => {
      leadsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (statsLoading && leadsLoading) return <PageSpinner />;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Top Banner Actions row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white border border-border p-4 rounded-2xl shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate('/leads/new')}
            className="bg-brand hover:bg-brand-dark text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold px-2">
            <Check className="w-4 h-4" />
            <span>Last updated now</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                leadsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              placeholder="Search leads..."
              className="pl-9 pr-4 py-2 border border-border bg-white rounded-xl text-xs placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand w-48 sm:w-60 transition-all"
            />
          </div>

          <button className="p-2 rounded-xl border border-border text-muted hover:text-dark hover:bg-surface-2 transition-colors cursor-pointer bg-white">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats ? stats.total : 25}
          compareText="+24 vs last week"
          badgeText="8%"
          badgeType="success"
          onClick={() => handleStatusFilter('')}
          isActive={statusFilter === ''}
        />
        <StatCard
          title="New Leads"
          value={stats ? stats.byStatus.New : 12}
          compareText="+4 vs last week"
          badgeText="3%"
          badgeType="success"
          onClick={() => handleStatusFilter('New')}
          isActive={statusFilter === 'New'}
        />
        <StatCard
          title="Qualified Leads"
          value={stats ? stats.byStatus.Qualified : 5}
          compareText="+6 vs last week"
          badgeText="4%"
          badgeType="success"
          onClick={() => handleStatusFilter('Qualified')}
          isActive={statusFilter === 'Qualified'}
        />
        <StatCard
          title="Converted Leads"
          value={stats ? stats.byStatus.Converted : 3}
          compareText="+2 vs last week"
          badgeText="2%"
          badgeType="success"
          onClick={() => handleStatusFilter('Converted')}
          isActive={statusFilter === 'Converted'}
        />
      </div>

      {/* Row 2: Leads Acquisition (Left) + Calendar List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Acquisition wavy line chart */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Leads Acquisition</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-heading font-bold text-dark">{stats?.total ?? 25} Leads</span>
                <span className="text-xs text-emerald-600 font-semibold">+8% vs last week</span>
              </div>
            </div>
            {/* Timescale filters */}
            <div className="flex items-center gap-1 border border-border p-1 rounded-xl bg-surface-2">
              {['1 D', '1 W', '1 M', '6 M', '1 Y', 'ALL'].map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeRange(time)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    time === timeRange
                      ? 'bg-white text-dark shadow-sm'
                      : 'text-muted hover:text-dark'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsAcquisitionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f5cf5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0f5cf5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 40]}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                  labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}
                  itemStyle={{ fontSize: '11px', color: '#0f5cf5' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0f5cf5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Leads Widget */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-soft flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-dark">Recent Leads</h3>
            <span className="text-[10px] bg-brand-light text-brand px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Database</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pt-1">
            {leads.slice(0, 3).map((lead) => {
              // Mapped stage colors
              let bgClass = 'bg-slate-100 text-slate-700';
              let label = 'Leads';
              switch (lead.status) {
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
                <div 
                  key={lead.id}
                  onClick={() => {
                    setSearchQuery(lead.name);
                    setPage(1);
                    leadsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="p-3 bg-surface-2/60 hover:bg-brand-light/30 border border-border-light rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 leading-tight">
                      <h4 className="text-xs font-semibold text-dark truncate">{lead.name}</h4>
                      <p className="text-[10px] text-muted truncate mt-0.5">{lead.company}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-tight ${bgClass} shrink-0`}>
                    {label}
                  </span>
                </div>
              );
            })}
            {leads.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-muted py-6">
                No recent leads found.
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              setSearchQuery('');
              handleStatusFilter('');
              leadsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="w-full bg-white hover:bg-surface-2 border border-border text-dark text-xs font-semibold py-2 rounded-xl transition-all shadow-sm cursor-pointer text-center block"
          >
            View All Database Leads
          </button>
        </div>
      </div>

      {/* Row 3: Leads Management (Left, 2/3 width) + Locations Map (Right, 1/3 width) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Management Tabs & summary */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-dark">Leads Management</h3>
              <button className="p-1 rounded hover:bg-surface-2 cursor-pointer text-muted hover:text-dark">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
 
            {/* Sub tabs */}
            <div className="flex border-b border-border-light pb-0.5">
              {(['status', 'sources', 'qualification'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold capitalize border-b-2 -mb-0.5 transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'border-brand text-brand font-bold'
                      : 'border-transparent text-muted hover:text-dark'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
 
            {/* Tab content - Status grid (4-column horizontal layout) */}
            {activeTab === 'status' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                <div className="p-3 bg-surface-2 rounded-xl border border-border-light space-y-1 cursor-pointer hover:border-brand/40 transition-colors" onClick={() => handleStatusFilter('New')}>
                  <span className="text-[10px] font-semibold text-muted uppercase">Open</span>
                  <p className="text-xl font-bold text-dark">{stats?.byStatus.New ?? 0} <span className="text-[10px] text-muted font-normal">leads</span></p>
                </div>
                
                <div className="p-3 bg-surface-2 rounded-xl border border-border-light space-y-1 cursor-pointer hover:border-brand/40 transition-colors" onClick={() => handleStatusFilter('Contacted')}>
                  <span className="text-[10px] font-semibold text-muted uppercase">In Progress</span>
                  <p className="text-xl font-bold text-dark">{(stats?.byStatus.Contacted ?? 0) + (stats?.byStatus.Qualified ?? 0)} <span className="text-[10px] text-muted font-normal">leads</span></p>
                </div>
 
                <div className="p-3 bg-surface-2 rounded-xl border border-border-light space-y-1 cursor-pointer hover:border-brand/40 transition-colors" onClick={() => handleStatusFilter('Lost')}>
                  <span className="text-[10px] font-semibold text-muted uppercase">Lost</span>
                  <p className="text-xl font-bold text-dark">{stats?.byStatus.Lost ?? 0} <span className="text-[10px] text-muted font-normal">leads</span></p>
                </div>
 
                <div className="p-3 bg-surface-2 rounded-xl border border-border-light space-y-1 cursor-pointer hover:border-brand/40 transition-colors" onClick={() => handleStatusFilter('Converted')}>
                  <span className="text-[10px] font-semibold text-muted uppercase">Won</span>
                  <p className="text-xl font-bold text-dark">{stats?.byStatus.Converted ?? 0} <span className="text-[10px] text-muted font-normal">leads</span></p>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-xs text-muted bg-surface-2 rounded-xl border border-dashed border-border">
                Sources and qualification views are mocked.
              </div>
            )}
          </div>
 
          <div className="text-[9px] text-muted flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
            <span>Click any card status to filter the database below.</span>
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-dark">Lead Status Breakdown</h3>
              <span className="text-[10px] bg-brand-light text-brand px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Database</span>
            </div>

            <div className="space-y-3 pt-4">
              {[
                { name: 'New' as LeadStatus, label: 'New / Uncontacted', count: stats?.byStatus.New ?? 0, colorClass: 'bg-slate-400', textClass: 'text-slate-700' },
                { name: 'Contacted' as LeadStatus, label: 'Contacted / Active', count: stats?.byStatus.Contacted ?? 0, colorClass: 'bg-blue-500', textClass: 'text-blue-700' },
                { name: 'Qualified' as LeadStatus, label: 'Qualified / Proposal', count: stats?.byStatus.Qualified ?? 0, colorClass: 'bg-[#8b5cf6]', textClass: 'text-[#8b5cf6]' },
                { name: 'Converted' as LeadStatus, label: 'Converted / Won', count: stats?.byStatus.Converted ?? 0, colorClass: 'bg-emerald-500', textClass: 'text-emerald-700' },
                { name: 'Lost' as LeadStatus, label: 'Lost / Closed', count: stats?.byStatus.Lost ?? 0, colorClass: 'bg-rose-500', textClass: 'text-rose-700' }
              ].map((status) => {
                const total = stats?.total ?? 0;
                const percentage = total > 0 ? Math.round((status.count / total) * 100) : 0;
                
                return (
                  <div 
                    key={status.name}
                    onClick={() => handleStatusFilter(status.name)}
                    className={`space-y-1.5 cursor-pointer group p-1.5 rounded-xl hover:bg-brand-light/30 transition-all border border-transparent ${statusFilter === status.name ? 'bg-brand-light/40 border-brand/20' : ''}`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full ${status.colorClass}`} />
                        <span className="font-semibold text-dark truncate text-xs">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-dark">{status.count}</span>
                        <span className="text-muted/65 text-[10px]">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-2 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`${status.colorClass} h-1.5 rounded-full transition-all duration-500`} 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => handleStatusFilter('')}
            className="w-full bg-white hover:bg-surface-2 border border-border text-dark text-xs font-semibold py-2 rounded-xl transition-all shadow-sm cursor-pointer text-center block mt-2"
          >
            Clear Status Filter
          </button>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-border-light my-2" />

      {/* Mockup Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-border p-3 rounded-2xl shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter toggle button */}
          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`font-semibold text-xs px-3.5 py-2 rounded-lg border flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isFilterPanelOpen 
                ? 'bg-brand-light text-brand border-brand/30' 
                : 'bg-white hover:bg-surface-2 text-dark border-border'
            }`}
          >
            <Sliders className="w-4 h-4 text-muted" />
            <span>Filter</span>
          </button>

          {/* Sort Info toggle */}
          <button 
            onClick={() => {
              import('react-hot-toast').then((t) => t.toast.loading("Click on any table column header below to sort your database directly.", { duration: 3000 }));
            }}
            className="bg-white hover:bg-surface-2 text-dark border border-border font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3v18M17 3l4 4M17 3l-4 4M7 21V3M7 21l-4-4M7 21l4-4" />
            </svg>
            <span>Sort</span>
          </button>
        </div>

        {/* Right side toggles and Add New */}
        <div className="flex items-center gap-2">
          {/* List/Gallery toggle */}
          <div className="flex items-center border border-border rounded-xl bg-white overflow-hidden shadow-sm p-0.5">
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-2 text-dark border border-border/20 transition-all flex items-center gap-1 cursor-pointer">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
                <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
                <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
              </svg>
              <span>List</span>
            </button>
            <button 
              onClick={() => {
                import('react-hot-toast').then((t) => t.toast.loading("Gallery view is currently a mockup."));
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted hover:text-dark transition-all flex items-center gap-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Gallery</span>
            </button>
          </div>

          {/* Add New dropdown button */}
          <button 
            onClick={() => navigate('/leads/new')}
            className="bg-[#0f172a] hover:bg-black text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/60 border-l border-white/20 pl-1 -mr-1" />
          </button>
        </div>
      </div>

      {/* Collapsible search/filters panel */}
      {isFilterPanelOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border p-4 rounded-2xl shadow-soft space-y-3"
        >
          <div className="flex justify-between items-center pb-2 border-b border-border-light">
            <span className="text-xs font-bold text-dark uppercase tracking-wider">Active Search & Filters</span>
            {statusFilter || companyFilter ? (
              <button 
                onClick={() => {
                  handleStatusFilter('');
                  handleCompanyFilter('');
                }}
                className="text-xs text-red-500 hover:text-red-600 font-semibold"
              >
                Clear All
              </button>
            ) : null}
          </div>
          <LeadFilters
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilter}
            companyFilter={companyFilter}
            onCompanyFilterChange={handleCompanyFilter}
            companies={companies}
          />
        </motion.div>
      )}

      {/* Leads Management Section (Original CRM Actions Panel) */}
      <div ref={leadsSectionRef} className="space-y-4 bg-white border border-border p-5 rounded-2xl shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold text-dark">All CRM Database Leads</h2>
          {statusFilter && (
            <button
              onClick={() => handleStatusFilter('')}
              className="text-xs text-brand hover:text-brand-dark font-semibold transition-all cursor-pointer"
            >
              Clear Filter ({statusFilter})
            </button>
          )}
        </div>

        {/* Leads Display */}
        {isLoading ? (
          <PageSpinner />
        ) : leads.length === 0 ? (
          <EmptyState
            title={isSearchMode ? 'No results found' : 'No leads yet'}
            description={
              isSearchMode
                ? `No leads match "${debouncedSearch}". Try a different search.`
                : 'Start by adding your first lead to the CRM.'
            }
            action={
              !isSearchMode ? (
                <Link to="/leads/new">
                  <Button>
                    <Plus className="w-4 h-4" />
                    Add Your First Lead
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Desktop Table / Mobile Cards */}
            <div className="hidden md:block">
              <LeadTable
                leads={leads}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </div>
            <div className="md:hidden">
              <LeadCardList leads={leads} />
            </div>

            {/* Pagination */}
            {meta && (
              <Pagination
                meta={meta}
                onPageChange={setPage}
                onLimitChange={handleLimitChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

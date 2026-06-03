import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  Settings,
  HelpCircle,
  ChevronRight,
  Bell,
  ChevronsUpDown
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

const mainNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads/new', label: 'Add Lead', icon: UserPlus },
];


export default function AppLayout() {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-border fixed h-full z-30">
        {/* Logo / Header */}
        <div className="p-4 flex items-center justify-between border-b border-border-light">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0a1931] flex items-center justify-center shadow-md">
              {/* Custom Brio node logo */}
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="font-heading text-sm font-bold text-dark tracking-tight leading-none">Brio</h1>
              <p className="text-[10px] text-muted mt-0.5">CR Management</p>
            </div>
          </div>
          <button className="p-1.5 rounded-lg text-muted hover:text-dark hover:bg-surface-2 transition-colors cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
        </div>

        {/* Mesh Switcher */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between border border-border rounded-xl p-2.5 bg-white shadow-soft hover:border-lilac-dark transition-colors cursor-pointer group">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-lilac flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              </div>
              <span className="text-xs font-semibold text-dark">Mesh</span>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-muted group-hover:text-dark transition-colors" />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4">
          <nav className="space-y-0.5">
            {mainNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-lilac text-brand font-semibold shadow-soft'
                      : 'text-muted hover:bg-surface-2 hover:text-dark'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>


        </div>

        {/* Sidebar Footer Elements */}
        <div className="p-3 border-t border-border-light space-y-3">
          {/* Settings & Help links */}
          <div className="space-y-0.5">
            <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-muted hover:text-dark hover:bg-surface-2 transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-muted hover:text-dark hover:bg-surface-2 transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" />
                <span>Help Center</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-2 transition-all cursor-pointer group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                AP
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-dark truncate">Aditya Patil</span>
                  <span className="w-3 h-3 rounded-full bg-brand text-white flex items-center justify-center text-[7px]">✓</span>
                </div>
                <span className="text-[10px] text-muted truncate block">made with ❤️ by Aditya</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted group-hover:text-dark transition-colors" />
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-border flex items-center justify-between px-4 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0a1931] flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="font-heading text-sm font-bold text-dark">Brio</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1 text-muted hover:text-dark cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
            AP
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-border flex items-center justify-around z-30">
        {mainNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? 'text-brand' : 'text-muted'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Main Content Pane */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-14 lg:pb-0 min-w-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6">
          <Outlet />
        </div>
      </main>

      {/* Global Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#0f172a',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgba(15,23,42,0.05)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

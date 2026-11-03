import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Clock, 
  Settings, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { translations } from '../i18n';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  notesCount: number;
  language: Language;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  notesCount,
  language,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const t = translations[language];

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: 'tasks',
      label: t.nav.tasks,
      icon: <CheckSquare className="h-4 w-4" />,
      badge: pendingTasksCount,
    },
    {
      id: 'notes',
      label: t.nav.notes,
      icon: <FileText className="h-4 w-4" />,
      badge: notesCount,
    },
    {
      id: 'timer',
      label: t.nav.timer,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 p-4">
          {/* Workspace Title & Badge */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-base shadow-sm">
              ES
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Espacio Personal
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'es' ? 'Idioma: Español' : language === 'en' ? 'Language: English' : 'Idioma: Português'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Quick Status */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Interfaz Localizada</span>
            </span>
            <span className="font-mono text-slate-400 text-[11px]">v2.4</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-200">
              ES
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Usuario Activo
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Español (Predeterminado)
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

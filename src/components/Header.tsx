import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Plus, 
  Globe, 
  Menu, 
  X, 
  Check,
  ChevronDown
} from 'lucide-react';
import { ActiveTab, Language, ThemeMode } from '../types';
import { translations } from '../i18n';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onOpenNewTask: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  theme,
  setTheme,
  onOpenNewTask,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[language];

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'Español (ES)', flag: '🇪🇸' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
  ];

  const currentLangLabel = languagesList.find((l) => l.code === language)?.label || 'Español (ES)';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dashboard');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {t.appTitle}
          </a>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.dashboard}
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'tasks'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.tasks}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'notes'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.notes}
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'timer'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.timer}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'settings'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.settings}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + utility buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 h-9 px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
              title="Cambiar idioma de la interfaz"
              aria-expanded={langMenuOpen}
            >
              <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>{currentLangLabel}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                    Seleccionar Idioma
                  </div>
                  {languagesList.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && (
                        <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 h-9 px-3 sm:px-4 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.newAction}</span>
            <span className="sm:hidden">{t.newAction.split(' ')[1] || t.newAction}</span>
          </button>
        </div>

      </div>
    </header>
  );
};

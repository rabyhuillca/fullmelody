import React, { useState } from 'react';
import { 
  Globe, 
  Sun, 
  Moon, 
  Download, 
  RotateCcw, 
  Check, 
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { translations } from '../i18n';

interface SettingsViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onExportData: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  setLanguage,
  theme,
  setTheme,
  onExportData,
  onResetData,
}) => {
  const t = translations[language];
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const languagesList: { code: Language; name: string; flag: string; region: string }[] = [
    { code: 'es', name: t.settings.languageSection.spanishName, flag: '🇪🇸', region: 'España & Latinoamérica' },
    { code: 'en', name: t.settings.languageSection.englishName, flag: '🇺🇸', region: 'Global / English' },
    { code: 'pt', name: t.settings.languageSection.portugueseName, flag: '🇵🇹', region: 'Brasil & Portugal' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-4xl">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Notice Banner: Spanish Active */}
      <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 dark:border-indigo-900/60 dark:bg-indigo-950/20 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-indigo-900 dark:text-indigo-200">
            Interfaz configurada en Español
          </span>
          <span className="text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
            Todos los menús, diálogos, estados, botones, métricas y recordatorios están expresados en español con localización nativa.
          </span>
        </div>
      </div>

      {/* Language Section */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t.settings.languageSection.title}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.settings.languageSection.desc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {languagesList.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{lang.flag}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="mt-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {lang.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {lang.region}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appearance Section */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t.settings.appearanceSection.title}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.settings.appearanceSection.desc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-amber-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {t.settings.appearanceSection.light}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fondo claro con tipografía nítida
                </span>
              </div>
            </div>
            {theme === 'light' && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-indigo-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {t.settings.appearanceSection.dark}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fondo oscuro con compensación óptica
                </span>
              </div>
            </div>
            {theme === 'dark' && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col gap-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          {t.settings.dataSection.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.settings.dataSection.desc}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportData}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-indigo-600" />
            <span>{t.settings.dataSection.exportBtn}</span>
          </button>

          {!resetConfirmOpen ? (
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.settings.dataSection.resetBtn}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                ¿Confirmar restauración?
              </span>
              <button
                onClick={() => {
                  onResetData();
                  setResetConfirmOpen(false);
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Sí, restablecer
              </button>
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* System Information */}
      <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
          <Info className="h-4 w-4 text-slate-500" />
          <span>{t.settings.aboutSection.title}</span>
        </div>
        <p>{t.settings.aboutSection.version}</p>
        <p>{t.settings.aboutSection.locale}</p>
        <p>{t.settings.aboutSection.status}</p>
      </div>

    </div>
  );
};

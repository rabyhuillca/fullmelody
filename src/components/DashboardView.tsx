import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  FileText, 
  Pin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Task, Note, ActivityLog, Language, ActiveTab } from '../types';
import { translations } from '../i18n';

interface DashboardViewProps {
  tasks: Task[];
  notes: Note[];
  activities: ActivityLog[];
  language: Language;
  onToggleTask: (taskId: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewTask: () => void;
  onSelectNote: (note: Note) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  notes,
  activities,
  language,
  onToggleTask,
  onSelectTab,
  onOpenNewTask,
  onSelectNote,
}) => {
  const t = translations[language];

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const pinnedNotes = notes.filter((n) => n.isPinned);

  // Weekly hours data (Monday to Sunday)
  const weeklyData = [
    { day: 'Lun', hours: 5.5, label: '5.5h' },
    { day: 'Mar', hours: 6.8, label: '6.8h' },
    { day: 'Mié', hours: 7.2, label: '7.2h' },
    { day: 'Jue', hours: 6.0, label: '6.0h' },
    { day: 'Vie', hours: 8.0, label: '8.0h' },
    { day: 'Sáb', hours: 3.5, label: '3.5h' },
    { day: 'Dom', hours: 2.0, label: '2.0h' },
  ];
  const maxHours = 8.0;

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.dashboard.greeting}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.dashboard.overviewSub}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('tasks')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            {t.dashboard.viewAllTasks}
          </button>
          <button
            onClick={onOpenNewTask}
            className="px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            + {t.newAction}
          </button>
        </div>
      </div>

      {/* KPI Stats Grid (Single-Elevation, Tabular figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>{t.dashboard.stats.completedTasks}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {completedCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              / {tasks.length} total
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {tasks.length > 0 ? `${Math.round((completedCount / tasks.length) * 100)}% de avance` : 'Sin tareas'}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>{t.dashboard.stats.activeTasks}</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              por procesar
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {pendingTasks.filter((t) => t.priority === 'high').length} con prioridad alta
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>{t.dashboard.stats.focusTime}</span>
            <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              1h 45m
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              sesiones
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            4 bloques Pomodoro completados
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>{t.dashboard.stats.efficiency}</span>
            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              94.2%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              +4.8%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Ritmo constante en entregas
          </div>
        </div>

      </div>

      {/* Main Split: Weekly Activity Chart + Today's Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity Bar Chart (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.dashboard.weeklyActivity}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.dashboard.hoursLabel} registradas durante los últimos 7 días
              </p>
            </div>
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              39.0h en total
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-8 pb-2">
            <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-48">
              {weeklyData.map((item, index) => {
                const heightPercentage = Math.round((item.hours / maxHours) * 100);
                const isToday = index === 2; // Wednesday/Mid-week sample
                return (
                  <div key={item.day} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[11px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1.5 tabular-nums">
                      {item.label}
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md h-full flex items-end overflow-hidden p-0.5">
                      <div
                        style={{ height: `${heightPercentage}%` }}
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          isToday
                            ? 'bg-indigo-600 dark:bg-indigo-500'
                            : 'bg-indigo-300 dark:bg-indigo-800 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-700'
                        }`}
                      />
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Promedio diario: 5.57 horas</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Cumplimiento del 100% de la meta semanal</span>
          </div>
        </div>

        {/* Today's Priority Tasks (1 column) */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.dashboard.todayPriorities}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Acción directa con 1 clic
              </p>
            </div>
            <button
              onClick={() => onSelectTab('tasks')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Ver más</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 my-2">
            {pendingTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="py-3 flex items-start gap-3 group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg px-1 transition-colors"
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                  aria-label="Marcar tarea como completada"
                >
                  <Circle className="h-4 w-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{task.category}</span>
                    <span>·</span>
                    <span className={task.priority === 'high' ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}

            {pendingTasks.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                {t.dashboard.noTasksToday}
              </div>
            )}
          </div>

          <button
            onClick={onOpenNewTask}
            className="w-full mt-2 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors text-center"
          >
            + Añadir tarea rápida
          </button>
        </div>

      </div>

      {/* Secondary Row: Pinned Notes & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pinned Notes Showcase */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Pin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.dashboard.pinnedNotes}
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('notes')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>{t.dashboard.quickNoteAction}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {pinnedNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  onSelectTab('notes');
                  onSelectNote(note);
                }}
                className="p-4 rounded-lg border border-slate-100 bg-slate-50/70 hover:border-indigo-200 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>{note.category}</span>
                    <span className="font-mono text-[10px]">{note.updatedAt.split(' ')[0]}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {t.dashboard.recentActivity}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              Registros en tiempo real
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {activities.map((act) => (
              <div key={act.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {act.description}
                  </span>
                </div>
                <span className="text-slate-400 dark:text-slate-500 whitespace-nowrap font-mono text-[11px] shrink-0">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

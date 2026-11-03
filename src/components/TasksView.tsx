import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  List, 
  Columns, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar, 
  Tag, 
  AlertTriangle,
  ArrowRight,
  X
} from 'lucide-react';
import { Task, TaskPriority, TaskCategory, TaskStatus, Language } from '../types';
import { translations } from '../i18n';

interface TasksViewProps {
  tasks: Task[];
  language: Language;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskStatus: (id: string, status: TaskStatus) => void;
  onToggleTask: (id: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  language,
  onAddTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onToggleTask,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form state for creating a new task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Desarrollo');
  const [newStatus, setNewStatus] = useState<TaskStatus>('todo');
  const [newDueDate, setNewDueDate] = useState('2026-11-06');

  const categories: TaskCategory[] = ['Desarrollo', 'Diseño', 'Marketing', 'Operaciones', 'Personal'];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesCategory =
      selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Sin descripción adicional.',
      priority: newPriority,
      category: newCategory,
      status: newStatus,
      dueDate: newDueDate || '2026-11-10',
    });

    setNewTitle('');
    setNewDesc('');
    setIsCreateModalOpen(false);
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    if (priority === 'high') return language === 'es' ? 'Alta' : language === 'en' ? 'High' : 'Alta';
    if (priority === 'medium') return language === 'es' ? 'Media' : language === 'en' ? 'Medium' : 'Média';
    return language === 'es' ? 'Baja' : language === 'en' ? 'Low' : 'Baixa';
  };

  const getPriorityColor = (priority: TaskPriority) => {
    if (priority === 'high') return 'text-red-600 dark:text-red-400 font-semibold';
    if (priority === 'medium') return 'text-amber-600 dark:text-amber-400 font-medium';
    return 'text-slate-500 dark:text-slate-400';
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.tasks.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.tasks.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg dark:bg-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>{t.tasks.views.list}</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>{t.tasks.views.board}</span>
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.newAction}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.tasks.searchTask}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">{t.tasks.filters.allPriorities}</option>
            <option value="high">{t.tasks.filters.high}</option>
            <option value="medium">{t.tasks.filters.medium}</option>
            <option value="low">{t.tasks.filters.low}</option>
          </select>
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">{t.tasks.filters.allCategories}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Mode: List */}
      {viewMode === 'list' && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Estado</th>
                  <th className="py-3 px-4">Tarea y Especificaciones</th>
                  <th className="py-3 px-4 w-32">Categoría</th>
                  <th className="py-3 px-4 w-28">Prioridad</th>
                  <th className="py-3 px-4 w-32 text-right">Entrega</th>
                  <th className="py-3 px-4 w-20 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title={isCompleted ? t.tasks.actions.markTodo : t.tasks.actions.markComplete}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span
                            className={`font-semibold text-slate-900 dark:text-white ${
                              isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                            {task.description}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {task.category}
                      </td>
                      <td className="py-3 px-4">
                        <span className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {task.dueDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title={t.tasks.actions.delete}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTasks.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              <p>{t.tasks.emptyState}</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + {t.tasks.createFirst}
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Mode: Kanban Board */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((colStatus) => {
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);
            const colTitle =
              colStatus === 'todo'
                ? t.tasks.columns.todo
                : colStatus === 'in_progress'
                ? t.tasks.columns.in_progress
                : t.tasks.columns.completed;

            return (
              <div
                key={colStatus}
                className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-3 min-h-[400px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {colTitle}
                  </span>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/80 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>{task.category}</span>
                          <span className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {task.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {task.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px]">
                        <span className="font-mono text-slate-400 tabular-nums">
                          {task.dueDate}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {colStatus !== 'completed' && (
                            <button
                              onClick={() =>
                                onUpdateTaskStatus(
                                  task.id,
                                  colStatus === 'todo' ? 'in_progress' : 'completed'
                                )
                              }
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/80 hover:bg-indigo-600 hover:text-white dark:bg-slate-700 dark:hover:bg-indigo-500 transition-colors"
                              title="Avanzar estado"
                            >
                              Avanzar →
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-[11px] text-slate-400 dark:text-slate-600 py-8">
                      Sin tareas en esta columna
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Task Dialog */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.tasks.createModal.title}
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.tasks.createModal.taskTitleLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t.tasks.createModal.taskTitlePlaceholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.tasks.createModal.descLabel}
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={t.tasks.createModal.descPlaceholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.tasks.createModal.categoryLabel}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.tasks.createModal.priorityLabel}
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="high">{t.tasks.filters.high}</option>
                    <option value="medium">{t.tasks.filters.medium}</option>
                    <option value="low">{t.tasks.filters.low}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.tasks.createModal.statusLabel}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="todo">{t.tasks.columns.todo}</option>
                    <option value="in_progress">{t.tasks.columns.in_progress}</option>
                    <option value="completed">{t.tasks.columns.completed}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.tasks.createModal.dueDateLabel}
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  {t.tasks.createModal.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t.tasks.createModal.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

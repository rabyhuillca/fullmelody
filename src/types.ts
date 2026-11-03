export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'Desarrollo' | 'Diseño' | 'Marketing' | 'Operaciones' | 'Personal';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  createdAt: string;
}

export type NoteCategory = 'Proyectos' | 'Ideas' | 'Reuniones' | 'Personal';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
  updatedAt: string;
}

export type TimerMode = 'work' | 'short_break' | 'long_break';

export interface PomodoroSession {
  id: string;
  type: TimerMode;
  durationMinutes: number;
  completedAt: string;
  taskTitle?: string;
}

export interface ActivityLog {
  id: string;
  type: 'task' | 'note' | 'timer' | 'system';
  description: string;
  timestamp: string;
}

export type ActiveTab = 'dashboard' | 'tasks' | 'notes' | 'timer' | 'settings';
export type Language = 'es' | 'en' | 'pt';
export type ThemeMode = 'light' | 'dark';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Pin, 
  Trash2, 
  Copy, 
  Check, 
  Folder, 
  X,
  FileText
} from 'lucide-react';
import { Note, NoteCategory, Language } from '../types';
import { translations } from '../i18n';

interface NotesViewProps {
  notes: Note[];
  language: Language;
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  selectedNoteId?: string;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  language,
  onAddNote,
  onDeleteNote,
  onTogglePin,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NoteCategory>('Proyectos');
  const [newIsPinned, setNewIsPinned] = useState(false);

  const categories: NoteCategory[] = ['Proyectos', 'Ideas', 'Reuniones', 'Personal'];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort pinned first, then by date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddNote({
      title: newTitle.trim(),
      content: newContent.trim() || 'Sin contenido.',
      category: newCategory,
      isPinned: newIsPinned,
    });

    setNewTitle('');
    setNewContent('');
    setNewIsPinned(false);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.notes.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.notes.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap self-start sm:self-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t.notes.newNoteBtn}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.notes.searchNote}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">{t.notes.filterCategory}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.map((note) => {
          const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
          return (
            <div
              key={note.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between shadow-xs ${
                note.isPinned
                  ? 'border-indigo-200 bg-indigo-50/20 dark:border-indigo-900/40 dark:bg-slate-900'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Folder className="h-3.5 w-3.5 text-slate-400" />
                    <span>{note.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(note.id)}
                      className={`p-1 rounded transition-colors ${
                        note.isPinned
                          ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                      title={note.isPinned ? t.notes.unpinAction : t.notes.pinAction}
                    >
                      <Pin className={`h-3.5 w-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleCopy(note.id, `${note.title}\n\n${note.content}`)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      title={t.notes.copyAction}
                    >
                      {copiedNoteId === note.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title={t.notes.deleteAction}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {note.title}
                </h3>
                
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                <span>{wordCount} palabras</span>
                <span>{note.updatedAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {sortedNotes.length === 0 && (
        <div className="py-16 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <FileText className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p>{t.notes.emptyState}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + {t.notes.newNoteBtn}
          </button>
        </div>
      )}

      {/* Modal: Create Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.notes.createModal.title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="mt-4 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.notes.createModal.titleLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t.notes.createModal.titlePlaceholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.notes.createModal.contentLabel} *
                </label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={t.notes.createModal.contentPlaceholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.notes.createModal.categoryLabel}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NoteCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                    <input
                      type="checkbox"
                      checked={newIsPinned}
                      onChange={(e) => setNewIsPinned(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>{t.notes.createModal.isPinnedLabel}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  {t.notes.createModal.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t.notes.createModal.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};


import React, { useState, useEffect, useCallback } from 'react';
import { DiaryEntry, ViewMode } from './types';
import DiaryCard from './components/DiaryCard';
import Editor from './components/Editor';
import EntryView from './components/EntryView';
import { analyzeDiaryEntry } from './services/geminiService';

const App: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindful_diary_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('mindful_diary_entries', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = async (title: string, content: string) => {
    const isNew = !selectedEntry;
    let entry: DiaryEntry;

    if (isNew) {
      entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title,
        content,
      };
      setEntries([entry, ...entries]);
    } else {
      entry = {
        ...selectedEntry!,
        title,
        content,
      };
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
    }

    // After saving, switch to view mode and analyze
    setSelectedEntry(entry);
    setViewMode(ViewMode.VIEW);
    
    // Trigger AI Analysis
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDiaryEntry(content);
      const updatedEntry = { ...entry, aiAnalysis: analysis };
      setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
      setSelectedEntry(updatedEntry);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteEntry = () => {
    if (selectedEntry) {
      setEntries(entries.filter(e => e.id !== selectedEntry.id));
      setViewMode(ViewMode.LIST);
      setSelectedEntry(null);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      {viewMode === ViewMode.LIST && (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 px-6 py-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">
                  <i className="fas fa-feather-pointed"></i>
                </span>
                Mindful
              </h1>
            </div>
            
            <div className="flex flex-1 max-w-md relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="text" 
                placeholder="Search your thoughts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-slate-100 rounded-full border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all"
              />
            </div>

            <button 
              onClick={() => {
                setSelectedEntry(null);
                setViewMode(ViewMode.EDIT);
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus text-xs"></i>
              Write Entry
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8">
        {viewMode === ViewMode.LIST && (
          <div className="px-6">
            {filteredEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                {filteredEntries.map(entry => (
                  <DiaryCard 
                    key={entry.id} 
                    entry={entry} 
                    onClick={(e) => {
                      setSelectedEntry(e);
                      setViewMode(ViewMode.VIEW);
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-6">
                  <i className="fas fa-book-open"></i>
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">No entries yet</h2>
                <p className="text-slate-400 max-w-xs mx-auto mb-8">
                  Every journey starts with a single thought. Begin your mindful reflection today.
                </p>
                <button 
                  onClick={() => setViewMode(ViewMode.EDIT)}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-full font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm"
                >
                  Write my first entry
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === ViewMode.EDIT && (
          <Editor 
            entry={selectedEntry || undefined} 
            onSave={handleSaveEntry} 
            onCancel={() => {
              setViewMode(selectedEntry ? ViewMode.VIEW : ViewMode.LIST);
            }} 
          />
        )}

        {viewMode === ViewMode.VIEW && selectedEntry && (
          <EntryView 
            entry={selectedEntry} 
            isAnalyzing={isAnalyzing}
            onEdit={() => setViewMode(ViewMode.EDIT)}
            onDelete={handleDeleteEntry}
            onClose={() => setViewMode(ViewMode.LIST)}
          />
        )}
      </main>

      {/* Footer Decoration */}
      {viewMode === ViewMode.LIST && entries.length > 0 && (
        <footer className="py-20 text-center opacity-40">
          <p className="text-xs font-serif italic text-slate-500">
            "Diary writing is a way to have an appointment with yourself."
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;

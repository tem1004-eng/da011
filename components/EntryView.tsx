
import React from 'react';
import { DiaryEntry } from '../types';

interface EntryViewProps {
  entry: DiaryEntry;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  isAnalyzing: boolean;
}

const EntryView: React.FC<EntryViewProps> = ({ entry, onEdit, onDelete, onClose, isAnalyzing }) => {
  const formattedDate = new Date(entry.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>
        <div className="flex gap-4">
          <button 
            onClick={onEdit} 
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors"
          >
            <i className="fas fa-pen-nib"></i>
          </button>
          <button 
            onClick={() => { if(confirm('Delete this entry?')) onDelete(); }}
            className="w-10 h-10 rounded-full bg-white border border-red-100 text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <span className="text-indigo-500 font-semibold text-sm uppercase tracking-widest block mb-2">{formattedDate}</span>
            <h1 className="text-5xl font-serif font-bold text-slate-800 leading-tight">{entry.title}</h1>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-loose whitespace-pre-wrap font-light">
              {entry.content}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fas fa-sparkles text-indigo-400"></i>
              Gemini Insights
            </h3>
            
            {isAnalyzing ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-24 bg-slate-50 rounded"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ) : entry.aiAnalysis ? (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Sentiment</span>
                  <p className="text-lg font-semibold text-indigo-600">{entry.aiAnalysis.sentiment}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Summary</span>
                  <p className="text-sm text-slate-600 italic leading-relaxed">"{entry.aiAnalysis.summary}"</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Reflection</span>
                  <div className="bg-indigo-50 p-4 rounded-2xl">
                    <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                      {entry.aiAnalysis.reflection}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {entry.aiAnalysis.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] rounded-full font-bold uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No analysis available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryView;

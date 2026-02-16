
import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types';

interface EditorProps {
  entry?: DiaryEntry;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

const Editor: React.FC<EditorProps> = ({ entry, onSave, onCancel }) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back</span>
        </button>
        <button
          disabled={!isFormValid}
          onClick={() => onSave(title, content)}
          className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg ${
            isFormValid 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Save Entry
        </button>
      </div>

      <input
        type="text"
        placeholder="Entry Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-serif font-bold text-slate-800 placeholder:text-slate-300 border-none outline-none mb-6 bg-transparent"
      />

      <textarea
        placeholder="How was your day? Write freely..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow text-lg text-slate-600 placeholder:text-slate-300 border-none outline-none resize-none leading-relaxed bg-transparent min-h-[400px]"
      />
    </div>
  );
};

export default Editor;


import React from 'react';
import { DiaryEntry } from '../types';

interface DiaryCardProps {
  entry: DiaryEntry;
  onClick: (entry: DiaryEntry) => void;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ entry, onClick }) => {
  const formattedDate = new Date(entry.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <div 
      onClick={() => onClick(entry)}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{formattedDate}</span>
        {entry.aiAnalysis?.sentiment && (
          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] rounded-full font-bold">
            {entry.aiAnalysis.sentiment}
          </span>
        )}
      </div>
      <h3 className="text-xl font-serif font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
        {entry.title || "Untitled Entry"}
      </h3>
      <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">
        {entry.content}
      </p>
      {entry.aiAnalysis?.tags && entry.aiAnalysis.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.aiAnalysis.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] text-slate-400">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiaryCard;

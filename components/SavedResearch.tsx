import React from 'react';
import { SavedResearchItem } from '../types';
import { Clock, Tag, ChevronRight, Trash2 } from 'lucide-react';

interface SavedResearchProps {
  items: SavedResearchItem[];
  onSelect: (item: SavedResearchItem) => void;
  onDelete: (id: string) => void;
}

export const SavedResearch: React.FC<SavedResearchProps> = ({ items, onSelect, onDelete }) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#354F52]" />
            Saved Research History
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
                <div 
                    key={item.id} 
                    className="bg-[#1e293b] border border-gray-700 rounded-xl p-5 hover:border-[#354F52] transition-all cursor-pointer group relative"
                    onClick={() => onSelect(item)}
                >
                    <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-semibold text-[#354F52] bg-[#354F52]/20 px-2 py-0.5 rounded">
                            {item.category}
                        </span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                   
                    <h3 className="text-white font-medium line-clamp-2 mb-2 group-hover:text-[#6a969b] transition-colors">
                        {item.summary.substring(0, 80)}...
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-4">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {item.tags.slice(0, 2).join(', ')}
                        </span>
                    </div>

                    <ChevronRight className="absolute bottom-5 right-5 text-gray-600 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            ))}
        </div>
    </div>
  );
};

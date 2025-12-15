import React, { useState } from 'react';
import { Search, FileText, Zap } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-[#1e293b] rounded-2xl p-6 shadow-xl border border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-white">
          <FileText className="w-5 h-5 text-[#354F52]" />
          <h2 className="text-lg font-semibold">Start Your Research</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-40 bg-slate-900 text-white border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-[#354F52] focus:border-transparent outline-none transition-all resize-y placeholder-gray-500 text-sm sm:text-base"
            placeholder="Paste your article text, abstract, or research notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isAnalyzing}
          />
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => setText('')}
              disabled={isAnalyzing || !text}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isAnalyzing || !text.trim()}
              className={`
                flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]
                ${isAnalyzing || !text.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#354F52] hover:bg-[#2F4548] shadow-lg shadow-[#354F52]/30'}
              `}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze & Organize
                </>
              )}
            </button>
          </div>
        </form>
        
        <p className="mt-3 text-xs text-gray-500 text-center">
          AI will summarize, suggest references, and categorize your content automatically.
        </p>
      </div>
    </section>
  );
};

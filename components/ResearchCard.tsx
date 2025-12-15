import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp, Copy, Check, Quote, Tag, BookOpen, Lightbulb } from 'lucide-react';
import { ResearchResult } from '../types';

interface ResearchCardProps {
  result: ResearchResult;
  onSave?: (note: string) => void;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({ result, onSave }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'insights' | 'references' | 'notes'>('summary');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (onSave) {
        onSave(note);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mt-8 animate-fade-in-up">
      {/* Header / Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#354F52] text-white text-xs px-2 py-1 rounded font-medium">
              {result.category}
            </span>
            <span className="text-gray-500 text-xs">
              {new Date(result.timestamp).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-1 bg-gray-200/50 p-1 rounded-lg">
            {[
              { id: 'summary', icon: FileTextIcon, label: 'Summary' },
              { id: 'insights', icon: Lightbulb, label: 'Insights' },
              { id: 'references', icon: BookOpen, label: 'Refs' },
              { id: 'notes', icon: EditIcon, label: 'Notes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'bg-white text-[#354F52] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
                `}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 min-h-[300px]">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">Executive Summary</h3>
              <button onClick={handleCopy} className="text-gray-400 hover:text-[#354F52] transition-colors">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
              <ReactMarkdown>{result.summary}</ReactMarkdown>
            </div>
            
            {result.reasoningLog[0] && (
              <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
                  AI Chain of Thought
                </p>
                <p className="text-sm text-blue-800/80 italic">
                  "{result.reasoningLog[0]}"
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Key Takeaways</h3>
              <ul className="grid gap-3">
                {result.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#354F52]/10 text-[#354F52] rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 text-sm md:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.quotes.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Quote className="w-5 h-5 text-[#354F52]" />
                  Notable Quotes
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {result.quotes.map((quote, idx) => (
                    <blockquote key={idx} className="p-4 border-l-4 border-[#354F52] bg-gray-50 italic text-gray-600 text-sm">
                      "{quote}"
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'references' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Suggested References</h3>
              <div className="grid gap-3">
                {result.references.map((ref, idx) => (
                  <div key={idx} className="flex justify-between items-start p-3 bg-white border border-gray-200 rounded-lg hover:border-[#354F52]/50 transition-colors shadow-sm">
                    <div>
                      <h5 className="font-semibold text-gray-800">{ref.title}</h5>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                        {ref.type}
                      </span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      ref.relevance.toLowerCase().includes('high') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ref.relevance} Relevance
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Related Topics</h4>
              <div className="flex flex-wrap gap-2">
                {result.relatedTopics.map((topic, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm border border-slate-200">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
             {result.reasoningLog[1] && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-200">
                <strong>Reasoning:</strong> {result.reasoningLog[1]}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="h-full flex flex-col">
             <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Research Tags</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {result.tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-[#354F52]/10 text-[#354F52] rounded-full text-sm font-medium">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
             </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">Personal Notes</h3>
            <textarea
              className="w-full flex-grow min-h-[150px] p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#354F52] focus:border-transparent outline-none text-gray-700 resize-none"
              placeholder="Add your own thoughts, observations, or connections here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleSaveNote}
                className="flex items-center gap-2 px-4 py-2 bg-[#354F52] text-white rounded-lg hover:bg-[#2F4548] transition-colors"
              >
                {saved ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Notes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple icons for tabs
const FileTextIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
const EditIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

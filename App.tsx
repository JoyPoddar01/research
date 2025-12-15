import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputSection } from './components/InputSection';
import { ResearchCard } from './components/ResearchCard';
import { SavedResearch } from './components/SavedResearch';
import { performFullResearchParams } from './services/geminiService';
import { ResearchResult, SavedResearchItem } from './types';
import { AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [currentResult, setCurrentResult] = useState<ResearchResult | null>(null);
  const [savedItems, setSavedItems] = useState<SavedResearchItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ai_research_items');
    if (stored) {
      try {
        setSavedItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
  }, []);

  // Save to local storage whenever list changes
  useEffect(() => {
    localStorage.setItem('ai_research_items', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisStep('Initializing AI...');
    setCurrentResult(null);

    try {
      const result = await performFullResearchParams(text, (step) => setAnalysisStep(step));
      setCurrentResult(result);
      // Auto-save the new result to history (without user notes initially)
      setSavedItems(prev => [result, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleSaveNotes = (note: string) => {
    if (!currentResult) return;
    
    // Update current result in saved items with the new note
    const updatedItems = savedItems.map(item => 
      item.id === currentResult.id ? { ...item, userNotes: note } : item
    );
    setSavedItems(updatedItems);
  };

  const handleDeleteItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow flex flex-col items-center pt-8 pb-16 px-4">
        
        <div className="w-full max-w-4xl space-y-2 text-center mb-6">
           <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
             Deep Research. <span className="text-[#354F52] text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-[#354F52]">Simplified.</span>
           </h2>
           <p className="text-gray-400 max-w-2xl mx-auto">
             Enter any article or text below. The AI will summarize, analyze, and find references for you in seconds using advanced chain-of-thought reasoning.
           </p>
        </div>

        <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Status Indicator */}
        {isAnalyzing && (
          <div className="mt-8 flex items-center gap-3 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700 animate-pulse">
            <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
            <span className="text-teal-400 font-medium tracking-wide text-sm">{analysisStep}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3 text-red-200 max-w-2xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Area */}
        <div className="w-full max-w-4xl">
           {currentResult && (
             <ResearchCard result={currentResult} onSave={handleSaveNotes} />
           )}
        </div>

        {/* Saved History */}
        {!isAnalyzing && (
          <SavedResearch 
            items={savedItems} 
            onSelect={(item) => {
                setCurrentResult(item);
                window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            onDelete={handleDeleteItem} 
          />
        )}

      </main>

      <Footer />
    </div>
  );
}

export default App;

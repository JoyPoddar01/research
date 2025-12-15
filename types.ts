export interface ResearchResult {
  id: string;
  timestamp: number;
  originalText: string;
  summary: string;
  keyPoints: string[];
  quotes: string[];
  references: ReferenceItem[];
  relatedTopics: string[];
  tags: string[];
  category: string;
  reasoningLog: string[]; // To show the "hidden" chain of thought
}

export interface ReferenceItem {
  title: string;
  type: 'Academic' | 'Article' | 'Book' | 'Web';
  relevance: string;
}

export interface SavedResearchItem extends ResearchResult {
  userNotes?: string;
}

export type AnalysisStep = 'idle' | 'analyzing' | 'extracting' | 'referencing' | 'organizing' | 'complete' | 'error';

export interface AIResponseSchema {
  summary: string;
  keyPoints: string[];
  quotes: string[];
  thoughtProcess: string;
}

export interface AIReferencesSchema {
  references: ReferenceItem[];
  relatedTopics: string[];
  thoughtProcess: string;
}

export interface AICategorizationSchema {
  tags: string[];
  category: string;
  thoughtProcess: string;
}

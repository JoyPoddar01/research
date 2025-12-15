import { GoogleGenAI, Type } from "@google/genai";
import { ResearchResult, ReferenceItem } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to clean JSON string if markdown code blocks are present
const cleanJSON = (text: string): string => {
  const match = text.match(/```json([\s\S]*?)```/);
  return match ? match[1] : text;
};

/**
 * Step 1: Deep Analysis & Summarization
 */
const analyzeContent = async (text: string): Promise<{ summary: string; keyPoints: string[]; quotes: string[]; reasoning: string }> => {
  const prompt = `
    You are an expert research assistant. Perform a deep analysis of the provided text.
    
    Task:
    1. First, analyze the topic deeply (Chain of Thought).
    2. Extract the most important core ideas.
    3. Identify direct, impactful quotes.
    4. Synthesize a clear summary suitable for a university student.

    Input Text:
    "${text.substring(0, 15000)}" 

    Return a JSON object with this structure:
    {
      "thoughtProcess": "Brief explanation of your analysis steps",
      "summary": "The synthesized summary",
      "keyPoints": ["Point 1", "Point 2", ...],
      "quotes": ["Quote 1", "Quote 2", ...]
    }
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      systemInstruction: "You are a meticulous research analyst. Always think step-by-step.",
    }
  });

  const data = JSON.parse(cleanJSON(response.text || "{}"));
  return {
    summary: data.summary || "Could not generate summary.",
    keyPoints: data.keyPoints || [],
    quotes: data.quotes || [],
    reasoning: data.thoughtProcess || "Analysis complete.",
  };
};

/**
 * Step 2: Reference Suggestion (fed by summary)
 */
const suggestReferences = async (summary: string, originalText: string): Promise<{ references: ReferenceItem[]; relatedTopics: string[]; reasoning: string }> => {
  const prompt = `
    Based on the following research summary, suggest credible references and related topics for further study.
    
    Summary: "${summary}"
    Context Snippet: "${originalText.substring(0, 500)}..."

    Task:
    1. Identify key themes.
    2. Suggest 3-5 academic or high-quality web references (real or representative if specific dates unknown).
    3. Rank their relevance.
    4. Suggest keywords/topics for further search.

    Return JSON:
    {
      "thoughtProcess": "How you determined the relevance",
      "references": [
        { "title": "Title of work", "type": "Academic" | "Article", "relevance": "High/Medium" }
      ],
      "relatedTopics": ["Topic 1", "Topic 2"]
    }
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  const data = JSON.parse(cleanJSON(response.text || "{}"));
  return {
    references: data.references || [],
    relatedTopics: data.relatedTopics || [],
    reasoning: data.thoughtProcess || "References generated.",
  };
};

/**
 * Step 3: Categorization & Tagging
 */
const organizeResearch = async (summary: string, topics: string[]): Promise<{ tags: string[]; category: string; reasoning: string }> => {
  const prompt = `
    Organize this research entry based on the summary and topics.
    
    Summary: "${summary}"
    Topics: ${JSON.stringify(topics)}

    Task:
    1. Assign a broad research category (e.g., Science, History, Technology).
    2. Generate specific metadata tags.

    Return JSON:
    {
      "thoughtProcess": "Reasoning for classification",
      "category": "Broad Category Name",
      "tags": ["tag1", "tag2", "tag3"]
    }
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  const data = JSON.parse(cleanJSON(response.text || "{}"));
  return {
    tags: data.tags || [],
    category: data.category || "General",
    reasoning: data.thoughtProcess || "Categorization complete.",
  };
};

/**
 * Main Orchestrator Function
 */
export const performFullResearchParams = async (
  text: string, 
  onStepChange: (step: string) => void
): Promise<ResearchResult> => {
  
  // Step 1
  onStepChange("Analyzing content & extracting key insights...");
  const analysis = await analyzeContent(text);
  
  // Step 2
  onStepChange("Searching for references & related works...");
  const refs = await suggestReferences(analysis.summary, text);

  // Step 3
  onStepChange("Organizing & categorizing research notes...");
  const org = await organizeResearch(analysis.summary, refs.relatedTopics);

  onStepChange("Finalizing report...");

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    originalText: text,
    summary: analysis.summary,
    keyPoints: analysis.keyPoints,
    quotes: analysis.quotes,
    references: refs.references,
    relatedTopics: refs.relatedTopics,
    tags: org.tags,
    category: org.category,
    reasoningLog: [analysis.reasoning, refs.reasoning, org.reasoning]
  };
};

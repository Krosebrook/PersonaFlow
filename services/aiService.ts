import { GoogleGenAI, Type } from "@google/genai";
import { ServiceItem, ComplianceItem, TeamMember } from '../types';

// Safe initialization of AI client
const getAiClient = () => {
  let apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('GEMINI_API_KEY');
    if (localKey) {
      apiKey = localKey;
    }
  }
  // We initialize even with empty key to avoid immediate crash, but calls will fail if key is missing
  return new GoogleGenAI({ apiKey: apiKey || 'missing-key' });
};

// Using gemini-3-flash-preview for fast, structured generation tasks
const MODEL_NAME = 'gemini-3-flash-preview';

// Helper to strip Markdown code blocks if the model includes them
const cleanJson = (text: string | undefined): string => {
  if (!text) return '[]';
  let clean = text.trim();
  // Remove markdown code blocks
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
  clean = clean.replace(/\s*```$/, '');
  return clean;
};

export const generateServices = async (industry: string, companyName: string): Promise<ServiceItem[]> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate 3 key service offerings for a ${industry} company named ${companyName}. Include concrete outcomes. Return valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              outcomes: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    });
    
    const text = response.text;
    const cleanedText = cleanJson(text);
    const data = JSON.parse(cleanedText);
    
    return data.map((item: any, index: number) => ({
      ...item,
      id: `gen-svc-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("AI Generation Error (Services):", error);
    // Fallback data if API key is invalid or quota exceeded
    return [
      { id: 'err-1', name: 'Strategic Planning', description: 'Expert guidance tailored to your market.', outcomes: ['Increased clarity', 'Roadmap definition'] },
      { id: 'err-2', name: 'Operational Excellence', description: 'Streamlining core processes.', outcomes: ['20% cost reduction'] }
    ];
  }
};

export const generateCompliance = async (industry: string): Promise<ComplianceItem[]> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `List 3 key compliance frameworks required for the ${industry} industry. Return valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              framework: { type: Type.STRING },
              details: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["Certified", "Compliant", "In Progress"] }
            }
          }
        }
      }
    });

    const text = response.text;
    const cleanedText = cleanJson(text);
    return JSON.parse(cleanedText).map((item: any, idx: number) => ({ ...item, id: `gen-comp-${Date.now()}-${idx}` }));
  } catch (error) {
    console.error("AI Generation Error (Compliance):", error);
    return [
      { id: 'err-c1', framework: 'General Data Protection', status: 'Compliant', details: 'Standard privacy controls.' }
    ];
  }
};

export const generateTeamStructure = async (industry: string): Promise<TeamMember[]> => {
   try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Suggest a typical team structure for a ${industry} company. Return valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              description: { type: Type.STRING },
              count: { type: Type.INTEGER }
            }
          }
        }
      }
    });

    const text = response.text;
    const cleanedText = cleanJson(text);
    return JSON.parse(cleanedText).map((item: any, idx: number) => ({ ...item, id: `gen-team-${Date.now()}-${idx}` }));
  } catch (error) {
     console.error("AI Generation Error (Team):", error);
     return [
       { id: 'err-t1', role: 'Team Lead', description: 'Leads the core operations.', count: 1 }
     ];
  }
};

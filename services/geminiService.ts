
import { GoogleGenAI, Type } from "@google/genai";
import { ReportCardData, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const RUTHLESS_SYSTEM_PROMPT = `
You are 'The Ruthless Investor', a legendary venture capitalist known for killing weak ideas before they burn money.
Your tone is sharp, data-driven, and brutally honest. No sugar-coating.
You analyze ideas through the lens of: unit economics, defensible moats, market saturation, and execution risk.
When evaluating, use industry jargon (CAC/LTV, EBITDA, TAM/SAM/SOM, Zero-to-One).

For follow-up questions:
Maintain your persona. Be skeptical but logical. If a user tries to defend a bad idea, point out the logical fallacies.
`;

export async function evaluateStartupIdea(idea: string): Promise<{ 
  analysis: string; 
  reportCard: ReportCardData;
  sources: { uri: string; title: string }[];
}> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `RUTHLESSLY EVALUATE THIS IDEA: "${idea}". Use your search tool to find real-world competitors and market threats.`,
    config: {
      systemInstruction: RUTHLESS_SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.STRING,
            description: "A savage, detailed breakdown of why this might fail or the massive hurdles it faces."
          },
          reportCard: {
            type: Type.OBJECT,
            properties: {
              feasibility: { type: Type.NUMBER },
              innovationScore: { type: Type.NUMBER },
              replicationRate: { type: Type.STRING },
              estimatedCost: { type: Type.STRING },
              mvpBudget: { type: Type.STRING },
              pricingStrategy: { type: Type.STRING },
              competition: { type: Type.STRING },
              marketFitValue: { type: Type.NUMBER }
            },
            required: ["feasibility", "innovationScore", "replicationRate", "estimatedCost", "mvpBudget", "pricingStrategy", "competition", "marketFitValue"]
          }
        },
        required: ["analysis", "reportCard"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      uri: chunk.web.uri,
      title: chunk.web.title
    }));

  return { ...result, sources };
}

export async function chatWithArchitect(history: Message[], question: string): Promise<string> {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: RUTHLESS_SYSTEM_PROMPT,
    },
  });

  // Reconstruct chat history for the SDK
  // The SDK expects a specific message format, but we handle the call directly here
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })), { role: 'user', parts: [{ text: question }] }],
    config: {
        systemInstruction: RUTHLESS_SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }]
    }
  });

  return response.text || "I have nothing to say to that nonsense.";
}

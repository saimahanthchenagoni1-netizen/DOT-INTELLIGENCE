
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { Message, AppMode } from "../types";

const MODEL_MAP = {
  [AppMode.CHAT]: 'gemini-3-flash-preview',
  [AppMode.DEEP_THINK]: 'gemini-3-pro-preview',
  [AppMode.VOICE]: 'gemini-2.5-flash-native-audio-preview-09-2025'
};

/**
 * Creates a fresh instance of the Gemini AI client.
 * Safe access for environments where process might not be defined.
 */
export const getGeminiClient = () => {
  let apiKey = "";
  try {
    // Attempt to read from multiple potential locations for environment variables
    apiKey = (window as any).process?.env?.API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : "") || "";
  } catch (e) {
    console.error("Failed to safely read API Key:", e);
  }
  
  if (!apiKey) {
    console.warn("DOT Warning: API_KEY is missing. Ensure your Vercel/GitHub environment variables are set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const streamChatResponse = async (
  messages: Message[],
  mode: AppMode,
  useSearch: boolean,
  onChunk: (text: string, thought?: string) => void
) => {
  const ai = getGeminiClient();
  const modelName = MODEL_MAP[mode];

  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const config: any = {
    systemInstruction: `You are DOT, a specialized high-performance AI hub for students. 

    CORE MANDATE:
    You MUST provide PERFECTLY STRUCTURED responses using Markdown.
    
    1. HIERARCHY: Use ## for main sections and ### for sub-sections.
    2. CLARITY: Use bold text (**concept**) for key terms when they are first introduced.
    3. LISTS: Use bulleted or numbered lists for steps, features, or complex points.
    4. TABLES: Use tables for comparisons between historical figures, scientific concepts, or data.
    5. CITATIONS: If search is enabled, integrate findings seamlessly.
    
    TONE: Intellectual, supportive, and precise. You are an academic architect. Help the student visualize the logic of the subject.`,
  };

  if (mode === AppMode.DEEP_THINK) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  if (useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const streamResponse = await ai.models.generateContentStream({
      model: modelName,
      contents,
      config,
    });

    let fullText = "";
    let groundingLinks: any[] = [];

    for await (const chunk of streamResponse) {
      const c = chunk as GenerateContentResponse;
      const textPart = c.text || "";
      fullText += textPart;
      
      const chunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const newLinks = chunks.map((chunk: any) => ({
          title: chunk.web?.title || chunk.web?.uri || "Source",
          uri: chunk.web?.uri
        })).filter((link: any) => link.uri);
        
        newLinks.forEach((link: any) => {
          if (!groundingLinks.find(l => l.uri === link.uri)) {
            groundingLinks.push(link);
          }
        });
      }

      onChunk(textPart);
    }

    return { fullText, groundingLinks };
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    throw error;
  }
};

export const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

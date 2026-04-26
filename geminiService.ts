
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VoiceIntent, IndustryType } from "./types";
import { buildSystemPrompt, getIndustryConfig } from "./config/industryConfig";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Extract intent from text using Gemini AI, dynamically configured per industry.
 * 
 * This is the core brain of Lazzi — it understands what the user wants
 * regardless of how they phrase it, across any industry.
 */
export async function extractIntent(
  text: string,
  options: {
    industry: IndustryType;
    assistantName: string;
    panicWord?: string;
    customInstructions?: string;
  }
): Promise<VoiceIntent> {
  // Panic word check (instant, no AI needed)
  if (options.panicWord && text.toLowerCase().includes(options.panicWord.toLowerCase())) {
    return {
      action: 'panic_trigger',
      confidence: 1.0,
    };
  }

  if (!GEMINI_API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY. Add it to your environment variables.");
    return { action: 'unknown', confidence: 0 };
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const industryConfig = getIndustryConfig(options.industry);

  // Build dynamic system prompt based on industry
  const systemPrompt = buildSystemPrompt(
    options.industry,
    options.assistantName,
    options.customInstructions
  );

  // Build the list of valid action IDs for this industry
  const validActions = [
    ...industryConfig.intents.map(i => i.id),
    'affirmation',
    'negation',
    'customer_support',
    'unknown',
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: `${systemPrompt}

Current user input: "${text}"

Valid action values: ${validActions.join(', ')}

Respond with a JSON object containing:
- action: one of the valid action values
- confidence: float 0.0 to 1.0
- amount: number if mentioned (null otherwise)
- recipient: string if mentioned (null otherwise)
- extractedFields: object with any other extracted data
- supportAnswer: string if action is "customer_support" (the AI answer to the question)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            amount: { type: Type.NUMBER, nullable: true },
            recipient: { type: Type.STRING, nullable: true },
            confidence: { type: Type.NUMBER },
            extractedFields: {
              type: Type.OBJECT,
              nullable: true,
              properties: {},
            },
            supportAnswer: { type: Type.STRING, nullable: true },
          },
          required: ["action", "confidence"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as VoiceIntent;
  } catch (error) {
    console.error("Gemini Intent Extraction Error:", error);
    return { action: 'unknown', confidence: 0 };
  }
}

/**
 * Generate a conversational response for the assistant.
 * Used for customer support answers, confirmations, and follow-ups.
 */
export async function generateResponse(
  context: string,
  options: {
    industry: IndustryType;
    assistantName: string;
    customInstructions?: string;
  }
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "I'm having trouble connecting right now. Please try again.";
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: `You are "${options.assistantName}", a friendly voice assistant for ${options.industry}.
${options.customInstructions || ''}

Respond naturally and concisely (1-2 sentences max) to:
${context}`,
    });

    return response.text || "I'm not sure how to respond to that. Can you try again?";
  } catch (error) {
    console.error("Gemini Response Error:", error);
    return "I'm having trouble right now. Please try again shortly.";
  }
}

// ─────────────────────────────────────────────
// Text-to-Speech (Gemini TTS)
// ─────────────────────────────────────────────

let audioCtx: AudioContext | null = null;

export async function speakText(text: string): Promise<void> {
  if (!GEMINI_API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY. Add it to your environment variables.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly and professionally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      await playRawPcm(base64Audio);
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
}

async function playRawPcm(base64Data: string) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
}

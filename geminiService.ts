
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VoiceIntent } from "./types";

export async function extractIntent(text: string, panicWord: string): Promise<VoiceIntent> {
  if (text.toLowerCase().includes(panicWord.toLowerCase())) {
    return {
      action: 'panic_trigger',
      confidence: 1.0
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a banking intent classifier for LazziPay. 
      Current Text: "${text}"
      
      INTENT MAPPING RULES:
      - Balance: "how much do I have", "balance", "account status" -> action: "show_balance".
      - Transfer: "send", "transfer", "pay" -> action: "transfer_money".
      - Affirmative: "yes", "yeah", "do it", "please", "read it", "ok", "correct" -> action: "affirmation".
      - Negative: "no", "stop", "cancel", "don't" -> action: "negation".
      - Other: Small talk or unrelated phrases -> action: "unknown".

      Confidence should be a float between 0.0 and 1.0.
      Respond ONLY in valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            amount: { type: Type.NUMBER, nullable: true },
            recipient: { type: Type.STRING, nullable: true },
            confidence: { type: Type.NUMBER }
          },
          required: ["action", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as VoiceIntent;
  } catch (error) {
    console.error("Gemini Intent Extraction Error:", error);
    return { action: 'unknown', confidence: 0 };
  }
}

let audioCtx: AudioContext | null = null;

export async function speakText(text: string): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

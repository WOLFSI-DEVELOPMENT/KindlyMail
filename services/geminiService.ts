import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeneratedEmail, Message, ToneOption, PersonalContext, OutputFormat, ToneSettings, VoiceFingerprint } from "../types";

// Robust API Key retrieval
const getApiKey = () => {
    // 1. User Preference (LocalStorage)
    const local = localStorage.getItem('kindlymail_gemini_key');
    if (local) return local;

    // 2. Vite Environment Variables (Standard for Vercel/Vite deployments)
    try {
        // @ts-ignore
        if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
            // @ts-ignore
            return import.meta.env.VITE_API_KEY;
        }
    } catch (e) {}

    // 3. Process Environment (Node/Webpack/Preview environments)
    try {
        if (typeof process !== 'undefined' && process.env?.API_KEY) {
            return process.env.API_KEY;
        }
    } catch (e) {}

    return '';
};

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: getApiKey() });
};

// Helper for exponential backoff
const callWithRetry = async <T>(fn: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // Check for rate limit (429) or service unavailable (503) or specific error messages
      const isRateLimit = error.status === 429 || error.message?.includes('429') || error.message?.toLowerCase().includes('quota') || error.message?.toLowerCase().includes('rate limit');
      const isServerOverload = error.status === 503 || error.message?.includes('503') || error.message?.includes('Overloaded');
      
      if (isRateLimit || isServerOverload) {
        if (i === retries - 1) break; // Don't wait on the last attempt
        const delay = initialDelay * Math.pow(2, i); // Exponential backoff: 2s, 4s, 8s
        console.warn(`Gemini API Error (${error.status || 'limit'}), retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // Throw other errors immediately
    }
  }
  throw lastError;
};

export const generateEmailDraft = async (
  messages: Message[],
  currentDraft?: GeneratedEmail,
  personalContext?: PersonalContext,
  outputFormat: OutputFormat = 'html',
  toneSettingsOverride?: ToneSettings
): Promise<GeneratedEmail> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      subject: "API Key Required",
      body: `<!DOCTYPE html><html><body style="font-family: sans-serif; padding: 40px; text-align: center; color: #444;"><h1>Gemini API Key Missing</h1><p>Please add your Gemini API Key in the Settings to start generating emails.</p></body></html>`
    };
  }

  const ai = getAiClient();

  // Use the requested model from context or default to Gemini 3.0 Flash
  const model = personalContext?.model || "gemini-3-flash-preview";
  
  let systemInstruction = "";

  if (outputFormat === 'html') {
      systemInstruction = `You are the lead email designer for "KindlyMail AI".
      Your Goal: Create HTML emails that look like high-end design portfolios or luxury newsletters (e.g., Apple, Aesop, Linear).

      CRITICAL DESIGN RULES (Must Follow):
      1. **Typography**: Use a font stack of 'Helvetica Neue', Helvetica, Arial, sans-serif. Set base font-size to 16px. Line-height MUST be at least 1.6 for body text.
      2. **Whitespace**: Use generous padding. Main container padding should be 40px+. separate sections with 30-40px margins. White space is luxury.
      3. **Container**: Max-width 600px. Center aligned. Background color #ffffff (or #fafafa for the outer body).
      4. **Corners**: Use 'border-radius: 16px' for images and buttons. 'border-radius: 24px' for container cards if using a card style.
      5. **Compatibility**: Use INLINE CSS only. No <style> blocks in the body (put reset styles in head, but structure must work with inline styles).
      6. **Responsiveness**: Use percentage-based widths (e.g., width: 100%) for images to ensure mobile responsiveness.

      BRANDING ENFORCEMENT:
      - **Logo**: If the user provides a [MANDATORY BRAND LOGO URL], you MUST place it at the top center of the email. Max height: 40px.
      - **Colors**: If the user provides a [MANDATORY PRIMARY COLOR], you MUST use it for the background of the main call-to-action button and for bold links or key headers. Do not ignore this color.
      
      IMAGE & FIGMA HANDLING:
      - If the prompt includes an [Attached Content Image], you MUST include it using <img src="..." style="width: 100%; border-radius: 12px; display: block; margin-bottom: 24px;" />.
      - If the prompt includes a [Reference Figma Design], prioritize the structure and layout described in the prompt related to that design.
      `;
  } else {
      systemInstruction = `You are an expert copywriter for "KindlyMail AI".
      Your Goal: Create personal, plain-text style emails that feel human, authentic, and direct.
      
      FORMATTING RULES:
      1. **Style**: Mimic a standard Gmail/Outlook email. No heavy layout, no background colors, no cards.
      2. **HTML**: Use minimal HTML tags (<p>, <br>, <b>, <a>). Do not use divs with styles, tables, or images unless explicitly requested.
      3. **Typography**: Use standard sans-serif fonts. Font size 14px-16px.
      4. **Tone**: Focus purely on the copy. Make it engaging, clear, and action-oriented.
      `;
  }

  // Determine effective tone settings (Override > Personal Context > Default)
  const effectiveTone = toneSettingsOverride || personalContext?.toneSettings;

  // Append Personal Context Instructions
  if (personalContext || effectiveTone) {
    let overrideInstructions = "\n\nUSER OVERRIDE & PREFERENCES:";
    
    // 1. Voice Fingerprint (High Priority)
    if (personalContext?.voiceFingerprint) {
        const vf = personalContext.voiceFingerprint;
        overrideInstructions += `\n\n**MANDATORY VOICE FINGERPRINT**:`;
        overrideInstructions += `\nThis user has a specific writing style. YOU MUST MIMIC THIS STYLE:`;
        overrideInstructions += `\n- Keywords/Adjectives: ${vf.keywords.join(', ')}`;
        overrideInstructions += `\n- Sentence Structure: ${vf.sentenceLength} and ${vf.structure}`;
        overrideInstructions += `\n- Vocabulary Level: ${vf.vocabularyLevel}`;
        overrideInstructions += `\n- Sign-off Style: ${vf.signatureStyle}`;
        overrideInstructions += `\n- Overall Vibe: ${vf.summary}`;
    }

    // 2. Manual System Instructions
    if (personalContext?.systemInstructions) {
        overrideInstructions += `\n\nAdditional Instructions: ${personalContext.systemInstructions}`;
    }

    // 3. Tone Settings
    if (effectiveTone) {
        const { warmth, enthusiasm, formatting, emojis } = effectiveTone;
        overrideInstructions += "\n\nTONE MODIFIERS:";
        if (warmth !== 'Default') overrideInstructions += `\n- Warmth: ${warmth} (Adjust the friendliness and human touch accordingly)`;
        if (enthusiasm !== 'Default') overrideInstructions += `\n- Enthusiasm: ${enthusiasm} (Adjust exclamation marks and excitement accordingly)`;
        if (formatting !== 'Default') overrideInstructions += `\n- Formatting/Lists: ${formatting} (Adjust frequency of bullet points and headers)`;
        if (emojis !== 'Default') overrideInstructions += `\n- Emoji Usage: ${emojis} (Adjust frequency of emojis)`;
    }
    
    overrideInstructions += "\n(Prioritize the 'Voice Fingerprint' above all other tone settings).";
    systemInstruction += overrideInstructions;
  }

  // Construct the prompt
  let promptText = "";

  // Append File Context (Text content only for now, images referenced by name)
  if (personalContext?.files && personalContext.files.length > 0) {
    promptText += "\n\n--- UPLOADED KNOWLEDGE BASE ---\n";
    promptText += "The user has uploaded the following files for context. Use this information to inform the content and style of the email:\n";
    
    personalContext.files.forEach(file => {
        if (file.type.startsWith('image/')) {
            promptText += `\n[Image File: ${file.name}] (Use this as visual context/inspiration, if you need to embed it, ask user for a hosted URL as we cannot embed local blobs in email HTML directly)\n`;
        } else {
            // Truncate large files to avoid token limits (simple heuristic)
            const contentSnippet = file.content.length > 10000 ? file.content.substring(0, 10000) + "...(truncated)" : file.content;
            promptText += `\n[File: ${file.name}]\nContent:\n${contentSnippet}\n-------------------\n`;
        }
    });
    promptText += "\n--- END KNOWLEDGE BASE ---\n\n";
  }
  
  // Add messages history
  messages.forEach(msg => {
    promptText += `${msg.role === 'user' ? 'User' : 'Model'}: ${msg.content}\n`;
  });

  if (currentDraft) {
    promptText += `\nCurrent Draft Subject: ${currentDraft.subject}\n`;
    promptText += `Current Draft Body (HTML): ${currentDraft.body}\n`;
  }

  promptText += `\nTask: Generate the JSON object with 'subject' and 'body'.`;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model,
      contents: promptText,
      config: {
        systemInstruction,
        // DISABLED TOOLS: Conflict with responseMimeType: 'application/json' in API version.
        // tools: [],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: "The email subject line" },
            body: { type: Type.STRING, description: "The full HTML email template" }
          },
          required: ["subject", "body"]
        }
      }
    }));

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeneratedEmail;
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    
    let errorMessage = "We couldn't generate your design at this moment. Please try again.";
    let errorDetails = error.message || "Unknown error";

    if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota') || error.message?.toLowerCase().includes('rate limit')) {
        errorMessage = "You've hit the rate limit for the AI model. Please wait a moment and try again.";
        errorDetails = "Rate Limit Exceeded (429). The system is retrying automatically, but traffic is high.";
    }
    
    if (error.status === 400 || error.message?.includes('400')) {
        errorMessage = "There was a configuration error with the AI request.";
        errorDetails = "400 Bad Request. Likely tool/JSON conflict.";
    }

    return {
      subject: "Generation Error",
      body: `<!DOCTYPE html><html><body style="font-family: sans-serif; padding: 40px; text-align: center; color: #444;">
        <div style="background: #fee2e2; color: #991b1b; padding: 30px; border-radius: 16px; display: inline-block; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="margin: 0 0 10px 0;">Generation Paused</h2>
            <p style="margin: 0 0 20px 0; line-height: 1.5;">${errorMessage}</p>
            <div style="font-size: 11px; opacity: 0.7; background: rgba(255,255,255,0.5); padding: 8px; border-radius: 8px; font-family: monospace;">
                ${errorDetails}
            </div>
        </div>
      </body></html>`
    };
  }
};

export const buildMetaPrompt = async (userIntent: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "API Key missing. Please check settings.";
  const ai = getAiClient();

  const prompt = `You are a professional prompt engineer for an AI email generator.
  
  User Intent: "${userIntent}"
  
  Your task is to convert this simple intent into a concise, professional prompt that I can send to an email generation AI.
  
  Constraints:
  1. The output must be clean, plain text.
  2. Length: Strictly 2-3 sentences.
  3. FORBIDDEN: Do not use asterisks (*), hashes (#), bullet points, or markdown formatting.
  4. Focus on describing the email's goal, audience, and desired tone naturally.

  Output ONLY the refined prompt text.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    }));
    return response.text || "Could not generate prompt.";
  } catch (error) {
    console.error(error);
    return "Error generating prompt. Please try again.";
  }
};

export interface BrandAssets {
    colors: string[];
    fonts: string[];
}

export const analyzeBrandAssets = async (url: string): Promise<BrandAssets> => {
    if (!url) return { colors: [], fonts: [] };
    const apiKey = getApiKey();
    if (!apiKey) return { colors: ['#000000'], fonts: ['Helvetica'] }; // Fallback
    const ai = getAiClient();

    try {
        const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analyze the visual identity of this website: ${url}. 
            Extract the primary brand color (hex code), a secondary accent color (hex code), and the primary font family used (or a generic fallback that matches the vibe).
            
            Return ONLY a raw JSON object (no markdown code blocks) with this structure:
            {
                "colors": ["#primary", "#secondary"],
                "fonts": ["Font Name"]
            }`,
            config: {
                tools: [{ googleSearch: {} }],
                // Removed responseMimeType: 'application/json' to allow tool use.
                // We will parse the text manually.
            }
        }));
        
        const text = response.text;
        if (!text) return { colors: ['#000000'], fonts: ['Helvetica'] };
        
        // Manual JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        
        return JSON.parse(jsonStr) as BrandAssets;

    } catch (e) {
        console.error("Brand analysis failed", e);
        return { colors: ['#000000'], fonts: ['Sans-serif'] };
    }
};

export const analyzeBrandVoice = async (emails: string[]): Promise<VoiceFingerprint> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key missing");
    const ai = getAiClient();

    const combinedText = emails.join("\n\n--- NEXT EMAIL ---\n\n");

    const prompt = `Analyze the following email samples written by a specific person. 
    Construct a precise "Voice Fingerprint" that describes their writing style so an AI can mimic it perfectly.
    
    SAMPLES:
    ${combinedText}
    
    Analyze:
    1. Keywords/Adjectives (e.g., 'Direct', 'Witty', 'Empathetic')
    2. Sentence Length (e.g., 'Short and punchy', 'Long and descriptive')
    3. Structure (e.g., 'Uses bullet points often', 'Dense paragraphs')
    4. Vocabulary Level (e.g., 'Simple/Accessible', 'Technical/Jargon-heavy')
    5. Signature Style (e.g., 'Cheers', 'Best regards', 'No sign-off')
    6. Summary (A 1-sentence vibe check)
    
    Return JSON only.`;

    try {
        const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        sentenceLength: { type: Type.STRING },
                        structure: { type: Type.STRING },
                        vocabularyLevel: { type: Type.STRING },
                        signatureStyle: { type: Type.STRING },
                        summary: { type: Type.STRING }
                    },
                    required: ["keywords", "sentenceLength", "structure", "vocabularyLevel", "signatureStyle", "summary"]
                }
            }
        }));

        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text) as VoiceFingerprint;
    } catch (e) {
        console.error("Voice analysis failed", e);
        throw e;
    }
};
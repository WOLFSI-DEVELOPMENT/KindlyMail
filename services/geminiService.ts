import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedEmail, Message, ToneOption, PersonalContext, OutputFormat, ToneSettings } from "../types";

const getAiClient = () => {
  const apiKey = localStorage.getItem('kindlymail_gemini_key') || process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

const getApiKey = () => {
    return localStorage.getItem('kindlymail_gemini_key') || process.env.API_KEY || '';
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

  // Using the requested Gemini 3.0 Flash model
  const model = "gemini-3-flash-preview";
  
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
      - **Context Website**: If provided, use the 'googleSearch' tool to visit it and learn the tone of voice and supplementary design cues (but the manually provided logo/color takes precedence).
      
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
    
    if (personalContext?.systemInstructions) {
        overrideInstructions += `\n${personalContext.systemInstructions}`;
    }

    if (effectiveTone) {
        const { warmth, enthusiasm, formatting, emojis } = effectiveTone;
        overrideInstructions += "\n\nTONE & STYLE SETTINGS:";
        if (warmth !== 'Default') overrideInstructions += `\n- Warmth: ${warmth} (Adjust the friendliness and human touch accordingly)`;
        if (enthusiasm !== 'Default') overrideInstructions += `\n- Enthusiasm: ${enthusiasm} (Adjust exclamation marks and excitement accordingly)`;
        if (formatting !== 'Default') overrideInstructions += `\n- Formatting/Lists: ${formatting} (Adjust frequency of bullet points and headers)`;
        if (emojis !== 'Default') overrideInstructions += `\n- Emoji Usage: ${emojis} (Adjust frequency of emojis)`;
    }
    
    overrideInstructions += "\n(Prioritize these user preferences over default design rules if they conflict).";
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
    const response = await ai.models.generateContent({
      model,
      contents: promptText,
      config: {
        systemInstruction,
        // Enable Google Search for website analysis
        tools: [{ googleSearch: {} }],
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
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeneratedEmail;
  } catch (error) {
    console.error("Gemini generation error:", error);
    return {
      subject: "Design Generation Error",
      body: `<!DOCTYPE html><html><body style="font-family: sans-serif; padding: 40px; text-align: center; color: #444;"><h1>Something went wrong</h1><p>We couldn't generate your design at this moment. Please try again. details: ${(error as any).message}</p></body></html>`
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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Could not generate prompt.";
  } catch (error) {
    console.error(error);
    return "Error generating prompt.";
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
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analyze the visual identity of this website: ${url}. 
            Extract the primary brand color (hex code), a secondary accent color (hex code), and the primary font family used (or a generic fallback that matches the vibe).
            
            Return JSON only:
            {
                "colors": ["#primary", "#secondary"],
                "fonts": ["Font Name"]
            }`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                   type: Type.OBJECT,
                   properties: {
                       colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                       fonts: { type: Type.ARRAY, items: { type: Type.STRING } }
                   }
                }
            }
        });
        
        const text = response.text;
        if (!text) return { colors: ['#000000'], fonts: ['Helvetica'] };
        return JSON.parse(text) as BrandAssets;

    } catch (e) {
        console.error("Brand analysis failed", e);
        return { colors: ['#000000'], fonts: ['Sans-serif'] };
    }
};

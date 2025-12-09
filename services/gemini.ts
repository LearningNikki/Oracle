import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData, SocialPlatform, UserProfile, PostVibe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePostPotential = async (
  imageBase64: string | null,
  caption: string,
  currentHashtags: string,
  targetPlatform: SocialPlatform,
  vibe: PostVibe,
  userProfile?: UserProfile | null
): Promise<AnalysisData> => {
  const model = "gemini-2.5-flash";

  let profileContext = "";
  if (userProfile) {
    profileContext = `
      The user is posting as "${userProfile.displayName}" (@${userProfile.username}).
      Profile Vibe: "${userProfile.bioVibe}".
      Ensure the analysis and suggestions align strictly with this persona.
    `;
  }

  const prompt = `
    You are 'Oracle', a highly advanced social media viral engine.
    Target Platform: **${targetPlatform}**.
    Selected Vibe: **${vibe}**.
    
    ${profileContext}
    
    INSTRUCTIONS:
    1. **Language & Vibe**: Analyze the input (Caption: "${caption}").
       - If the user uses Pidgin, Slang, or dialect, REPLY IN KIND.
       - The "Improved Caption" MUST match the selected vibe: ${vibe}.
       - If "Savage", be roasting/witty. If "Professional", be clean/sharp. If "Spicy", be bold.
       - If Platform is **WhatsApp**, treat this as a "Status Update" or "Broadcast". Focus on personal engagement and direct response.
    
    2. **Content Analysis**:
       - Determine "Virality Score" (0-100).
       - Provide "Reasoning".
       - Suggest "Hashtags".
       - Create an "Improved Caption".
       - **Predict "Best Time to Post"**: Give a specific time and day (e.g., "Tuesday at 6:45 PM") based on when this type of content usually peaks on ${targetPlatform}.

    Input Data:
    - Caption: "${caption}"
    - Hashtags: "${currentHashtags}"
    - Image provided: ${imageBase64 ? "Yes" : "No"}
  `;

  const parts: any[] = [{ text: prompt }];

  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1];
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            viralityScore: { type: Type.NUMBER, description: "Score 0-100." },
            reasoning: { type: Type.STRING, description: "Analysis of the post." },
            suggestedPlatforms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of suitable platforms."
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Optimized hashtags."
            },
            improvedCaption: { type: Type.STRING, description: "Better caption version." },
            bestTimeToPost: { type: Type.STRING, description: "Predicted optimal posting time." }
          },
          required: ["viralityScore", "reasoning", "suggestedPlatforms", "hashtags", "bestTimeToPost"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);

    const platforms: SocialPlatform[] = result.suggestedPlatforms
      .map((p: string) => {
        const key = Object.keys(SocialPlatform).find(k => k.toLowerCase() === p.toLowerCase().replace(/\s/g, ''));
        return key ? SocialPlatform[key as keyof typeof SocialPlatform] : null;
      })
      .filter((p: SocialPlatform | null) => p !== null) as SocialPlatform[];

    return {
      viralityScore: result.viralityScore,
      reasoning: result.reasoning,
      suggestedPlatforms: platforms.length > 0 ? platforms : [SocialPlatform.Instagram], 
      hashtags: result.hashtags,
      improvedCaption: result.improvedCaption,
      bestTimeToPost: result.bestTimeToPost
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
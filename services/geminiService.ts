import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// Switching to Gemini 2.5 Flash Image which is available for standard keys
const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  referenceImageBase64?: string
): Promise<string> => {
  try {
    // IMPORTANT: Create the instance immediately before the call to pick up the latest injected process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [];
    
    // If a reference image is provided, add it first
    if (referenceImageBase64) {
      // Extract the base64 data and mime type from the data URL
      // Format expected: "data:image/png;base64,..."
      const matches = referenceImageBase64.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          }
        });
      }
    }

    // Add the text prompt
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // imageSize is not supported by gemini-2.5-flash-image
        },
      },
    });

    // Check candidate parts for the image
    const responseParts = response.candidates?.[0]?.content?.parts;
    if (!responseParts) {
      throw new Error("No content generated.");
    }

    // Iterate to find the image part
    for (const part of responseParts) {
      if (part.inlineData && part.inlineData.data) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }

    // Fallback if no image found but maybe text was returned explaining why (e.g. safety)
    const textPart = responseParts.find(p => p.text);
    if (textPart && textPart.text) {
      throw new Error(`Model returned text instead of image: ${textPart.text}`);
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    
    let detailedMessage = "Failed to generate image.";
    
    if (error instanceof Error) {
      detailedMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      // Try to get message or stringify
      detailedMessage = (error as any).message || JSON.stringify(error);
    } else {
      detailedMessage = String(error);
    }
    
    // Propagate the detailed error
    throw new Error(detailedMessage);
  }
};
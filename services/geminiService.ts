
import { GoogleGenAI, Modality } from "@google/genai";

// Ensure the API key is available, but do not hardcode it.
// This relies on the environment being set up correctly.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface EditResult {
  imageUrl: string | null;
  text: string | null;
}

export const editImageWithNanoBanana = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<EditResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from the API.");
    }

    const result: EditResult = {
      imageUrl: null,
      text: null,
    };

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Bytes = part.inlineData.data;
        const imageMimeType = part.inlineData.mimeType;
        result.imageUrl = `data:${imageMimeType};base64,${base64Bytes}`;
      } else if (part.text) {
        result.text = part.text;
      }
    }

    if (!result.imageUrl) {
        throw new Error("API did not return an image. It might have refused the request.");
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};


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
      let errorMessage = "The model did not return any content. This can happen due to safety filters or an unclear request. Please try a different image or prompt.";
      if (response.promptFeedback?.blockReason) {
        errorMessage = `Your request was blocked. Reason: ${response.promptFeedback.blockReason}. This often happens due to safety policies. Please try a different image or a more general prompt.`;
      }
      throw new Error(errorMessage);
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
        throw new Error("The AI returned a response, but it did not contain an image. Please try rephrasing your prompt.");
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

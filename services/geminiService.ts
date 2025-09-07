import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateImage = async (prompt: string): Promise<{ base64: string, mimeType: string }> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0].image;
      return { base64: image.imageBytes, mimeType: 'image/png' };
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
};


export const editImage = async (
  baseImage: { base64: string, mimeType: string },
  prompt: string,
  blendImage?: { base64: string, mimeType: string }
): Promise<{ base64: string, mimeType: string }> => {
  try {
    const parts: any[] = [
      { inlineData: { data: baseImage.base64, mimeType: baseImage.mimeType } },
      { text: prompt },
    ];

    if (blendImage) {
      parts.push({ inlineData: { data: blendImage.base64, mimeType: blendImage.mimeType } });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return { base64: part.inlineData.data, mimeType: part.inlineData.mimeType };
      }
    }
    
    throw new Error("No edited image was returned.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image.");
  }
};

export const generateNarration = async (concept: string, prompt: string): Promise<string> => {
    try {
      const generationPrompt = `You are a storyteller for young children (ages 3-7).
      Based on the overall story concept and a specific scene, write a short and simple narration for a single page of a storybook.
      The narration should be 1-2 sentences long, easy for a child to understand, and magical in tone.

      Story Concept: "${concept}"
      Scene Description (Visual Prompt): "${prompt}"

      Write only the narration text.`;
  
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: generationPrompt,
      });
  
      let text = response.text.trim();
      // Clean up potential markdown or quotes from the response
      text = text.replace(/^"|"$/g, '');
      text = text.replace(/^\*\*Narration:\*\*\s*/i, '');
      return text;
    } catch (error) {
      console.error("Error generating narration:", error);
      throw new Error("Failed to generate narration.");
    }
  };

  export const generateNextPrompt = async (concept: string, previousPrompt: string, previousNarration: string): Promise<string> => {
    try {
      const generationPrompt = `You are a creative assistant writing a children's storybook.
      Your task is to suggest the visual prompt for the *next* scene in the story.
      Based on the overall story concept and the details of the previous page, write a short, one-sentence visual prompt for the next page.
      This prompt is for an illustrator, so describe the scene clearly and creatively.
      
      Story Concept: "${concept}"
      
      Previous Page Visual Prompt: "${previousPrompt}"
      Previous Page Narration: "${previousNarration}"
      
      Now, write only the new visual prompt text that should logically follow.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: generationPrompt,
      });

      let text = response.text.trim();
      text = text.replace(/^"|"$/g, '');
      return text;

    } catch(error) {
        console.error("Error generating next prompt:", error);
        throw new Error("Failed to generate prompt suggestion.");
    }
  };
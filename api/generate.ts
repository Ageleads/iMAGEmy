import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define the structure for image data received from the client
interface ImagePayload {
  base64Data: string;
  mimeType: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { prompt, images } = req.body as { prompt: string; images: ImagePayload[] };
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("API_KEY environment variable is not set on the server.");
      return res.status(500).json({ error: "Configuration error: API key is missing on the server." });
    }

    const ai = new GoogleGenAI({ apiKey });

    const imageParts: Part[] = images.map(img => ({
      inlineData: {
        data: img.base64Data,
        mimeType: img.mimeType,
      },
    }));

    const textPart: Part = { text: prompt };
    const parts: Part[] = [...imageParts, textPart];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        return res.status(200).json({ imageUrl });
      }
    }
    
    return res.status(500).json({ error: "No image was returned by the API." });

  } catch (error: any) {
    console.error("Error in Vercel function:", error);
    return res.status(500).json({ error: `Failed to generate image on the server: ${error.message}` });
  }
}

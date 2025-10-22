// This helper converts a File object to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // We only need the base64 part, not the "data:image/jpeg;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateImage = async (prompt: string, images: File[]): Promise<string> => {
  // 1. Convert File objects into a format our API route expects
  const imagePayloads = await Promise.all(
    images.map(async (file) => {
      const base64Data = await fileToBase64(file);
      return {
        base64Data,
        mimeType: file.type,
      };
    })
  );

  // 2. Send the data to our own Vercel serverless function at /api/generate
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      images: imagePayloads,
    }),
  });

  if (!response.ok) {
    // If the server responded with an error, try to parse the error message
    const errorData = await response.json();
    throw new Error(errorData.error || "Falha na comunicação com o servidor.");
  }

  const data = await response.json();
  return data.imageUrl; // The serverless function will return { imageUrl: '...' }
};


import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptControls from './components/PromptControls';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import Footer from './components/Footer';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [numberOfImages, setNumberOfImages] = useState<1 | 2>(1);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (isLoading) return;
    
    if (!prompt.trim() && images.length === 0) {
      setError("Por favor, adicione um prompt ou uma imagem.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage(prompt, images);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao gerar a imagem.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, images, isLoading]);
  
  const handleImagesChange = (files: File[]) => {
    setImages(files);
    if(files.length > 0 || prompt.trim().length > 0) {
        setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#202124] p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="container mx-auto max-w-7xl flex-grow">
        <Header />
        <main className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col space-y-8">
            <ImageUploader 
              onImagesChange={handleImagesChange}
              numberOfImages={numberOfImages}
              setNumberOfImages={(num) => {
                setNumberOfImages(num);
                // Trim images if reducing number
                if (num === 1 && images.length > 1) {
                    setImages(images.slice(0, 1));
                }
              }}
            />
            <PromptControls 
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              isReady={prompt.trim().length > 0 || images.length > 0}
            />
          </div>
          <div className="flex items-center justify-center">
            <GeneratedImageDisplay 
              isLoading={isLoading}
              generatedImage={generatedImage}
              error={error}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;

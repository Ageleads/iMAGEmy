import React from 'react';
import { ImageIcon } from './icons/ImageIcon';

interface GeneratedImageDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
}

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center text-gray-400">
      <svg className="animate-spin h-12 w-12 text-[#b18cff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-lg">Gerando sua imagem...</p>
      <p className="text-sm text-gray-500">Isso pode levar alguns segundos.</p>
    </div>
);
  
const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center text-center text-red-400 p-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-lg font-semibold">Ocorreu um erro</p>
      <p className="text-sm">{message}</p>
    </div>
);
  
const Placeholder = () => (
    <div className="flex flex-col items-center justify-center text-gray-500">
      <ImageIcon className="w-24 h-24 mb-4" />
      <p className="text-lg text-center">Sua imagem gerada aparecerá aqui.</p>
    </div>
);

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ isLoading, generatedImage, error }) => {
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    const fileType = generatedImage.substring(generatedImage.indexOf('/') + 1, generatedImage.indexOf(';'));
    link.download = `imagem-gerada-${Date.now()}.${fileType || 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (generatedImage) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-start gap-4 p-4">
          <div className="flex-1 w-full flex items-center justify-center min-h-0">
            <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-3 mt-2">
            <button
                onClick={handleDownload}
                className="bg-[#ddd] text-black font-semibold py-2 px-5 rounded-lg hover:bg-white transition-colors duration-300"
              >
                Baixar Imagem
              </button>
            <p className="text-center text-xs text-[#bbb] px-2">
              ✨Este app faz parte do Clube dos Prompts. Se puder apoiar e ajudar a manter novas ideias no ar, contribua com qualquer valor via Pix: clubedosprompts@gmail.com
            </p>
          </div>
        </div>
      );
    }
    return <Placeholder />;
  };

  return (
    <div className="w-full h-full bg-[#303134] rounded-2xl flex flex-col items-center justify-center aspect-square shadow-lg transition-all duration-300 min-h-[300px] sm:min-h-[400px] lg:min-h-full overflow-hidden">
      {renderContent()}
    </div>
  );
};
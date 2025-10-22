
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptControlsProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isReady: boolean;
}

const PromptControls: React.FC<PromptControlsProps> = ({ prompt, onPromptChange, onGenerate, isLoading, isReady }) => {
  return (
    <div className="bg-[#303134] p-6 rounded-2xl shadow-lg flex flex-col">
      <label htmlFor="prompt" className="text-xl font-bold text-[#e8eaed] mb-4">Seu Prompt</label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Ex: um astronauta surfando em uma onda cósmica, com o rosto da pessoa na imagem..."
        className="w-full flex-grow bg-[#202124] text-[#e8eaed] border border-[#5f6368] rounded-lg p-3 focus:ring-2 focus:ring-[#8ab4f8] focus:border-[#8ab4f8] transition duration-200 min-h-[120px] resize-none disabled:opacity-70"
        rows={4}
        disabled={isLoading}
      />
      <div className="mt-6">
        <button
          onClick={onGenerate}
          disabled={!isReady || isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#b18cff] text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-[#c9a6ff] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Gerando...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-6 h-6" />
              Gerar Imagem
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptControls;

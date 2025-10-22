import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  numberOfImages: 1 | 2;
  setNumberOfImages: (num: 1 | 2) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, numberOfImages, setNumberOfImages }) => {
  const [previews, setPreviews] = useState<(string | null)[]>([null, null]);
  const [files, setFiles] = useState<(File | null)[]>([null, null]);

  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const updateParent = useCallback(() => {
    const validFiles = files.slice(0, numberOfImages).filter(f => f !== null) as File[];
    onImagesChange(validFiles);
  }, [files, numberOfImages, onImagesChange]);

  useEffect(() => {
    updateParent();
  }, [files, numberOfImages, updateParent]);
  
  useEffect(() => {
    // Clean up previews when number of images changes
    if(numberOfImages === 1) {
        setPreviews(p => [p[0], null]);
        setFiles(f => [f[0], null]);
    }
  }, [numberOfImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);

      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };
  
  const removeImage = (index: number) => {
    const newFiles = [...files];
    newFiles[index] = null;
    setFiles(newFiles);
    
    const newPreviews = [...previews];
    if (previews[index]) {
      URL.revokeObjectURL(previews[index] as string);
    }
    newPreviews[index] = null;
    setPreviews(newPreviews);
  }

  const renderUploadBox = (index: number) => (
    <div key={index} className="w-full">
      <label className="cursor-pointer">
        <div className="relative w-full aspect-square border-2 border-dashed border-[#5f6368] rounded-xl hover:border-[#8ab4f8] transition-colors duration-300 flex flex-col items-center justify-center bg-[#202124] p-4">
          {previews[index] ? (
            <>
              <img src={previews[index] as string} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg"/>
              <button 
                onClick={(e) => { e.preventDefault(); removeImage(index); }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-transform duration-200 hover:scale-110"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <UploadIcon className="w-10 h-10 text-gray-500 mb-2" />
              <span className="text-gray-400 text-center text-sm">Clique para anexar a foto da Pessoa {index + 1}</span>
            </>
          )}
        </div>
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/webp" 
          className="hidden" 
          ref={fileInputRefs[index]}
          onChange={(e) => handleFileChange(e, index)}
        />
      </label>
    </div>
  );

  return (
    <div className="bg-[#303134] p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#e8eaed]">Suas Fotos</h2>
        <div className="flex items-center space-x-2 bg-[#202124] p-1 rounded-lg">
          {[1, 2].map(num => (
            <button
              key={num}
              onClick={() => setNumberOfImages(num as 1 | 2)}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                numberOfImages === num ? 'bg-[#3c4043] text-white' : 'text-gray-300 hover:bg-[#5f6368]/50'
              }`}
            >
              {num} Pessoa{num > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>
      <div className={`grid gap-4 ${numberOfImages === 1 ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-2'}`}>
        {Array.from({ length: numberOfImages }).map((_, i) => renderUploadBox(i))}
      </div>
    </div>
  );
};

export default ImageUploader;
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#e8eaed] flex items-center justify-center gap-3">
        <LogoIcon className="h-10 sm:h-12 w-10 sm:w-12 text-[#b18cff]" />
        <span>
          <span className="font-nunito font-light">iMAGE</span><span className="font-nunito font-light text-[#b18cff]">my</span>
        </span>
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
        Transforme suas fotos e ideias temas incríveis. Anexe sua(s) imagem(s), descreva a cena dos seus sonhos e deixe a iMageMy criar algo único para você.
      </p>
    </header>
  );
};

export default Header;
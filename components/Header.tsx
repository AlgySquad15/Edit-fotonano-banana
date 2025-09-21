
import React from 'react';
import { MagicWandIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-brand-slate-800">
      <div className="container mx-auto flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-cyan/20 text-brand-cyan rounded-lg flex items-center justify-center">
          <MagicWandIcon className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tighter">AI Photo Editor</h1>
          <p className="text-brand-slate-400">Edit images with text prompts using Gemini Nano Banana</p>
        </div>
      </div>
    </header>
  );
};

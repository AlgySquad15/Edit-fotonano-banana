
import React from 'react';
import { EditResult } from '../services/geminiService';
import { ImageIcon, SparklesIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  result: EditResult | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, result }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-brand-slate-400">
          <SparklesIcon className="w-16 h-16 animate-pulse text-brand-cyan" />
          <p className="mt-4 text-lg font-medium">Brewing some AI magic...</p>
          <p className="text-sm">This can take a moment.</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="font-bold text-red-400">An Error Occurred</p>
          <p className="text-sm text-red-300 text-center mt-2">{error}</p>
        </div>
      );
    }
    
    if (result?.imageUrl) {
      return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex-grow aspect-video relative bg-brand-slate-950 rounded-lg overflow-hidden">
                 <img src={result.imageUrl} alt="Edited result" className="object-contain w-full h-full" />
            </div>
            {result.text && (
                 <div className="p-4 bg-brand-slate-800/50 rounded-lg border border-brand-slate-700">
                     <p className="text-brand-slate-300 italic">{result.text}</p>
                 </div>
            )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-brand-slate-500 border-2 border-dashed border-brand-slate-800 rounded-lg">
        <ImageIcon className="w-16 h-16" />
        <p className="mt-4 text-lg font-medium">Your edited photo will appear here</p>
      </div>
    );
  };

  return <div className="w-full aspect-video flex flex-col">{renderContent()}</div>;
};

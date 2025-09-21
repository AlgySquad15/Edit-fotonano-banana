
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isDisabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, isDisabled }) => {
  return (
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="e.g., 'Add a cute pirate hat to the cat' or 'Change the background to a sunny beach'"
      disabled={isDisabled}
      rows={4}
      className="w-full bg-brand-slate-800 text-brand-slate-200 border border-brand-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-brand-cyan focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
};

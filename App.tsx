
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ResultDisplay } from './components/ResultDisplay';
import { EditResult, editImageWithNanoBanana } from './services/geminiService';
import { fileToBase64, dataUrlToFile } from './utils/fileUtils';

function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editResult, setEditResult] = useState<EditResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setEditResult(null); // Clear previous results
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditResult(null);

    try {
      const base64Data = await fileToBase64(originalImage);
      const mimeType = originalImage.type;
      
      const result = await editImageWithNanoBanana(base64Data, mimeType, prompt);
      setEditResult(result);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);
  
  const handleContinueEditing = useCallback(async (result: EditResult) => {
    if (!result.imageUrl) return;
    
    // Create a unique filename for the new image file
    const newFileName = `edited_image_${Date.now()}.png`; 
    const newImageFile = await dataUrlToFile(result.imageUrl, newFileName);
    
    // Set the new image as the uploader's source
    handleImageUpload(newImageFile);
    
    // Clear the prompt and the result display for the next edit
    setPrompt('');
    setEditResult(null);
    setError(null);
    
    // Optional: scroll to the top or focus the prompt input for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, []);


  return (
    <div className="min-h-screen bg-brand-slate-950 text-brand-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6 p-6 bg-brand-slate-900 rounded-2xl border border-brand-slate-800 shadow-2xl shadow-brand-slate-950/50">
            <h2 className="text-2xl font-bold text-brand-slate-100 tracking-tight">1. Upload your Photo</h2>
            <ImageUploader onImageUpload={handleImageUpload} imageUrl={originalImageUrl} />
            
            <h2 className="text-2xl font-bold text-brand-slate-100 tracking-tight mt-4">2. Describe your Edit</h2>
            <PromptInput 
              prompt={prompt} 
              setPrompt={setPrompt} 
              isDisabled={!originalImage || isLoading}
            />
            
            <button
              onClick={handleGenerateClick}
              disabled={!originalImage || !prompt.trim() || isLoading}
              className="w-full mt-4 bg-brand-cyan hover:bg-cyan-500 disabled:bg-brand-slate-700 disabled:text-brand-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : "✨ Generate"}
            </button>
          </div>

          {/* Right Column: Results */}
          <div className="flex flex-col gap-6 p-6 bg-brand-slate-900 rounded-2xl border border-brand-slate-800 shadow-2xl shadow-brand-slate-950/50">
             <h2 className="text-2xl font-bold text-brand-slate-100 tracking-tight">3. See the Magic</h2>
            <ResultDisplay 
              isLoading={isLoading} 
              error={error} 
              result={editResult}
              onContinueEditing={handleContinueEditing}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-brand-slate-500 text-sm">
        <p>Powered by Gemini. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;
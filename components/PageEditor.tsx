import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Page, Story } from '../types';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { generateImage, editImage, fileToBase64, generateNarration } from '../services/geminiService';

interface PageEditorProps {
  story: Story;
  pageId: string;
  onUpdatePage: (page: Page) => void;
  onBack: () => void;
}

const ImagePlaceholder = () => (
    <div className="w-full aspect-square bg-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2 font-semibold">Your image will appear here</p>
    </div>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7l2.289 1.256a1 1 0 010 1.506L14.146 11l-1.179 4.256A1 1 0 0112 16.233V15a1 1 0 01-1-1v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1V8a1 1 0 011-1h1a1 1 0 110-2h-1V3a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


export const PageEditor: React.FC<PageEditorProps> = ({ story, pageId, onUpdatePage, onBack }) => {
  const currentPage = story.pages.find(p => p.id === pageId);

  const [prompt, setPrompt] = useState(currentPage?.prompt || '');
  const [narration, setNarration] = useState(currentPage?.narration || '');
  const [refinePrompt, setRefinePrompt] = useState('');
  
  const [imageBase64, setImageBase64] = useState(currentPage?.imageBase64);
  const [imageMimeType, setImageMimeType] = useState(currentPage?.imageMimeType);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const faceFileRef = useRef<HTMLInputElement>(null);

  const handleUpdatePage = useCallback(() => {
    if (currentPage) {
        onUpdatePage({ ...currentPage, prompt, narration, imageBase64, imageMimeType });
    }
  }, [currentPage, onUpdatePage, prompt, narration, imageBase64, imageMimeType]);

  useEffect(() => {
    const timer = setTimeout(() => {
        handleUpdatePage();
    }, 1000); // Debounce saving
    return () => clearTimeout(timer);
  }, [prompt, narration, handleUpdatePage]);


  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setLoadingText('Generating your illustration...');
    setError(null);
    try {
      const fullPrompt = `Children's story book illustration, whimsical and magical style. ${prompt}. Based on the story concept: "${story.concept}"`;
      const result = await generateImage(fullPrompt);
      setImageBase64(result.base64);
      setImageMimeType(result.mimeType);
      if (currentPage) {
        onUpdatePage({ ...currentPage, prompt, narration, imageBase64: result.base64, imageMimeType: result.mimeType });
      }
    } catch (e) {
      setError('Sorry, something went wrong while generating the image.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefine = async () => {
    if (!refinePrompt || !imageBase64 || !imageMimeType) return;
    setIsLoading(true);
    setLoadingText('Refining your masterpiece...');
    setError(null);
    try {
        const result = await editImage({base64: imageBase64, mimeType: imageMimeType}, refinePrompt);
        setImageBase64(result.base64);
        setImageMimeType(result.mimeType);
        if (currentPage) {
            onUpdatePage({ ...currentPage, prompt, narration, imageBase64: result.base64, imageMimeType: result.mimeType });
        }
        setRefinePrompt('');
    } catch(e) {
        setError('Could not refine the image. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleFaceBlend = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !imageBase64 || !imageMimeType) return;
    setIsLoading(true);
    setLoadingText('Blending realities, just a moment...');
    setError(null);
    try {
        const faceImage = await fileToBase64(file);
        const blendPrompt = "Integrate the face from the second image into the main character in the first image, but keep the overall storybook art style.";
        const result = await editImage({base64: imageBase64, mimeType: imageMimeType}, blendPrompt, faceImage);
        setImageBase64(result.base64);
        setImageMimeType(result.mimeType);
        if (currentPage) {
            onUpdatePage({ ...currentPage, prompt, narration, imageBase64: result.base64, imageMimeType: result.mimeType });
        }
    } catch(e) {
        setError('Could not blend the face. Please try a different photo.');
    } finally {
        setIsLoading(false);
        if(faceFileRef.current) faceFileRef.current.value = '';
    }
  }

  const handleGenerateNarration = async () => {
    if (!prompt || !story.concept) return;
    setIsGeneratingNarration(true);
    setError(null);
    try {
        const result = await generateNarration(story.concept, prompt);
        setNarration(result);
    } catch (e) {
        setError('Sorry, we could not generate narration. Please try again.');
    } finally {
        setIsGeneratingNarration(false);
    }
  };

  if (!currentPage) {
    return (
        <div className="p-4">
            <p>Page not found.</p>
            <Button onClick={onBack}>Back to Storyboard</Button>
        </div>
    );
  }

  const pageIndex = story.pages.findIndex(p => p.id === pageId);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col">
        <div className="relative w-full aspect-square">
            {imageBase64 ? <img src={`data:${imageMimeType};base64,${imageBase64}`} alt={prompt} className="w-full h-full object-cover rounded-lg shadow-lg" /> : <ImagePlaceholder />}
            {isLoading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"><Spinner text={loadingText} /></div>}
        </div>
        {error && <p className="text-red-600 mt-4 bg-red-100 p-3 rounded-md">{error}</p>}
      </div>

      <div className="flex flex-col space-y-6">
        <div>
            <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-2">&larr; Back to Storyboard</button>
            <h1 className="text-3xl font-bold text-slate-800">Page {pageIndex + 1} Editor</h1>
        </div>

        <div>
          <label htmlFor="visual-prompt" className="block text-lg font-semibold text-slate-700 mb-2">Visual Prompt</label>
          <textarea id="visual-prompt" rows={3} className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Foxy sniffing flowers in a mossy forest clearing." value={prompt} onChange={e => setPrompt(e.target.value)} />
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt.trim()} className="mt-2 w-full sm:w-auto">
            {imageBase64 ? 'Re-generate Image' : 'Generate Image'}
          </Button>
        </div>

        {imageBase64 && (
          <div className="bg-slate-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Refine & Personalize</h2>
            <div>
              <label htmlFor="refine-prompt" className="block text-md font-semibold text-slate-700 mb-2">Refine with words</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input id="refine-prompt" type="text" className="flex-grow p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Make the flowers glow subtly." value={refinePrompt} onChange={e => setRefinePrompt(e.target.value)} />
                <Button onClick={handleRefine} isLoading={isLoading} disabled={!refinePrompt.trim()} className="flex-shrink-0">Refine</Button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-md font-semibold text-slate-700 mb-2">Integrate a face (Co-creation)</label>
              <input type="file" accept="image/*" ref={faceFileRef} onChange={handleFaceBlend} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="narration" className="block text-lg font-semibold text-slate-700">Narration Text</label>
            <Button 
                onClick={handleGenerateNarration} 
                isLoading={isGeneratingNarration} 
                disabled={!prompt.trim() || isLoading} 
                variant="ghost" 
                size="sm"
            >
                <SparklesIcon />
                Generate with AI
            </Button>
          </div>
          <textarea id="narration" rows={4} className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., In a forest filled with wonder, lived a happy little fox named Foxy..." value={narration} onChange={e => setNarration(e.target.value)} />
        </div>
      </div>
    </div>
  );
};
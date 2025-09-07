import React from 'react';
import { CreationMode, Story } from '../types';
import { Card } from './ui/Card';
import { SampleStories } from './SampleStories';
import { sampleStories } from '../data/samples';
import { Button } from './ui/Button';


interface CreationModeSelectorProps {
  onSelectMode: (mode: CreationMode) => void;
  onSelectStory: (story: Story) => void;
  onSelectPrompt: (prompt: string) => void;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 7-7a1 1 0 011.414 0L21 12m-5-9l2.293 2.293a1 1 0 010 1.414l-7 7-4 4 4-4 2.293-2.293a1 1 0 011.414 0L16 12z" />
    </svg>
);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const samplePrompts = [
    "A curious squirrel who finds a city in an oak tree...",
    "A little girl who befriends a gentle dragon...",
    "Two robot friends on a quest for the Golden Bolt...",
    "A magical paintbrush that brings drawings to life...",
];

export const CreationModeSelector: React.FC<CreationModeSelectorProps> = ({ onSelectMode, onSelectStory, onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 py-24 sm:py-32">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Start a New Story</h1>
        <p className="text-slate-600 mt-2 text-lg">How would you like to begin your adventure?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Card onClick={() => onSelectMode(CreationMode.QUICK_START)} className="text-center">
            <SparklesIcon />
            <h2 className="text-2xl font-bold text-slate-800">Start from a Concept</h2>
            <p className="text-slate-600 mt-2">Perfect for parents and kids. Give a theme and get a full story outline.</p>
        </Card>
        <Card onClick={() => onSelectMode(CreationMode.FROM_IMAGES)} className="text-center">
            <ImageIcon />
            <h2 className="text-2xl font-bold text-slate-800">Start with Images</h2>
            <p className="text-slate-600 mt-2">Upload your drawings or photos and let AI write a story to match.</p>
        </Card>
      </div>
      
      <div className="mt-12 w-full max-w-2xl text-center">
          <p className="text-slate-500 mb-4">Or try one of these ideas:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {samplePrompts.map((prompt, index) => (
              <Button 
                key={index} 
                variant="secondary" 
                size="sm" 
                onClick={() => onSelectPrompt(prompt)}
                className="text-left font-normal"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

      <SampleStories stories={sampleStories} onSelectStory={onSelectStory} />
    </div>
  );
};
import React from 'react';
import { CreationMode, Story } from '../types';
import { Card } from './ui/Card';
import { SampleStories } from './SampleStories';
import { sampleStories } from '../data/samples';


interface CreationModeSelectorProps {
  onSelectMode: (mode: CreationMode) => void;
  onSelectStory: (story: Story) => void;
}

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 7-7a1 1 0 011.414 0L21 12m-5-9l2.293 2.293a1 1 0 010 1.414l-7 7-4 4 4-4 2.293-2.293a1 1 0 011.414 0L16 12z" />
    </svg>
);

export const CreationModeSelector: React.FC<CreationModeSelectorProps> = ({ onSelectMode, onSelectStory }) => {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 py-24 sm:py-32">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Start a New Story</h1>
        <p className="text-slate-600 mt-2 text-lg">How would you like to begin your adventure?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Card onClick={() => onSelectMode(CreationMode.QUICK_START)} className="text-center">
            <SparklesIcon />
            <h2 className="text-2xl font-bold text-slate-800">Quick Start</h2>
            <p className="text-slate-600 mt-2">Perfect for parents and kids. Choose a theme and get helpful prompts to kickstart your creativity.</p>
        </Card>
        <Card onClick={() => onSelectMode(CreationMode.BLANK_CANVAS)} className="text-center">
            <BookIcon />
            <h2 className="text-2xl font-bold text-slate-800">Blank Canvas</h2>
            <p className="text-slate-600 mt-2">For seasoned storytellers. You have complete control from the very first word. Let your imagination run wild!</p>
        </Card>
      </div>
      <SampleStories stories={sampleStories} onSelectStory={onSelectStory} />
    </div>
  );
};

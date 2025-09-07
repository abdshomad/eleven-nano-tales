import React, { useState } from 'react';
import { CreationMode } from '../types';
import { Button } from './ui/Button';

interface StorySetupProps {
  creationMode: CreationMode;
  onConceptSubmit: (concept: string) => void;
  onBack: () => void;
}

const prompts = {
    [CreationMode.QUICK_START]: "e.g., A brave little fox named Foxy who explores a magical forest.",
}

export const StorySetup: React.FC<StorySetupProps> = ({ creationMode, onConceptSubmit, onBack }) => {
  const [concept, setConcept] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (concept.trim()) {
      onConceptSubmit(concept.trim());
    }
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-4">&larr; Back</button>
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800">What's Your Story Idea?</h1>
            <p className="text-slate-600 mt-2 text-lg">Describe the main idea in a sentence or two. This will set the stage for your tale!</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
            <textarea
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder={prompts[creationMode]}
            className="w-full h-40 p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            autoFocus
            />
            <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={!concept.trim()}>
                    Start Storyboarding
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
};
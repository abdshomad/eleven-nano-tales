
import React, { useState } from 'react';
import { Page, Story, PageLayout } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface StoryboardEditorProps {
  story: Story;
  onAddPage: () => void;
  onEditPage: (pageId: string) => void;
  onPreviewStory: () => void;
  onBack: () => void;
  onGenerateOutline: (layout: PageLayout) => void;
  isGeneratingOutline?: boolean;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7l2.289 1.256a1 1 0 010 1.506L14.146 11l-1.179 4.256A1 1 0 0112 16.233V15a1 1 0 01-1-1v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1V8a1 1 0 011-1h1a1 1 0 110-2h-1V3a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const layouts: PageLayout[] = ['1x1', '2x2', '3x3', '4x4', '3x4', '4x3'];

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({ story, onAddPage, onEditPage, onPreviewStory, onBack, onGenerateOutline, isGeneratingOutline = false }) => {
  const [outlineLayout, setOutlineLayout] = useState<PageLayout>('2x2');
  
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
                <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-4">&larr; Back</button>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Storyboard</h1>
                <p className="text-slate-600 mt-1 max-w-2xl italic">"{story.concept}"</p>
            </div>
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            <Button onClick={onPreviewStory} variant="secondary" disabled={story.pages.length === 0}>
                <EyeIcon /> Preview Story
            </Button>
          </div>
        </div>

        {story.storyboardImageBase64 && (
          <Card className="mb-8 p-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Visual Storyboard Outline</h2>
            <img 
              src={`data:${story.storyboardImageMimeType};base64,${story.storyboardImageBase64}`} 
              alt="A grid of images outlining the story." 
              className="rounded-lg shadow-md w-full"
            />
          </Card>
        )}

        {story.pages.length === 0 && (
            <Card className="text-center py-10 mb-6">
                <h2 className="text-2xl font-bold text-slate-700">Your story begins here!</h2>
                <p className="text-slate-500 mt-2 mb-4">Add your first page manually, or let AI create an outline for you.</p>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Outline Grid &amp; Page Count</label>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {layouts.map(l => (
                            <Button
                                key={l}
                                variant={outlineLayout === l ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => setOutlineLayout(l)}
                            >
                                {l}
                            </Button>
                        ))}
                    </div>
                </div>
                <Button onClick={() => onGenerateOutline(outlineLayout)} isLoading={isGeneratingOutline}>
                    <SparklesIcon /> Generate Outline with AI
                </Button>
            </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {story.pages.map((page, index) => (
            <Card key={page.id} onClick={() => onEditPage(page.id)} className="flex flex-col justify-between">
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-slate-800">Page {index + 1}</h3>
                        {page.imageBase64 && <div className="w-16 h-16 rounded-md bg-cover bg-center" style={{backgroundImage: `url(data:${page.imageMimeType};base64,${page.imageBase64})`}} />}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3"><strong>Prompt:</strong> {page.prompt || 'Not set'}</p>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2"><strong>Narration:</strong> {page.narration || 'Not set'}</p>
                </div>
                <div className="text-right mt-4 text-indigo-600 font-semibold text-sm">Edit Page &rarr;</div>
            </Card>
          ))}
          <button 
            onClick={onAddPage} 
            className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors p-6 min-h-[180px]"
          >
            <PlusIcon />
            <span className="mt-2 font-semibold">Add New Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Page, Story } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface StoryboardEditorProps {
  story: Story;
  onAddPage: () => void;
  onEditPage: (pageId: string) => void;
  onPreviewStory: () => void;
  onBack: () => void;
  isAddingPage?: boolean;
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

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({ story, onAddPage, onEditPage, onPreviewStory, onBack, isAddingPage = false }) => {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
                <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-2">&larr; Back to Concept</button>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Storyboard</h1>
                <p className="text-slate-600 mt-1 max-w-2xl italic">"{story.concept}"</p>
            </div>
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            <Button onClick={onPreviewStory} variant="secondary" disabled={story.pages.length === 0}>
                <EyeIcon /> Preview Story
            </Button>
          </div>
        </div>

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
            disabled={isAddingPage}
            className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors p-6 min-h-[180px] disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-500"
          >
            {isAddingPage ? (
                <>
                    <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="mt-2 font-semibold">AI is thinking...</span>
                </>
            ) : (
                <>
                    <PlusIcon />
                    <span className="mt-2 font-semibold">Add New Page</span>
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Story } from '../types';

interface StoryReaderProps {
  story: Story;
  onExit: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story, onExit }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (story.pages.length === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-100">
        <p className="text-xl text-slate-700">This story has no pages yet!</p>
        <button onClick={onExit} className="mt-4 text-indigo-600 font-semibold">&larr; Back to Storyboard</button>
      </div>
    );
  }

  const currentPage = story.pages[currentPageIndex];

  const goToNextPage = () => {
    setCurrentPageIndex(prev => Math.min(prev + 1, story.pages.length - 1));
  };

  const goToPrevPage = () => {
    setCurrentPageIndex(prev => Math.max(prev - 1, 0));
  };

  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === story.pages.length - 1;

  return (
    <div className="h-screen w-screen bg-black flex flex-col relative text-white">
      <button onClick={onExit} className="absolute top-4 left-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Image Area */}
      <div className="flex-grow flex items-center justify-center overflow-hidden">
        {currentPage.imageBase64 ? (
          <img
            src={`data:${currentPage.imageMimeType};base64,${currentPage.imageBase64}`}
            alt={currentPage.prompt}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-center p-8">
            <h2 className="text-2xl">No Image Generated</h2>
            <p className="text-slate-400">This page is waiting for its illustration.</p>
          </div>
        )}
      </div>

      {/* Narration Box */}
      {currentPage.narration && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 sm:p-10 z-10">
          <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm p-4 rounded-lg text-center">
            <p className="text-lg sm:text-2xl leading-relaxed">{currentPage.narration}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!isFirstPage && (
        <button
          onClick={goToPrevPage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-3 rounded-full hover:bg-black/80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {!isLastPage && (
        <button
          onClick={goToNextPage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-3 rounded-full hover:bg-black/80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {/* Page Counter */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/50 px-3 py-1 text-sm rounded-full">
        {currentPageIndex + 1} / {story.pages.length}
      </div>
    </div>
  );
};
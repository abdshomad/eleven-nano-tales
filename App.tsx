import React, { useState, useCallback } from 'react';
import { AppView, CreationMode, Story, Page } from './types';
import { CreationModeSelector } from './components/CreationModeSelector';
import { StorySetup } from './components/StorySetup';
import { StoryboardEditor } from './components/StoryboardEditor';
import { PageEditor } from './components/PageEditor';
import { StoryReader } from './components/StoryReader';
import { Button } from './components/ui/Button';
import { generateNextPrompt, generateStoryboard } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CREATION_MODE_SELECTION);
  const [story, setStory] = useState<Story | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
  const [isSuggestingPrompt, setIsSuggestingPrompt] = useState(false);

  const handleSelectMode = useCallback((mode: CreationMode) => {
    setStory({
      id: new Date().toISOString(),
      title: 'Untitled Story',
      concept: '',
      creationMode: mode,
      pages: [],
    });
    setCurrentView(AppView.STORY_SETUP);
  }, []);

  const handleConceptSubmit = useCallback((concept: string) => {
    if (story) {
      // Go to an empty storyboard, generation is now a separate step
      setStory({ ...story, concept, pages: [] });
      setCurrentView(AppView.STORYBOARD);
    }
  }, [story]);

  const handleGenerateStoryboardOutline = useCallback(async () => {
    if (story && story.concept) {
      setIsGeneratingStoryboard(true);
      try {
        const generatedPages = await generateStoryboard(story.concept);
        const newPages: Page[] = generatedPages.map(p => ({
            id: new Date().toISOString() + Math.random(),
            prompt: p.prompt,
            narration: p.narration,
        }));
        setStory(s => s ? { ...s, pages: newPages } : null);
      } catch (error) {
        console.error("Failed to generate storyboard:", error);
        // Optionally, show an error message to the user here
      } finally {
        setIsGeneratingStoryboard(false);
      }
    }
  }, [story]);
  
  const handleAddPage = useCallback(() => {
    if (story) {
        // Create a blank page without AI suggestion
        const newPage: Page = {
            id: new Date().toISOString() + Math.random(),
            prompt: '',
            narration: '',
        };
        const updatedStory = { ...story, pages: [...story.pages, newPage] };
        setStory(updatedStory);
        setActivePageId(newPage.id);
        setCurrentView(AppView.PAGE_EDITOR);
    }
  }, [story]);

  const handleGenerateNextPrompt = useCallback(async () => {
    if (story && activePageId) {
        const pageIndex = story.pages.findIndex(p => p.id === activePageId);
        if (pageIndex <= 0) return; // Cannot suggest for the first page

        const lastPage = story.pages[pageIndex - 1];
        
        setIsSuggestingPrompt(true);
        try {
            const suggestedPrompt = await generateNextPrompt(story.concept, lastPage.prompt, lastPage.narration);
            const updatedPages = story.pages.map(p => 
                p.id === activePageId ? { ...p, prompt: suggestedPrompt } : p
            );
            setStory(s => s ? { ...s, pages: updatedPages } : null);
        } catch (e) {
            console.error("Failed to generate prompt suggestion:", e);
        } finally {
            setIsSuggestingPrompt(false);
        }
    }
  }, [story, activePageId]);

  const handleEditPage = useCallback((pageId: string) => {
    setActivePageId(pageId);
    setCurrentView(AppView.PAGE_EDITOR);
  }, []);

  const handleUpdatePage = useCallback((updatedPage: Page) => {
    if (story) {
        const newPages = story.pages.map(p => p.id === updatedPage.id ? updatedPage : p);
        setStory({ ...story, pages: newPages });
    }
  }, [story]);

  const handleSelectSampleStory = useCallback((selectedStory: Story) => {
    setStory(selectedStory);
    setCurrentView(AppView.STORYBOARD);
  }, []);

  const handleSelectPrompt = useCallback((prompt: string) => {
    const newStory: Story = {
      id: new Date().toISOString(),
      title: 'Untitled Story',
      concept: prompt,
      creationMode: CreationMode.QUICK_START,
      pages: [],
    };
    setStory(newStory);
    setCurrentView(AppView.STORYBOARD);
  }, []);

  const resetToHome = () => {
    setStory(null);
    setActivePageId(null);
    setCurrentView(AppView.CREATION_MODE_SELECTION);
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.CREATION_MODE_SELECTION:
        return <CreationModeSelector onSelectMode={handleSelectMode} onSelectStory={handleSelectSampleStory} onSelectPrompt={handleSelectPrompt} />;
      
      case AppView.STORY_SETUP:
        if (story) {
            return <StorySetup 
                creationMode={story.creationMode} 
                onConceptSubmit={handleConceptSubmit}
                onBack={() => setCurrentView(AppView.CREATION_MODE_SELECTION)}
            />;
        }
        return null;

      case AppView.STORYBOARD:
        if (story) {
            return <StoryboardEditor 
                story={story} 
                onAddPage={handleAddPage} 
                onEditPage={handleEditPage}
                onPreviewStory={() => setCurrentView(AppView.STORY_READER)}
                onBack={() => setCurrentView(AppView.STORY_SETUP)}
                onGenerateOutline={handleGenerateStoryboardOutline}
                isGeneratingOutline={isGeneratingStoryboard}
            />;
        }
        return null;
        
      case AppView.PAGE_EDITOR:
        if (story && activePageId) {
            const pageIndex = story.pages.findIndex(p => p.id === activePageId);
            return <PageEditor 
                story={story}
                pageId={activePageId}
                pageIndex={pageIndex}
                onUpdatePage={handleUpdatePage}
                onBack={() => setCurrentView(AppView.STORYBOARD)}
                onGeneratePrompt={handleGenerateNextPrompt}
                isGeneratingPrompt={isSuggestingPrompt}
            />;
        }
        return null;

      case AppView.STORY_READER:
        if (story) {
            return <StoryReader story={story} onExit={() => setCurrentView(AppView.STORYBOARD)} />;
        }
        return null;

      default:
        return <CreationModeSelector onSelectMode={handleSelectMode} onSelectStory={handleSelectSampleStory} onSelectPrompt={handleSelectPrompt} />;
    }
  };
  
  const showHeader = currentView !== AppView.STORY_READER;

  return (
    <div className="w-full min-h-screen">
        {showHeader && (
            <header className="fixed top-0 left-0 right-0 p-3 z-50 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <button onClick={resetToHome} className="flex items-center gap-2 text-slate-700 font-bold hover:text-indigo-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Eleven Nano Tales
                    </button>
                    {currentView !== AppView.CREATION_MODE_SELECTION && (
                         <Button onClick={resetToHome} variant="secondary" size="sm">
                            + New Story
                        </Button>
                    )}
                </div>
            </header>
        )}
        <main className={showHeader ? "pt-20" : ""}>
            {renderContent()}
        </main>
    </div>
  );
};

export default App;

import React from 'react';
import { Story } from '../types';
import { Card } from './ui/Card';

interface SampleStoriesProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export const SampleStories: React.FC<SampleStoriesProps> = ({ stories, onSelectStory }) => {
  return (
    <div className="w-full max-w-4xl mt-16">
      <div className="relative mb-8">
        <hr className="border-slate-300" />
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-slate-50 px-4 text-slate-500 font-semibold">OR</span>
      </div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Get Inspired by a Sample</h2>
        <p className="text-slate-600 mt-2">See what's possible with Eleven Nano Tales.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map(story => (
          <Card key={story.id} onClick={() => onSelectStory(story)} className="p-0 overflow-hidden flex flex-col">
            <div
              className="w-full h-48 bg-slate-200 bg-cover bg-center"
              style={{ backgroundImage: `url(data:${story.pages[0].imageMimeType};base64,${story.pages[0].imageBase64})` }}
              role="img"
              aria-label={story.title}
            />
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-slate-800">{story.title}</h3>
              <p className="text-slate-600 mt-2 flex-grow">{story.concept}</p>
              <div className="text-right mt-4 text-indigo-600 font-semibold text-sm">Explore Outline &rarr;</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

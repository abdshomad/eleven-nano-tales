
export enum AppView {
  CREATION_MODE_SELECTION,
  STORY_SETUP,
  IMAGE_UPLOAD,
  STORYBOARD,
  PAGE_EDITOR,
  STORY_READER,
}

export enum CreationMode {
  QUICK_START = 'QUICK_START',
  FROM_IMAGES = 'FROM_IMAGES',
}

export type PageLayout = '1x1' | '2x2' | '3x3' | '4x4' | '3x4' | '4x3';

export interface Page {
  id: string;
  prompt: string;
  narration: string;
  imageBase64?: string;
  imageMimeType?: string;
  layout?: PageLayout;
}

export interface Story {
  id: string;
  title: string;
  concept: string;
  creationMode: CreationMode;
  pages: Page[];
  storyboardImageBase64?: string;
  storyboardImageMimeType?: string;
}
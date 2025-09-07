
export enum AppView {
  CREATION_MODE_SELECTION,
  STORY_SETUP,
  STORYBOARD,
  PAGE_EDITOR,
  STORY_READER,
}

export enum CreationMode {
  QUICK_START = 'QUICK_START',
  BLANK_CANVAS = 'BLANK_CANVAS',
}

export interface Page {
  id: string;
  prompt: string;
  narration: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface Story {
  id: string;
  title: string;
  concept: string;
  creationMode: CreationMode;
  pages: Page[];
}

// purpose: shared typescript interfaces and discriminated union state types

// firestore document model for saved components
export interface ComponentDocument {
  id: string;
  prompt: string;
  code: string;
  title: string;
  createdAt: number;
}

// discriminated union for ai generation state
export type GenerationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; code: string; prompt: string }
  | { status: 'error'; message: string };

// discriminated union for gallery fetch state
export type GalleryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; components: ComponentDocument[] }
  | { status: 'error'; message: string };

// component props
export interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export interface PreviewPanelProps {
  state: GenerationState;
  onSave: () => void;
  isSaving: boolean;
}

export interface GalleryGridProps {
  state: GalleryState;
  onRefresh: () => void;
}

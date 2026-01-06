
export interface PromptResult {
  title: string;
  prompt: string;
  negativePrompt?: string;
  tags: string[];
  suggestedModel: string;
}

export interface PromptLayer {
  layerType: 'SUBJECT' | 'MEDIUM' | 'LIGHTING_CAMERA' | 'STYLE_VIBE';
  content: string; // The specific part of the prompt
  explanation: string; // Educational explanation in PT-BR
}

export interface ReverseEngineeringResult {
  description: string;
  detailedPrompt: string;
  artStyle: string;
  composition: string;
  // New educational fields
  promptBreakdown: { term: string; explanation: string }[];
  promptLayers: PromptLayer[]; // The anatomical breakdown
  improvedPrompt: string;
  improvementLogic: string;
}

export interface InterpreterResult {
  analysis: string;
  visualPrompt: string;
  elements: string[];
}

export interface SequenceResult {
  masterPrompt: string;
  sequence: {
    frameNumber: number;
    actionPrompt: string;
    cameraMovement: string;
    duration: string;
  }[];
}

// New Types for Ad Campaign (Cinematic Update)
export interface AdScene {
  sceneNumber: number;
  type: 'TEASER' | 'ESTABLISHING' | 'BUILD_UP' | 'ACTION' | 'CLIMAX' | 'PAYOFF';
  duration: string; // ex: "2s"
  shotType: string; // ex: "Extreme Close Up", "Wide Shot"
  cameraGear: string; // ex: "35mm Anamorphic"
  lighting: string; // ex: "Rembrandt Lighting"
  transition: string; // ex: "Whip pan to next"
  audioCues: string; // ex: "Bass drop, heart beat"
  description: string; // Narrative description in PT-BR
  imagePrompt: string; // Midjourney/Flux (Visual focus)
  videoPrompt: string; // Runway/Luma (Movement focus)
}

export interface AdCampaignResult {
  projectTitle: string;
  logline: string; // One sentence pitch
  visualStyle: string; // The overall aesthetic
  scenes: AdScene[];
}

export interface CreativeCopy {
  headline: string; // Título curto (Ex: "Energia Pura")
  subheadline: string; // Frase de efeito/Gancho (Ex: "Sinta o poder")
  cta: string; // Chamada para ação (Ex: "Compre Agora")
}

export interface PaletteResult {
  colors: string[];
  description: string;
  usagePrompt: string;
}

export interface ModularRefs {
  typography?: { data: string; mimeType: string };
  colors?: { data: string; mimeType: string };
  composition?: { data: string; mimeType: string };
}

export type FocusMode = 'AUTO' | 'SHALLOW' | 'DEEP';

export enum AppMode {
  GENERATOR = 'GENERATOR',
  PRODUCT_STUDIO = 'PRODUCT_STUDIO',
  REVERSE_ENGINEER = 'REVERSE_ENGINEER',
  HISTORY = 'HISTORY',
  INTERPRETER = 'INTERPRETER',
  SEQUENCER = 'SEQUENCER',
  VIDEO_REVERSE_ENGINEER = 'VIDEO_REVERSE_ENGINEER',
  COMPOSER = 'COMPOSER',
  AGENT_BUILDER = 'AGENT_BUILDER',
  BRAND_STUDIO = 'BRAND_STUDIO',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN',
  LIBRARY = 'LIBRARY',
  LEARNING_CENTER = 'LEARNING_CENTER',
  PRD_GENERATOR = 'PRD_GENERATOR',
  HELP_CENTER = 'HELP_CENTER'
}

export type GenerationType = 'IMAGE' | 'VIDEO' | '3D_ASSET' | 'TEXTURE' | 'UI_UX' | 'WEBSITE' | 'LOGO_BRAND';

export interface HistoryItem {
  id: string;
  timestamp: number;
  mode: AppMode;
  input: string; // The user input or image name
  output: PromptResult[] | ReverseEngineeringResult | InterpreterResult | SequenceResult | AdCampaignResult | string;
}

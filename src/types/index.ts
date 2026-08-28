export type NavSection =
  | 'home'
  | 'generate'
  | 'real-estate'
  | 'projects'
  | 'editor'
  | 'storyboard'
  | 'assets'
  | 'templates'
  | 'history'
  | 'enhance'
  | 'brand-kit'
  | 'api'
  | 'admin'
  | 'settings';

export type GenerationMode =
  | 'text-to-video'
  | 'image-to-video'
  | 'video-to-video'
  | 'multi-reference'
  | 'real-estate-ai';

export type VideoProviderId =
  | 'google-veo'
  | 'runway-gen3'
  | 'openai-sora'
  | 'kling-ai'
  | 'luma-dream'
  | 'hailuo-ai'
  | 'vision-neural-engine';

export type VideoProvider = VideoProviderId;

export type ModelTier = 'auto' | 'fast' | 'quality' | 'experimental';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '3:2' | '2:3' | '21:9' | 'custom';

export type VideoResolution = '720p' | '1080p' | '2K' | '4K' | '8K' | 'Enhanced 8K';

export type FrameRate = 24 | 25 | 30 | 50 | 60;

export type QualityTier = 'Draft' | 'Standard' | 'High' | 'Ultra' | 'Cinema';

export type ReferencePreservation = 'Low' | 'Medium' | 'High' | 'Maximum';

export type CameraMovement =
  | 'Static'
  | 'Dolly In'
  | 'Dolly Out'
  | 'Pan Left'
  | 'Pan Right'
  | 'Tilt Up'
  | 'Tilt Down'
  | 'Orbit Left'
  | 'Orbit Right'
  | 'Crane Up'
  | 'Crane Down'
  | 'Tracking Shot'
  | 'Handheld'
  | 'Drone'
  | 'POV'
  | 'FPV'
  | 'FPV Dynamic'
  | 'Whip Pan'
  | 'Roll / Dutch Angle'
  | 'Handheld Cinematic'
  | 'Slider'
  | 'Custom';

export type CameraSpeed = 'Very Slow' | 'Slow' | 'Normal' | 'Fast';
export type CameraStability = 'Locked' | 'Smooth' | 'Natural' | 'Handheld';
export type LensType = '14mm' | '18mm' | '24mm' | '35mm' | '50mm' | '70mm' | '85mm' | '100mm' | 'Anamorphic 2.39:1' | 'Custom';
export type CameraLens = LensType;
export type DepthOfField = 'Auto' | 'Deep' | 'Medium' | 'Shallow';

export type AngleView =
  | 'front'
  | 'left'
  | 'right'
  | 'rear'
  | 'close-up'
  | 'wide'
  | 'high angle'
  | 'low angle'
  | 'top view'
  | 'drone perspective'
  | 'detail'
  | 'POV';

export type MultiAngleView = AngleView;

export type RealismStyle = 'Natural' | 'Photorealistic' | 'Cinematic' | 'Commercial' | 'Documentary';

export type AudioOption = 'None' | 'Ambient Sound' | 'Sound Effects' | 'Dialogue' | 'Music' | 'All';

export interface ConsistencySettings {
  characterLock: boolean;
  faceLock: boolean;
  objectLock: boolean;
  environmentLock: boolean;
  styleLock: boolean;
  cameraLock: boolean;
  seedLocked?: boolean;
  seedValue?: number;
}

export interface MotionSettings {
  strength: number; // 0 - 100
  subjectMotion: number; // 0 - 100
  cameraMotion: number; // 0 - 100
  environmentMotion: number; // 0 - 100
}

export interface RealismSliders {
  realism: number; // 0 - 100
  textureDetail: number; // 0 - 100
  lightingAccuracy: number; // 0 - 100
  motionNaturalness: number; // 0 - 100
  physicsAccuracy: number; // 0 - 100
  faceConsistency: number; // 0 - 100
  environmentConsistency: number; // 0 - 100
}

export interface CameraSettings {
  movement: CameraMovement;
  speed: CameraSpeed;
  stability: CameraStability;
  lens: LensType;
  depthOfField: DepthOfField;
  zoomLevel: number; // 1.0 - 5.0
  focusDistance: string; // e.g. "Subject", "Infinity", "Foreground"
  cameraHeight: string; // "Eye level", "Low ground", "Overhead"
  fov: number; // 30 - 120
}

export interface GenerationParams {
  prompt: string;
  enhancedPrompt?: string;
  negativePrompt: string;
  mode: GenerationMode;
  provider: VideoProviderId;
  modelTier: ModelTier;
  aspectRatio: AspectRatio;
  resolution: VideoResolution;
  isNativeResolution: boolean;
  fps: FrameRate;
  quality: QualityTier;
  durationSeconds: number; // 4, 5, 6, 8, 10, 12, 15, 30+
  camera: CameraSettings;
  motion: MotionSettings;
  realismStyle: RealismStyle;
  realismSliders: RealismSliders;
  preserveReference: ReferencePreservation;
  consistency: ConsistencySettings;
  audio: {
    enabled: boolean;
    type: AudioOption;
    prompt: string;
    autoSync: boolean;
  };
  initialImageUrl?: string;
  finalImageUrl?: string;
  multiReferenceUrls?: string[];
  sourceVideoUrl?: string;
  seed: number;
}

export type JobStatus =
  | 'Queued'
  | 'Preparing'
  | 'Generating'
  | 'Enhancing'
  | 'Upscaling'
  | 'Finalizing'
  | 'Completed'
  | 'Failed';

export interface GenerationJob {
  id: string;
  projectId?: string;
  createdAt: string;
  status: JobStatus;
  progress: number; // 0 - 100
  statusMessage: string;
  params: GenerationParams;
  resultVideoUrl?: string;
  thumbnailUrl?: string;
  durationActual?: number;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  renderingEngine: string;
  providerUsed: string;
  costCredits: number;
  error?: string;
}

export interface GenerationFeedback {
  jobId: string;
  rating: 'like' | 'dislike';
  reason?: 'Not realistic' | 'Changed reference' | 'Bad motion' | 'Bad anatomy' | 'Flicker' | 'Poor quality' | 'Wrong camera' | 'Other';
  comment?: string;
  submittedAt: string;
}

export interface RoomItem {
  id: string;
  imageUrl: string;
  detectedType: 'fachada' | 'entrada' | 'sala' | 'cozinha' | 'quarto' | 'banheiro' | 'piscina' | 'varanda' | 'jardim' | 'area_gourmet' | 'vista' | 'outro';
  label: string;
  confidence: number;
  recommendedMovement: CameraMovement;
  suggestedDuration: number;
  promptGenerated?: string;
  selected: boolean;
}

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  title: string;
  imageUrl?: string;
  prompt: string;
  duration: number;
  cameraMovement: CameraMovement;
  speed: CameraSpeed;
  audioMood: string;
  status: 'draft' | 'queued' | 'rendering' | 'ready';
  generatedVideoUrl?: string;
  thumbnailUrl?: string;
  notes?: string;
}

// Timeline Editor Types
export type TrackType = 'video' | 'audio' | 'music' | 'voice' | 'text' | 'effects' | 'overlay';

export interface TimelineClip {
  id: string;
  trackId: string;
  title: string;
  type: TrackType;
  startTime: number; // in seconds
  duration: number; // in seconds
  sourceStartTime: number;
  sourceUrl?: string;
  thumbnailUrl?: string;
  color: string;
  volume?: number; // 0 - 100
  speed?: number; // 0.25 - 4.0
  aiEditMask?: {
    promptInstruction: string;
    brushArea?: string;
  };
  textOverlay?: {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    position: { x: number; y: number };
  };
  transitionIn?: 'none' | 'fade' | 'crossfade' | 'slide' | 'zoom' | 'blur';
  transitionOut?: 'none' | 'fade' | 'crossfade' | 'slide' | 'zoom' | 'blur';
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    hueRotate?: number;
  };
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: TrackType;
  muted: boolean;
  locked: boolean;
  visible: boolean;
  clips: TimelineClip[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  aspectRatio: AspectRatio;
  resolution: VideoResolution;
  fps: FrameRate;
  tags: string[];
  generationsCount: number;
  tracks: TimelineTrack[];
  scenes?: StoryboardScene[];
  status: 'active' | 'archived' | 'completed';
}

export interface VideoTemplate {
  id: string;
  title: string;
  category: 'Real Estate' | 'Airbnb' | 'Commercial' | 'Cinematic' | 'Automotive' | 'Product' | 'Fashion' | 'Social Media' | 'Travel';
  description: string;
  duration: string;
  aspectRatio: AspectRatio;
  thumbnailUrl: string;
  videoPreviewUrl: string;
  defaultPrompt: string;
  cameraPreset: CameraMovement;
  shotsCount: number;
  tags: string[];
}

export interface BrandKitItem {
  id: string;
  name: string;
  logoUrl?: string;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  watermarkOpacity: number;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  introBumperUrl?: string;
  outroBumperUrl?: string;
}

export interface ReferenceAsset {
  id: string;
  type: 'character' | 'product' | 'environment' | 'house' | 'logo' | 'style';
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  tags: string[];
}

export interface UserSubscription {
  plan: 'Free' | 'Creator' | 'Pro' | 'Studio' | 'Unlimited';
  creditsRemaining: number;
  totalMonthlyCredits: number;
  fairUseActive: boolean;
  storageUsedMb: number;
  storageLimitMb: number;
  generationsThisMonth: number;
  maxSimultaneousRenders: number;
  features: string[];
}

export interface AdminTelemetry {
  activeUsers: number;
  totalGenerationsToday: number;
  avgRenderTimeSec: number;
  totalApiCostTodayUsd: number;
  avgCostPerVideoUsd: number;
  activeGPUQueues: number;
  successRatePercentage: number;
  storageTotalGb: number;
  providerMetrics: {
    provider: string;
    jobsCompleted: number;
    avgLatencySec: number;
    errorRate: number;
    costUsd: number;
  }[];
  recentFailedJobs: {
    id: string;
    prompt: string;
    error: string;
    time: string;
    provider: string;
  }[];
}

export * from '../i18n/types';

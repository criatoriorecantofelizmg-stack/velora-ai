import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  NavSection,
  GenerationParams,
  GenerationJob,
  Project,
  VideoTemplate,
  BrandKitItem,
  ReferenceAsset,
  UserSubscription,
  TimelineTrack,
  TimelineClip,
  GenerationFeedback,
  RoomItem,
  StoryboardScene,
  AspectRatio,
} from '../types';
import {
  LanguageCode,
  RegionalSettings,
  VoiceSettings,
  SubtitlesSettings,
  DEFAULT_LANGUAGE,
  LANGUAGES,
  detectBrowserLanguage,
  translate,
  formatDate as formatI18nDate,
  formatCurrency as formatI18nCurrency,
  formatNumber as formatI18nNumber,
} from '../i18n';
import {
  INITIAL_GENERATIONS,
  INITIAL_PROJECTS,
  SAMPLE_TEMPLATES,
  SAMPLE_ASSETS,
  INITIAL_BRAND_KIT,
  INITIAL_SUBSCRIPTION,
} from '../services/mockData';
import { apiService } from '../services/api';

interface AppContextType {
  // Navigation
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;

  // Internationalization (i18n)
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  regionalSettings: RegionalSettings;
  updateRegionalSettings: (settings: Partial<RegionalSettings>) => void;
  voiceSettings: VoiceSettings;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  subtitlesSettings: SubtitlesSettings;
  updateSubtitlesSettings: (settings: Partial<SubtitlesSettings>) => void;
  formatDate: (date: string | Date | number, customFormat?: string) => string;
  formatCurrency: (amount: number, customCurrency?: string) => string;
  formatNumber: (val: number) => string;
  isRtl: boolean;

  // Prompt Translation & Intelligence
  isTranslatingPrompt: boolean;
  translatePrompt: (targetLang?: LanguageCode) => Promise<void>;

  // Projects
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (proj: Project | null) => void;
  createProject: (name: string, description: string, aspectRatio?: any) => Project;
  updateProject: (proj: Project) => void;
  deleteProject: (id: string) => void;

  // Generation Form State
  genParams: GenerationParams;
  setGenParams: React.Dispatch<React.SetStateAction<GenerationParams>>;
  updateGenParams: (partial: Partial<GenerationParams>) => void;
  isEnhancingPrompt: boolean;
  enhancePrompt: () => Promise<void>;
  startGeneration: () => Promise<string | null>;

  // Jobs Queue & History
  jobs: GenerationJob[];
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;
  latestCompletedJob: GenerationJob | null;
  deleteJob: (id: string) => void;
  submitFeedback: (feedback: Omit<GenerationFeedback, 'submittedAt'>) => void;

  // Real Estate AI Workspace
  realEstateImages: string[];
  setRealEstateImages: React.Dispatch<React.SetStateAction<string[]>>;
  analyzedRooms: RoomItem[];
  setAnalyzedRooms: React.Dispatch<React.SetStateAction<RoomItem[]>>;
  isAnalyzingRealEstate: boolean;
  analyzeRealEstatePhotos: (images: string[], propertyType?: string) => Promise<void>;
  generateRealEstateStoryboard: () => Promise<void>;

  // Storyboard
  storyboardScenes: StoryboardScene[];
  setStoryboardScenes: React.Dispatch<React.SetStateAction<StoryboardScene[]>>;
  addStoryboardScene: (scene: Omit<StoryboardScene, 'id' | 'sceneNumber'>) => void;
  removeStoryboardScene: (id: string) => void;
  reorderStoryboardScenes: (startIndex: number, endIndex: number) => void;
  generateAllStoryboardScenes: () => Promise<void>;

  // Timeline Editor
  timelineTracks: TimelineTrack[];
  setTimelineTracks: React.Dispatch<React.SetStateAction<TimelineTrack[]>>;
  playheadPosition: number;
  setPlayheadPosition: (pos: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  selectedClipId: string | null;
  setSelectedClipId: (id: string | null) => void;
  addClipToTrack: (trackId: string, clip: Omit<TimelineClip, 'id' | 'trackId'>) => void;
  updateClip: (clipId: string, partial: Partial<TimelineClip>) => void;
  splitSelectedClip: () => void;
  duplicateSelectedClip: () => void;
  deleteSelectedClip: () => void;
  undoTimeline: () => void;
  redoTimeline: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Assets & Templates
  assets: ReferenceAsset[];
  addAsset: (asset: Omit<ReferenceAsset, 'id' | 'createdAt'>) => void;
  templates: VideoTemplate[];
  brandKit: BrandKitItem;
  updateBrandKit: (bk: Partial<BrandKitItem>) => void;

  // User & Subscription
  subscription: UserSubscription;
  updateSubscriptionPlan: (plan: UserSubscription['plan']) => void;

  // Modals & UI helpers
  comparisonItem: { beforeUrl: string; afterUrl: string; title: string } | null;
  setComparisonItem: (item: { beforeUrl: string; afterUrl: string; title: string } | null) => void;
  feedbackJob: GenerationJob | null;
  setFeedbackJob: (job: GenerationJob | null) => void;
  apiModalOpen: boolean;
  setApiModalOpen: (open: boolean) => void;
  shortcutsModalOpen: boolean;
  setShortcutsModalOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  toasts: Array<{ id: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }>;
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const DEFAULT_PARAMS: GenerationParams = {
  prompt: 'Mansão minimalista de luxo sobre falésia à beira-mar, reflexos dourados do pôr do sol na piscina infinita, lente 35mm, movimento suave de câmera avançando no ambiente.',
  negativePrompt: 'distorções, cintilação, arquitetura deformada, móveis flutuantes, aspecto plástico, saturação excessiva, bordas serrilhadas, movimento trêmulo',
  mode: 'text-to-video',
  provider: 'google-veo',
  modelTier: 'quality',
  aspectRatio: '16:9',
  resolution: '4K',
  isNativeResolution: false,
  fps: 24,
  quality: 'Cinema',
  durationSeconds: 6,
  camera: {
    movement: 'Dolly In',
    speed: 'Slow',
    stability: 'Smooth',
    lens: '35mm',
    depthOfField: 'Medium',
    zoomLevel: 1.0,
    focusDistance: 'Subject',
    cameraHeight: 'Eye level',
    fov: 65,
  },
  motion: {
    strength: 35,
    subjectMotion: 25,
    cameraMotion: 40,
    environmentMotion: 30,
  },
  realismStyle: 'Photorealistic',
  realismSliders: {
    realism: 98,
    textureDetail: 96,
    lightingAccuracy: 98,
    motionNaturalness: 95,
    physicsAccuracy: 97,
    faceConsistency: 92,
    environmentConsistency: 98,
  },
  preserveReference: 'Maximum',
  consistency: {
    characterLock: false,
    faceLock: false,
    objectLock: true,
    environmentLock: true,
    styleLock: true,
    cameraLock: true,
    seedLocked: true,
    seedValue: 489201,
  },
  audio: {
    enabled: true,
    type: 'Ambient Sound',
    prompt: 'Som ambiente acústico natural, brisa calma do oceano, tranquilidade e eco suave de espaço amplo',
    autoSync: true,
  },
  seed: 489201,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<NavSection>('home');

  // Internationalization (i18n) State - Defaults to pt-BR
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return detectBrowserLanguage();
  });

  const [regionalSettings, setRegionalSettings] = useState<RegionalSettings>(() => {
    const saved = localStorage.getItem('vision_ai_region');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const meta = LANGUAGES.find((l) => l.code === 'pt-BR') || LANGUAGES[0];
    return {
      region: meta.defaultRegion,
      dateFormat: meta.defaultDateFormat,
      timeFormat: meta.defaultTimeFormat,
      currency: meta.defaultCurrency,
      unitSystem: meta.defaultUnitSystem,
    };
  });

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('vision_ai_voice');
    return saved
      ? JSON.parse(saved)
      : {
          defaultVoiceLanguage: 'pt-BR',
          defaultAccent: 'Brasil (Neutro / Broadcast)',
          gender: 'female',
        };
  });

  const [subtitlesSettings, setSubtitlesSettings] = useState<SubtitlesSettings>(() => {
    const saved = localStorage.getItem('vision_ai_subtitles');
    return saved
      ? JSON.parse(saved)
      : {
          autoDetectLanguage: true,
          defaultSubtitleLanguage: 'pt-BR',
          includeTranslations: true,
          targetLanguages: ['en-US', 'es'],
        };
  });

  const [isTranslatingPrompt, setIsTranslatingPrompt] = useState(false);

  // Sync language and html direction attributes
  const currentLangMeta = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const isRtl = currentLangMeta.dir === 'rtl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    }
  }, [language, isRtl]);

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    localStorage.setItem('vision_ai_lang', newLang);

    // Also auto-adapt regional presets if user hasn't heavily customized
    const meta = LANGUAGES.find((l) => l.code === newLang);
    if (meta) {
      setRegionalSettings((prev) => ({
        ...prev,
        region: meta.defaultRegion,
        dateFormat: meta.defaultDateFormat,
        timeFormat: meta.defaultTimeFormat,
        currency: meta.defaultCurrency,
        unitSystem: meta.defaultUnitSystem,
      }));
    }
  };

  const updateRegionalSettings = (partial: Partial<RegionalSettings>) => {
    setRegionalSettings((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem('vision_ai_region', JSON.stringify(updated));
      return updated;
    });
  };

  const updateVoiceSettings = (partial: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem('vision_ai_voice', JSON.stringify(updated));
      return updated;
    });
  };

  const updateSubtitlesSettings = (partial: Partial<SubtitlesSettings>) => {
    setSubtitlesSettings((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem('vision_ai_subtitles', JSON.stringify(updated));
      return updated;
    });
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    return translate(language, key, params);
  };

  const formatDate = (date: string | Date | number, customFormat?: string): string => {
    return formatI18nDate(date, language, customFormat || regionalSettings.dateFormat);
  };

  const formatCurrency = (amount: number, customCurrency?: string): string => {
    return formatI18nCurrency(amount, language, customCurrency || regionalSettings.currency);
  };

  const formatNumber = (val: number): string => {
    return formatI18nNumber(val, language);
  };

  // Smart prompt translator (Translate to English for optimal AI generation, or Portuguese)
  const translatePrompt = async (targetLang: LanguageCode = 'en-US') => {
    if (!genParams.prompt.trim()) return;
    setIsTranslatingPrompt(true);
    try {
      // Simulate/perform prompt translation with AI enhancement
      const promptToTranslate = genParams.prompt;
      let translated = '';

      if (targetLang === 'en-US') {
        if (promptToTranslate.toLowerCase().includes('mansão') || promptToTranslate.toLowerCase().includes('casa')) {
          translated = 'Ultra-luxury modern minimalist mansion perched over ocean cliff, golden hour sun reflections on infinity pool, 35mm Master Prime lens, smooth cinematic dolly-in push, 4K architectural realism.';
        } else {
          translated = `Cinema-grade photorealistic scene: ${promptToTranslate}, 35mm anamorphic lens, realistic natural lighting, volumetric atmosphere, 24fps smooth motion.`;
        }
      } else if (targetLang === 'pt-BR') {
        translated = 'Mansão moderna de altíssimo luxo sobre penhasco à beira-mar, reflexos dourados da golden hour na piscina infinita, lente 35mm, movimento cinematográfico suave de avanço de câmera.';
      } else {
        translated = promptToTranslate;
      }

      setGenParams((prev) => ({
        ...prev,
        enhancedPrompt: translated,
      }));
      addToast(
        language === 'pt-BR'
          ? 'Prompt traduzido e otimizado com sucesso para o modelo neural!'
          : 'Prompt translated and optimized for neural model!',
        'success'
      );
    } catch (err: any) {
      addToast('Erro ao traduzir prompt: ' + err.message, 'error');
    } finally {
      setIsTranslatingPrompt(false);
    }
  };

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('vision_ai_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activeProject, setActiveProject] = useState<Project | null>(INITIAL_PROJECTS[0]);

  const [genParams, setGenParams] = useState<GenerationParams>(DEFAULT_PARAMS);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

  const [jobs, setJobs] = useState<GenerationJob[]>(() => {
    const saved = localStorage.getItem('vision_ai_jobs');
    return saved ? JSON.parse(saved) : INITIAL_GENERATIONS;
  });
  const [activeJobId, setActiveJobId] = useState<string | null>(INITIAL_GENERATIONS[0].id);

  // Real Estate state
  const [realEstateImages, setRealEstateImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [analyzedRooms, setAnalyzedRooms] = useState<RoomItem[]>([]);
  const [isAnalyzingRealEstate, setIsAnalyzingRealEstate] = useState(false);

  // Storyboard state
  const [storyboardScenes, setStoryboardScenes] = useState<StoryboardScene[]>([
    {
      id: 'sc-1',
      sceneNumber: 1,
      title: 'Fachada Principal Aérea',
      imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Abertura cinematográfica com luz matinal suave revelando a fachada de luxo com drone sweep estabilizado.',
      duration: 6,
      cameraMovement: 'Crane Down',
      speed: 'Slow',
      audioMood: 'Piano acústico suave com reverberação acolhedora',
      status: 'ready',
      generatedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxurious-modern-house-41218-large.mp4',
    },
    {
      id: 'sc-2',
      sceneNumber: 2,
      title: 'Entrada e Sala Pé Direito Duplo',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Deslizamento suave pelo hall de entrada em direção à sala ampla integrada com luz solar natural.',
      duration: 6,
      cameraMovement: 'Dolly In',
      speed: 'Slow',
      audioMood: 'Acústico caloroso e sutil',
      status: 'ready',
      generatedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-living-room-and-kitchen-41221-large.mp4',
    },
    {
      id: 'sc-3',
      sceneNumber: 3,
      title: 'Piscina e Deck ao Entardecer',
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Órbita suave ao redor da piscina com iluminação perimetral acesa na hora de ouro.',
      duration: 8,
      cameraMovement: 'Orbit Right',
      speed: 'Slow',
      audioMood: 'Clímax ambiente sereno',
      status: 'ready',
      generatedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-home-with-swimming-pool-and-deck-41219-large.mp4',
    },
  ]);

  // Timeline Editor state
  const [timelineTracks, setTimelineTracks] = useState<TimelineTrack[]>(() => {
    return activeProject?.tracks || INITIAL_PROJECTS[0].tracks;
  });
  const [timelineHistory, setTimelineHistory] = useState<TimelineTrack[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-1');

  // Assets & templates
  const [assets, setAssets] = useState<ReferenceAsset[]>(SAMPLE_ASSETS);
  const [templates] = useState<VideoTemplate[]>(SAMPLE_TEMPLATES);
  const [brandKit, setBrandKit] = useState<BrandKitItem>(INITIAL_BRAND_KIT);
  const [subscription, setSubscription] = useState<UserSubscription>(INITIAL_SUBSCRIPTION);

  // Modals & UI helpers
  const [comparisonItem, setComparisonItem] = useState<{ beforeUrl: string; afterUrl: string; title: string } | null>(null);
  const [feedbackJob, setFeedbackJob] = useState<GenerationJob | null>(null);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }>>([]);

  const addToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Sync projects and jobs to localStorage
  useEffect(() => {
    localStorage.setItem('vision_ai_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('vision_ai_jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Sync active project tracks when project changes
  useEffect(() => {
    if (activeProject) {
      setTimelineTracks(activeProject.tracks || []);
    }
  }, [activeProject?.id]);

  // Push timeline history for undo/redo
  const pushTimelineState = (newTracks: TimelineTrack[]) => {
    const newHist = timelineHistory.slice(0, historyIndex + 1);
    newHist.push(JSON.parse(JSON.stringify(newTracks)));
    setTimelineHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setTimelineTracks(newTracks);
  };

  const undoTimeline = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setTimelineTracks(JSON.parse(JSON.stringify(timelineHistory[historyIndex - 1])));
    }
  };

  const redoTimeline = () => {
    if (historyIndex < timelineHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setTimelineTracks(JSON.parse(JSON.stringify(timelineHistory[historyIndex + 1])));
    }
  };

  // Live polling for running jobs
  useEffect(() => {
    const runningJobs = jobs.filter((j) => j.status !== 'Completed' && j.status !== 'Failed');
    if (runningJobs.length === 0) return;

    const interval = setInterval(async () => {
      for (const job of runningJobs) {
        try {
          const updated = await apiService.getJobStatus(job.id);
          setJobs((prev) =>
            prev.map((j) => {
              if (j.id === job.id) {
                if (j.status !== updated.status && updated.status === 'Completed') {
                  addToast(`Renderização concluída: "${updated.params?.prompt?.substring(0, 30)}..."`, 'success');
                }
                return updated;
              }
              return j;
            })
          );
        } catch {
          // ignore transient poll error
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [jobs]);

  // Enhance prompt action
  const enhancePrompt = async () => {
    if (!genParams.prompt.trim()) return;
    setIsEnhancingPrompt(true);
    try {
      const res = await apiService.enhancePrompt({
        prompt: genParams.prompt,
        mode: genParams.mode,
        camera: genParams.camera.movement,
        lens: genParams.camera.lens,
        realism: genParams.realismStyle,
      });
      setGenParams((prev) => ({
        ...prev,
        enhancedPrompt: res.enhancedPrompt,
      }));
      addToast('Prompt cinematográfico aprimorado com sucesso!', 'success');
    } catch (err: any) {
      addToast('Erro ao aprimorar prompt: ' + err.message, 'error');
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Start Generation action
  const startGeneration = async (): Promise<string | null> => {
    try {
      const activePrompt = genParams.enhancedPrompt || genParams.prompt;
      if (!activePrompt.trim()) {
        addToast('Por favor, digite um prompt para continuar.', 'warning');
        return null;
      }

      // Decrement credits
      const cost = Math.max(1, Math.round(genParams.durationSeconds * 1.5));
      setSubscription((prev) => ({
        ...prev,
        creditsRemaining: Math.max(0, prev.creditsRemaining - cost),
        generationsThisMonth: prev.generationsThisMonth + 1,
      }));

      const res = await apiService.generateVideo({
        ...genParams,
        projectId: activeProject?.id,
      });

      const newJob: GenerationJob = {
        id: res.jobId,
        projectId: activeProject?.id,
        createdAt: new Date().toISOString(),
        status: 'Queued',
        progress: 5,
        statusMessage: 'Iniciando pipeline neural...',
        params: { ...genParams },
        renderingEngine: genParams.provider === 'google-veo' ? 'Veo 3.1 Pro Neural Pipeline' : `${genParams.provider} Cinema Engine`,
        providerUsed: genParams.provider,
        costCredits: cost,
      };

      setJobs((prev) => [newJob, ...prev]);
      setActiveJobId(res.jobId);
      addToast('Job de vídeo enfileirado no cluster neural!', 'info');
      return res.jobId;
    } catch (err: any) {
      addToast('Falha ao iniciar geração: ' + err.message, 'error');
      return null;
    }
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (activeJobId === id) {
      const remaining = jobs.filter((j) => j.id !== id);
      setActiveJobId(remaining.length > 0 ? remaining[0].id : null);
    }
    addToast('Geração excluída do histórico', 'info');
  };

  const submitFeedback = (feedback: Omit<GenerationFeedback, 'submittedAt'>) => {
    addToast('Feedback enviado! Obrigado por ajudar a calibrar os modelos.', 'success');
    setFeedbackJob(null);
  };

  // Real Estate auto analyzer
  const analyzeRealEstatePhotos = async (images: string[], propertyType?: string) => {
    setIsAnalyzingRealEstate(true);
    try {
      const res = await apiService.analyzeRealEstate(images, propertyType);
      setAnalyzedRooms(res.rooms);
      addToast(`${res.roomsDetected} ambientes identificados com preservação estrutural máxima!`, 'success');
    } catch (err: any) {
      addToast('Erro na análise de imóveis: ' + err.message, 'error');
    } finally {
      setIsAnalyzingRealEstate(false);
    }
  };

  const generateRealEstateStoryboard = async () => {
    if (analyzedRooms.length === 0) {
      addToast('Faça o upload e análise das fotos primeiro.', 'warning');
      return;
    }
    const newScenes: StoryboardScene[] = analyzedRooms
      .filter((r) => r.selected)
      .map((r, i) => ({
        id: `sc-re-${Date.now()}-${i}`,
        sceneNumber: i + 1,
        title: r.label,
        imageUrl: r.imageUrl,
        prompt: r.promptGenerated || `Cinematic luxury tour of ${r.label.toLowerCase()}`,
        duration: r.suggestedDuration,
        cameraMovement: r.recommendedMovement,
        speed: 'Slow',
        audioMood: 'Soft ambient piano & natural room resonance',
        status: 'ready',
      }));
    setStoryboardScenes(newScenes);
    setActiveSection('storyboard');
    addToast('Roteiro cinematográfico imobiliário gerado no Storyboard!', 'success');
  };

  // Storyboard helpers
  const addStoryboardScene = (scene: Omit<StoryboardScene, 'id' | 'sceneNumber'>) => {
    const newScene: StoryboardScene = {
      ...scene,
      id: `scene-${Date.now()}`,
      sceneNumber: storyboardScenes.length + 1,
    };
    setStoryboardScenes((prev) => [...prev, newScene]);
    addToast('Cena adicionada ao storyboard', 'info');
  };

  const removeStoryboardScene = (id: string) => {
    setStoryboardScenes((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, sceneNumber: idx + 1 }))
    );
  };

  const reorderStoryboardScenes = (startIndex: number, endIndex: number) => {
    const result: StoryboardScene[] = [...storyboardScenes];
    const [removed] = result.splice(startIndex, 1);
    if (!removed) return;
    result.splice(endIndex, 0, removed);
    setStoryboardScenes(result.map((s, idx) => ({ ...s, sceneNumber: idx + 1 })));
  };

  const generateAllStoryboardScenes = async () => {
    addToast(`Iniciando geração em lote de ${storyboardScenes.length} tomadas cinematográficas...`, 'info');
    for (const scene of storyboardScenes) {
      await apiService.generateVideo({
        ...DEFAULT_PARAMS,
        prompt: scene.prompt,
        durationSeconds: scene.duration,
        camera: {
          ...DEFAULT_PARAMS.camera,
          movement: scene.cameraMovement,
          speed: scene.speed,
        },
        initialImageUrl: scene.imageUrl,
      });
    }
  };

  // Project helpers
  const createProject = (name: string, description: string, aspectRatio: AspectRatio = '16:9'): Project => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aspectRatio,
      resolution: '4K',
      fps: 24,
      tags: ['New Project', 'VISION AI'],
      generationsCount: 0,
      status: 'active',
      tracks: [
        {
          id: 'track-v1',
          name: 'Video Track 1',
          type: 'video',
          muted: false,
          locked: false,
          visible: true,
          clips: [],
        },
        {
          id: 'track-a1',
          name: 'Audio / Ambient',
          type: 'audio',
          muted: false,
          locked: false,
          visible: true,
          clips: [],
        },
        {
          id: 'track-m1',
          name: 'Music Score',
          type: 'music',
          muted: false,
          locked: false,
          visible: true,
          clips: [],
        },
      ],
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    addToast(`Projeto "${name}" criado com sucesso!`, 'success');
    return newProj;
  };

  const updateProject = (proj: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === proj.id ? { ...proj, updatedAt: new Date().toISOString() } : p)));
    if (activeProject?.id === proj.id) {
      setActiveProject(proj);
    }
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setActiveProject(remaining.length > 0 ? remaining[0] : null);
    }
    addToast('Projeto removido', 'info');
  };

  // Timeline Clip manipulation
  const addClipToTrack = (trackId: string, clipData: Omit<TimelineClip, 'id' | 'trackId'>) => {
    const newClip: TimelineClip = {
      ...clipData,
      id: `clip-${Date.now()}`,
      trackId,
    };
    const updated = timelineTracks.map((t) => {
      if (t.id === trackId) {
        return { ...t, clips: [...t.clips, newClip] };
      }
      return t;
    });
    pushTimelineState(updated);
    setSelectedClipId(newClip.id);
    addToast(`Clip "${clipData.title}" adicionado à timeline`, 'info');
  };

  const updateClip = (clipId: string, partial: Partial<TimelineClip>) => {
    const updated = timelineTracks.map((t) => ({
      ...t,
      clips: t.clips.map((c) => (c.id === clipId ? { ...c, ...partial } : c)),
    }));
    pushTimelineState(updated);
  };

  const splitSelectedClip = () => {
    if (!selectedClipId) return;
    let found = false;
    const updated = timelineTracks.map((t) => ({
      ...t,
      clips: t.clips.flatMap((c) => {
        if (c.id === selectedClipId && playheadPosition > c.startTime && playheadPosition < c.startTime + c.duration) {
          found = true;
          const firstDuration = playheadPosition - c.startTime;
          const secondDuration = c.duration - firstDuration;
          const clipA: TimelineClip = {
            ...c,
            id: `clip-${Date.now()}-a`,
            duration: firstDuration,
          };
          const clipB: TimelineClip = {
            ...c,
            id: `clip-${Date.now()}-b`,
            startTime: playheadPosition,
            duration: secondDuration,
            sourceStartTime: c.sourceStartTime + firstDuration,
          };
          return [clipA, clipB];
        }
        return [c];
      }),
    }));
    if (found) {
      pushTimelineState(updated);
      addToast('Clip dividido no playhead (Split)', 'info');
    } else {
      addToast('Posicione o playhead dentro do clip selecionado para dividir', 'warning');
    }
  };

  const duplicateSelectedClip = () => {
    if (!selectedClipId) return;
    let newId: string | null = null;
    const updated = timelineTracks.map((t) => {
      const clip = t.clips.find((c) => c.id === selectedClipId);
      if (clip) {
        newId = `clip-${Date.now()}-copy`;
        const copy: TimelineClip = {
          ...clip,
          id: newId,
          title: `${clip.title} (Copy)`,
          startTime: clip.startTime + clip.duration + 0.5,
        };
        return { ...t, clips: [...t.clips, copy] };
      }
      return t;
    });
    if (newId) {
      pushTimelineState(updated);
      setSelectedClipId(newId);
      addToast('Clip duplicado na timeline', 'info');
    }
  };

  const deleteSelectedClip = () => {
    if (!selectedClipId) return;
    const updated = timelineTracks.map((t) => ({
      ...t,
      clips: t.clips.filter((c) => c.id !== selectedClipId),
    }));
    pushTimelineState(updated);
    setSelectedClipId(null);
    addToast('Clip removido da timeline', 'info');
  };

  // Assets & brand kit helpers
  const addAsset = (assetData: Omit<ReferenceAsset, 'id' | 'createdAt'>) => {
    const newAsset: ReferenceAsset = {
      ...assetData,
      id: `asset-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAssets((prev) => [newAsset, ...prev]);
    addToast(`Ativo "${assetData.name}" salvo na biblioteca de referências!`, 'success');
  };

  const updateBrandKit = (bk: Partial<BrandKitItem>) => {
    setBrandKit((prev) => ({ ...prev, ...bk }));
    addToast('Brand Kit atualizado com sucesso!', 'success');
  };

  const updateSubscriptionPlan = (plan: UserSubscription['plan']) => {
    setSubscription((prev) => ({
      ...prev,
      plan,
      totalMonthlyCredits: plan === 'Unlimited' ? 999999 : plan === 'Studio' ? 5000 : plan === 'Pro' ? 2000 : plan === 'Creator' ? 800 : 150,
      creditsRemaining: plan === 'Unlimited' ? 999999 : plan === 'Studio' ? 4850 : 1500,
    }));
    addToast(`Plano atualizado para ${plan}!`, 'success');
  };

  const updateGenParams = (partial: Partial<GenerationParams>) => {
    setGenParams((prev) => ({ ...prev, ...partial }));
  };

  const latestCompletedJob = jobs.find((j) => j.status === 'Completed') || null;

  return (
    <AppContext.Provider
      value={{
        activeSection,
        setActiveSection,
        language,
        setLanguage,
        t,
        regionalSettings,
        updateRegionalSettings,
        voiceSettings,
        updateVoiceSettings,
        subtitlesSettings,
        updateSubtitlesSettings,
        formatDate,
        formatCurrency,
        formatNumber,
        isRtl,
        isTranslatingPrompt,
        translatePrompt,
        projects,
        activeProject,
        setActiveProject,
        createProject,
        updateProject,
        deleteProject,
        genParams,
        setGenParams,
        updateGenParams,
        isEnhancingPrompt,
        enhancePrompt,
        startGeneration,
        jobs,
        activeJobId,
        setActiveJobId,
        latestCompletedJob,
        deleteJob,
        submitFeedback,
        realEstateImages,
        setRealEstateImages,
        analyzedRooms,
        setAnalyzedRooms,
        isAnalyzingRealEstate,
        analyzeRealEstatePhotos,
        generateRealEstateStoryboard,
        storyboardScenes,
        setStoryboardScenes,
        addStoryboardScene,
        removeStoryboardScene,
        reorderStoryboardScenes,
        generateAllStoryboardScenes,
        timelineTracks,
        setTimelineTracks,
        playheadPosition,
        setPlayheadPosition,
        isPlaying,
        setIsPlaying,
        zoomLevel,
        setZoomLevel,
        selectedClipId,
        setSelectedClipId,
        addClipToTrack,
        updateClip,
        splitSelectedClip,
        duplicateSelectedClip,
        deleteSelectedClip,
        undoTimeline,
        redoTimeline,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < timelineHistory.length - 1,
        assets,
        addAsset,
        templates,
        brandKit,
        updateBrandKit,
        subscription,
        updateSubscriptionPlan,
        comparisonItem,
        setComparisonItem,
        feedbackJob,
        setFeedbackJob,
        apiModalOpen,
        setApiModalOpen,
        shortcutsModalOpen,
        setShortcutsModalOpen,
        onboardingOpen,
        setOnboardingOpen,
        toasts,
        addToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

import React, { useState } from 'react';
import {
  Wand2,
  Image,
  Video,
  Film,
  Sparkles,
  ArrowRight,
  Maximize2,
  Plus,
  Play,
  Clock,
  Layers,
  ChevronRight,
  Compass,
  Building2,
  FolderOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GenerationMode } from '../../types';
import { VeloraSymbol } from '../brand/VeloraLogo';

export const HomeView: React.FC = () => {
  const {
    projects,
    setActiveProject,
    jobs,
    subscription,
    setActiveSection,
    updateGenParams,
    genParams,
    enhancePrompt,
    isEnhancingPrompt,
    startGeneration,
    setComparisonItem,
    addToast,
    t,
    language
  } = useApp();

  const [quickPrompt, setQuickPrompt] = useState(genParams.prompt);
  const [selectedFormat, setSelectedFormat] = useState<'16:9' | '9:16' | '1:1' | '21:9'>(genParams.aspectRatio || '16:9');
  const [selectedDuration, setSelectedDuration] = useState<5 | 10 | 15>(genParams.durationSeconds || 5);
  const [selectedQuality, setSelectedQuality] = useState<'1080p' | '4K' | '8K'>((genParams.resolution as any) || '4K');
  const [selectedModel, setSelectedModel] = useState<string>(genParams.provider || 'google-veo');

  const actionShortcuts: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    mode: GenerationMode;
    targetSec: any;
  }> = [
    { id: 'img2vid', label: 'Imagem → Vídeo', icon: Image, mode: 'image-to-video', targetSec: 'generate' },
    { id: 'txt2vid', label: 'Texto → Vídeo', icon: Wand2, mode: 'text-to-video', targetSec: 'generate' },
    { id: 'vid2vid', label: 'Vídeo → Vídeo', icon: Video, mode: 'video-to-video', targetSec: 'generate' },
    { id: 'ai-edit', label: 'Editar com IA', icon: Film, mode: 'text-to-video', targetSec: 'editor' },
    { id: 'real-estate', label: 'Tour Imobiliário', icon: Building2, mode: 'real-estate-ai', targetSec: 'real-estate' },
    { id: 'enhance', label: 'Aprimorar 8K', icon: Sparkles, mode: 'text-to-video', targetSec: 'enhance' },
  ];

  const handleQuickGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    updateGenParams({
      prompt: quickPrompt,
      aspectRatio: selectedFormat,
      durationSeconds: selectedDuration,
      resolution: selectedQuality as any,
      provider: selectedModel as any,
    });
    setActiveSection('generate');
    await startGeneration();
  };

  const handleShortcutClick = (shortcut: typeof actionShortcuts[0]) => {
    updateGenParams({ mode: shortcut.mode });
    setActiveSection(shortcut.targetSec);
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-6xl mx-auto space-y-12 select-none">
      {/* Hero Section */}
      <div className="text-center space-y-3 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-xs text-zinc-400 font-mono">
          <VeloraSymbol size={13} variant="accent" />
          <span>VELORA STUDIO 3.0</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {language === 'pt-BR' ? 'Crie algo extraordinário.' : 'Create something extraordinary.'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          {language === 'pt-BR'
            ? 'Transforme ideias em movimento com precisão de estúdio, controle de câmera e fidelidade cinematográfica.'
            : 'Transform ideas into motion with studio precision, camera trajectory control, and cinematic fidelity.'}
        </p>
      </div>

      {/* Central Quick Create Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-4 sm:p-5 shadow-2xl space-y-4">
        <form onSubmit={handleQuickGenerate} className="space-y-3">
          <div className="relative">
            <textarea
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder={
                language === 'pt-BR'
                  ? 'Descreva o vídeo que você quer criar (ex: Plano aéreo cinematográfico sobre falésia litorânea ao entardecer, lente 35mm, movimento suave avançando)...'
                  : 'Describe the video you want to create (e.g. Cinematic anamorphic wide shot of coastal villa at sunset, 35mm lens, gentle push in)...'
              }
              rows={3}
              className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-violet-500 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Quick Settings Pills & Primary CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Aspect Ratio Pill */}
              <div className="flex items-center rounded-lg bg-white/[0.03] border border-white/[0.06] p-0.5">
                {(['16:9', '9:16', '1:1', '21:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(ratio);
                      updateGenParams({ aspectRatio: ratio });
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      selectedFormat === ratio
                        ? 'bg-white/[0.1] text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              {/* Duration Pill */}
              <div className="flex items-center rounded-lg bg-white/[0.03] border border-white/[0.06] p-0.5">
                {([5, 10, 15] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      setSelectedDuration(dur);
                      updateGenParams({ durationSeconds: dur });
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      selectedDuration === dur
                        ? 'bg-white/[0.1] text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>

              {/* Quality Pill */}
              <div className="flex items-center rounded-lg bg-white/[0.03] border border-white/[0.06] p-0.5">
                {(['1080p', '4K', '8K'] as const).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => {
                      setSelectedQuality(res);
                      updateGenParams({ resolution: res });
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      selectedQuality === res
                        ? 'bg-white/[0.1] text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Enhance Prompt & Generate Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  updateGenParams({ prompt: quickPrompt });
                  await enhancePrompt();
                  if (genParams.enhancedPrompt) {
                    setQuickPrompt(genParams.enhancedPrompt);
                  }
                }}
                disabled={isEnhancingPrompt || !quickPrompt.trim()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] text-zinc-300 text-xs font-medium transition-all disabled:opacity-40"
                title="Aprimorar prompt com cinematografia profissional"
              >
                <Sparkles className={`w-3.5 h-3.5 text-violet-400 ${isEnhancingPrompt ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isEnhancingPrompt ? t('generate.enhancing') : t('generate.enhancePrompt')}
                </span>
              </button>

              <button
                type="submit"
                disabled={!quickPrompt.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{language === 'pt-BR' ? 'Gerar Vídeo' : 'Generate Video'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Action Shortcuts Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono tracking-wider uppercase">
          <span>{language === 'pt-BR' ? 'Ações Rápidas' : 'Quick Actions'}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {actionShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleShortcutClick(item)}
                className="p-3 rounded-xl bg-[#111113] hover:bg-[#171719] border border-white/[0.06] hover:border-white/[0.12] text-left transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-violet-500/40 transition-colors">
                  <Icon className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                    {item.label}
                  </span>
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Generations & Visual Project Reel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              {language === 'pt-BR' ? 'Projetos e Gerações Recentes' : 'Recent Projects & Generations'}
            </h2>
          </div>
          <button
            onClick={() => setActiveSection('history')}
            className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
          >
            <span>{t('home.viewAll')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/[0.06] bg-[#111113] text-center space-y-3">
            <VeloraSymbol size={32} className="mx-auto text-zinc-600" />
            <h3 className="text-sm font-semibold text-zinc-300">
              {language === 'pt-BR' ? 'Nenhum projeto gerado ainda.' : 'No projects generated yet.'}
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {language === 'pt-BR'
                ? 'Insira um prompt acima ou escolha uma das ações rápidas para criar sua primeira cena.'
                : 'Enter a prompt above or choose one of the quick actions to create your first scene.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.slice(0, 6).map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-white/[0.07] bg-[#111113] hover:border-white/[0.14] overflow-hidden group transition-all flex flex-col justify-between"
              >
                {/* Visual Thumbnail / Preview */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  {job.status === 'Completed' && job.resultVideoUrl ? (
                    <video
                      src={job.resultVideoUrl}
                      poster={job.thumbnailUrl}
                      muted
                      loop
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-zinc-950 text-center">
                      <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mb-2" />
                      <span className="text-xs font-mono text-violet-300 font-bold">{job.status} ({job.progress}%)</span>
                      <span className="text-[10px] text-zinc-400 mt-1 max-w-[180px] truncate">{job.statusMessage}</span>
                    </div>
                  )}

                  {/* Metadata Tag */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                    {job.params.durationSeconds}s • {job.params.resolution}
                  </div>

                  {/* Provider Engine */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-white/[0.08] backdrop-blur-md text-[10px] font-mono text-zinc-200 border border-white/10">
                    {job.providerUsed.replace('google-', '').toUpperCase()}
                  </div>
                </div>

                {/* Info & Secondary Hover Actions */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {job.params.prompt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px]">
                    <span className="text-zinc-400 font-mono">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>

                    {job.status === 'Completed' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (job.thumbnailUrl && job.resultVideoUrl) {
                              setComparisonItem({
                                beforeUrl: job.params.initialImageUrl || job.thumbnailUrl,
                                afterUrl: job.thumbnailUrl,
                                title: job.params.prompt,
                              });
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
                          title="Comparar com Original"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setActiveSection('editor');
                            addToast('Cena transferida para a timeline!', 'success');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] text-[10px] font-medium transition-colors"
                        >
                          {language === 'pt-BR' ? 'Abrir no Editor' : 'Open in Editor'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

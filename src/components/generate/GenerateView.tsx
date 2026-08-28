import React, { useState } from 'react';
import {
  Wand2,
  Image,
  Video,
  Layers,
  Sparkles,
  Camera,
  Compass,
  Sliders,
  Shield,
  Volume2,
  Play,
  RotateCcw,
  Maximize2,
  Film,
  ChevronDown,
  ChevronUp,
  Repeat,
  UploadCloud,
  Languages,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  GenerationMode,
  CameraMovement,
  CameraLens,
  VideoProvider
} from '../../types';
import { VeloraAnimatedSymbol } from '../brand/VeloraLogo';

export const GenerateView: React.FC = () => {
  const {
    genParams,
    updateGenParams,
    enhancePrompt,
    isEnhancingPrompt,
    startGeneration,
    jobs,
    activeJobId,
    setActiveJobId,
    setComparisonItem,
    setFeedbackJob,
    setActiveSection,
    addToast,
    language,
    t,
    translatePrompt,
    isTranslatingPrompt,
  } = useApp();

  // Accordion states for progressive disclosure
  const [cameraOpen, setCameraOpen] = useState(true);
  const [motionOpen, setMotionOpen] = useState(false);
  const [realismOpen, setRealismOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [negativeOpen, setNegativeOpen] = useState(false);

  // Extend video
  const [extendSeconds, setExtendSeconds] = useState(5);

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0] || null;

  const handleModeChange = (mode: GenerationMode) => {
    updateGenParams({ mode });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'initialImageUrl' | 'endImageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          updateGenParams({ [field]: ev.target.result as string });
          addToast('Referência carregada com sucesso.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDispatch = async () => {
    const jobId = await startGeneration();
    if (jobId) {
      setActiveJobId(jobId);
    }
  };

  const cameraMovements: CameraMovement[] = [
    'Static',
    'Dolly In',
    'Dolly Out',
    'Pan Left',
    'Pan Right',
    'Tilt Up',
    'Tilt Down',
    'Orbit Left',
    'Orbit Right',
    'Drone',
    'Tracking Shot',
    'Handheld Cinematic',
  ];

  const cameraLenses: CameraLens[] = [
    '14mm',
    '24mm',
    '35mm',
    '50mm',
    '85mm',
    'Anamorphic 2.39:1',
  ];

  const negativePresets = [
    'deformidades, mãos distorcidas',
    'flicker, ruído digital, jitter',
    'objetos flutuantes sem física',
    'textura plástica artificial',
    'artefatos de compressão, blur indesejado',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 select-none">
      {/* Top Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
        <div className="flex rounded-xl bg-[#111113] border border-white/[0.08] p-1">
          {(
            [
              { id: 'text-to-video', label: 'Texto → Vídeo', icon: Wand2 },
              { id: 'image-to-video', label: 'Imagem → Vídeo', icon: Image },
              { id: 'video-to-video', label: 'Vídeo → Vídeo', icon: Video },
              { id: 'multi-reference', label: 'Multi-Referência', icon: Layers },
            ] as const
          ).map((m) => {
            const Icon = m.icon;
            const active = genParams.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-white/[0.08] text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-violet-400' : 'text-zinc-400'}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span>Engine:</span>
          <span className="text-zinc-200 font-semibold px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            {genParams.modelEngine?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Studio Workspace Grid: Center Stage & Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center 7 Cols: Video Preview Stage & Prompt Box */}
        <div className="lg:col-span-7 space-y-4">
          {/* Reference Upload Box (When Image/Video mode selected) */}
          {genParams.mode !== 'text-to-video' && (
            <div className="rounded-xl border border-white/[0.08] bg-[#111113] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200 flex items-center gap-2">
                  <Image className="w-3.5 h-3.5 text-violet-400" />
                  Mídias de Referência
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Fidelidade:</span>
                  <select
                    value={genParams.preserveReference}
                    onChange={(e) => updateGenParams({ preserveReference: e.target.value as any })}
                    className="bg-white/[0.04] border border-white/[0.08] text-[11px] text-zinc-200 rounded px-2 py-0.5 focus:outline-none"
                  >
                    <option value="Low" className="bg-[#111113]">Baixa (Liberdade Criativa)</option>
                    <option value="Medium" className="bg-[#111113]">Média (Equilibrada)</option>
                    <option value="High" className="bg-[#111113]">Alta (Alta Preservação)</option>
                    <option value="Maximum" className="bg-[#111113]">Máxima (Fiel ao Original)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Start Frame */}
                <div className="relative border border-dashed border-white/[0.12] hover:border-violet-500/50 rounded-xl p-3 flex flex-col items-center justify-center text-center group cursor-pointer transition-colors bg-white/[0.01]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'initialImageUrl')}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {genParams.initialImageUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <img src={genParams.initialImageUrl} alt="Quadro Inicial" className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-black/70 px-2 py-0.5 rounded text-[9px] font-mono text-zinc-200">
                        Quadro Inicial
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 space-y-1.5">
                      <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-violet-400 mx-auto transition-colors" />
                      <div className="text-xs font-medium text-zinc-300">Carregar Imagem Inicial</div>
                      <div className="text-[10px] text-zinc-500">JPG, PNG até 50MB</div>
                    </div>
                  )}
                </div>

                {/* End Frame (Optional Interpolation) */}
                <div className="relative border border-dashed border-white/[0.12] hover:border-violet-500/50 rounded-xl p-3 flex flex-col items-center justify-center text-center group cursor-pointer transition-colors bg-white/[0.01]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'endImageUrl')}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {genParams.endImageUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <img src={genParams.endImageUrl} alt="Quadro Final" className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-black/70 px-2 py-0.5 rounded text-[9px] font-mono text-zinc-200">
                        Quadro Final
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 space-y-1.5">
                      <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-violet-400 mx-auto transition-colors" />
                      <div className="text-xs font-medium text-zinc-300">Carregar Imagem Final (Opcional)</div>
                      <div className="text-[10px] text-zinc-500">Transição morfológica contínua</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Cinematic Video Stage */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] overflow-hidden shadow-2xl">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {activeJob?.status === 'Completed' && activeJob.resultVideoUrl ? (
                <video
                  src={activeJob.resultVideoUrl}
                  poster={activeJob.thumbnailUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              ) : activeJob && activeJob.status !== 'Failed' ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-sm">
                  <VeloraAnimatedSymbol size={40} />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-white tracking-wide">
                      {activeJob.statusMessage || 'Processando renderização cinematográfica...'}
                    </span>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Progresso: {activeJob.progress}%
                    </p>
                  </div>
                  <div className="w-48 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all duration-300"
                      style={{ width: `${activeJob.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-2 text-zinc-400">
                  <Play className="w-8 h-8 text-zinc-400 mb-1" />
                  <span className="text-xs font-medium text-zinc-400">Nenhum vídeo em reprodução</span>
                  <p className="text-[11px] text-zinc-400">Defina os parâmetros e clique em Gerar Vídeo para visualizar aqui.</p>
                </div>
              )}

              {/* Stage Overlay Badges */}
              {activeJob && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-200">
                  {activeJob.params.durationSeconds}s • {activeJob.params.resolution} • {activeJob.params.fps} FPS
                </div>
              )}
            </div>

            {/* Post Render Toolbar */}
            {activeJob?.status === 'Completed' && (
              <div className="p-3 border-t border-white/[0.06] bg-[#0E0E10] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (activeJob.thumbnailUrl && activeJob.resultVideoUrl) {
                        setComparisonItem({
                          beforeUrl: activeJob.params.initialImageUrl || activeJob.thumbnailUrl,
                          afterUrl: activeJob.thumbnailUrl,
                          title: activeJob.params.prompt,
                        });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 hover:text-white transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Comparar</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection('editor');
                      addToast('Cena adicionada à timeline do editor!', 'success');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 hover:text-white transition-colors"
                  >
                    <Film className="w-3.5 h-3.5 text-violet-400" />
                    <span>Abrir na Timeline</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      addToast(`Continuando cena (+${extendSeconds}s) com coerência neural...`, 'info');
                      await startGeneration();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 transition-colors font-medium"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Estender (+{extendSeconds}s)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Large Prompt Input Console */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                {language === 'pt-BR' ? 'Prompt Cinematográfico' : 'Cinematic Prompt'}
              </label>
              <div className="flex items-center gap-2">
                {/* Translate Button */}
                <button
                  type="button"
                  onClick={() => translatePrompt(genParams.prompt, 'en')}
                  disabled={isTranslatingPrompt || !genParams.prompt.trim()}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-40"
                  title="Traduzir prompt para inglês técnico de IA"
                >
                  <Languages className="w-3 h-3" />
                  <span>{isTranslatingPrompt ? 'Traduzindo...' : 'Traduzir EN'}</span>
                </button>

                {/* Enhance Prompt Button */}
                <button
                  type="button"
                  onClick={enhancePrompt}
                  disabled={isEnhancingPrompt || !genParams.prompt.trim()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] text-violet-300 transition-colors disabled:opacity-40"
                >
                  <Sparkles className={`w-3 h-3 text-violet-400 ${isEnhancingPrompt ? 'animate-spin' : ''}`} />
                  <span>{isEnhancingPrompt ? 'Otimizando...' : 'Aprimorar com IA'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={genParams.prompt}
              onChange={(e) => updateGenParams({ prompt: e.target.value })}
              placeholder={
                language === 'pt-BR'
                  ? 'Ex: Cena cinematográfica 35mm em plano médio com iluminação suave lateral de fim de tarde, câmera em movimento Dolly In lento...'
                  : 'E.g., Cinematic 35mm medium shot with soft late afternoon rim lighting, slow dolly in camera movement...'
              }
              rows={3}
              className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-violet-500 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none leading-relaxed"
            />

            {/* Primary Generate CTA */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-zinc-400 font-mono">
                Custo estimado: <span className="text-zinc-200 font-bold">1 Crédito</span>
              </div>

              <button
                onClick={handleDispatch}
                disabled={!genParams.prompt.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{language === 'pt-BR' ? 'Gerar Vídeo' : 'Generate Video'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Parameters & Studio Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Core Settings Panel */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-4 space-y-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Parâmetros Principais
            </h3>

            {/* Model Selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Motor Neural (Model)</label>
              <select
                value={genParams.modelEngine}
                onChange={(e) => updateGenParams({ modelEngine: e.target.value as any })}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="veo-3.1-cinema" className="bg-[#111113]">Google Veo 3.1 Pro (Cinema Quality)</option>
                <option value="runway-gen3-alpha" className="bg-[#111113]">Runway Gen-3 Alpha Turbo</option>
                <option value="luma-dream-machine" className="bg-[#111113]">Luma Ray 2.0 (High Realism)</option>
                <option value="kling-ai-v15" className="bg-[#111113]">Kling 1.5 HD (Fluid Motion)</option>
              </select>
            </div>

            {/* Duration & Resolution */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Duração</label>
                <div className="flex rounded-lg bg-white/[0.02] border border-white/[0.06] p-0.5">
                  {([5, 10, 15] as const).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => updateGenParams({ durationSeconds: dur })}
                      className={`flex-1 py-1 text-center text-xs font-mono rounded-md transition-colors ${
                        genParams.durationSeconds === dur
                          ? 'bg-white/[0.1] text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Resolução</label>
                <div className="flex rounded-lg bg-white/[0.02] border border-white/[0.06] p-0.5">
                  {(['1080p', '4K', '8K'] as const).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => updateGenParams({ resolution: res })}
                      className={`flex-1 py-1 text-center text-xs font-mono rounded-md transition-colors ${
                        genParams.resolution === res
                          ? 'bg-white/[0.1] text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Proporção (Aspect Ratio)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['16:9', '9:16', '1:1', '21:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => updateGenParams({ aspectRatio: ratio })}
                    className={`py-1.5 text-center text-xs font-mono rounded-lg border transition-colors ${
                      genParams.aspectRatio === ratio
                        ? 'bg-white/[0.08] border-white/[0.15] text-white font-semibold'
                        : 'bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progressive Disclosure Section: Camera Physics */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] overflow-hidden">
            <button
              onClick={() => setCameraOpen(!cameraOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <Camera className="w-3.5 h-3.5 text-violet-400" />
                <span>Câmera & Óptica</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  ({genParams.camera.movement} • {genParams.camera.lens})
                </span>
              </div>
              {cameraOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
            </button>

            {cameraOpen && (
              <div className="p-4 border-t border-white/[0.06] space-y-3 text-xs bg-white/[0.01]">
                <div>
                  <span className="text-zinc-400 block mb-1.5">Movimento de Câmera</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {cameraMovements.map((move) => (
                      <button
                        key={move}
                        onClick={() =>
                          updateGenParams({
                            camera: { ...genParams.camera, movement: move },
                          })
                        }
                        className={`px-2 py-1 rounded-md text-left truncate transition-colors ${
                          genParams.camera.movement === move
                            ? 'bg-violet-600/20 text-white border border-violet-500/40 font-semibold'
                            : 'bg-white/[0.02] border border-white/[0.04] text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {move}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-zinc-400 block mb-1">Lente</span>
                    <select
                      value={genParams.camera.lens}
                      onChange={(e) =>
                        updateGenParams({
                          camera: { ...genParams.camera, lens: e.target.value as any },
                        })
                      }
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      {cameraLenses.map((l) => (
                        <option key={l} value={l} className="bg-[#111113]">{l}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-zinc-400 block mb-1">Estabilização</span>
                    <select
                      value={genParams.camera.stability}
                      onChange={(e) =>
                        updateGenParams({
                          camera: { ...genParams.camera, stability: e.target.value as any },
                        })
                      }
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Locked" className="bg-[#111113]">Tripé Fixo</option>
                      <option value="Smooth" className="bg-[#111113]">Gimbal Suave</option>
                      <option value="Natural" className="bg-[#111113]">Steadicam Natural</option>
                      <option value="Handheld" className="bg-[#111113]">Handheld Orgânico</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progressive Disclosure Section: Motion Vectors */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] overflow-hidden">
            <button
              onClick={() => setMotionOpen(!motionOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dinâmica & Motion ({genParams.motion.subjectMotion}%)</span>
              </div>
              {motionOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
            </button>

            {motionOpen && (
              <div className="p-4 border-t border-white/[0.06] space-y-3 text-xs bg-white/[0.01]">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Movimento do Sujeito</span>
                    <span className="font-mono text-zinc-200">{genParams.motion.subjectMotion}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={genParams.motion.subjectMotion}
                    onChange={(e) =>
                      updateGenParams({
                        motion: { ...genParams.motion, subjectMotion: Number(e.target.value) },
                      })
                    }
                    className="w-full accent-violet-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Dinâmica de Ambiente</span>
                    <span className="font-mono text-zinc-200">{genParams.motion.environmentMotion}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={genParams.motion.environmentMotion}
                    onChange={(e) =>
                      updateGenParams({
                        motion: { ...genParams.motion, environmentMotion: Number(e.target.value) },
                      })
                    }
                    className="w-full accent-violet-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Progressive Disclosure Section: Negative Prompt */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] overflow-hidden">
            <button
              onClick={() => setNegativeOpen(!negativeOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span>Anti-Artefatos (Negative Prompt)</span>
              </div>
              {negativeOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
            </button>

            {negativeOpen && (
              <div className="p-4 border-t border-white/[0.06] space-y-2 text-xs bg-white/[0.01]">
                <textarea
                  value={genParams.negativePrompt || ''}
                  onChange={(e) => updateGenParams({ negativePrompt: e.target.value })}
                  placeholder="Tokens negativos a evitar..."
                  rows={2}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
                <div className="flex flex-wrap gap-1">
                  {negativePresets.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const current = genParams.negativePrompt || '';
                        if (!current.includes(p)) {
                          updateGenParams({ negativePrompt: current ? `${current}, ${p}` : p });
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.07] text-[10px] text-zinc-400 hover:text-zinc-200 border border-white/[0.04]"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

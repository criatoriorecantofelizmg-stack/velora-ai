import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Film,
  Download,
  Maximize2,
  CheckCircle2,
  Sliders,
  Play,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';

export const EnhanceView: React.FC = () => {
  const { jobs, latestCompletedJob, setComparisonItem, addToast } = useApp();

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>(
    latestCompletedJob?.resultVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-living-room-and-kitchen-41221-large.mp4'
  );
  const [targetRes, setTargetRes] = useState<'4K' | '8K Super-Resolution'>('8K Super-Resolution');
  const [fpsBoost, setFpsBoost] = useState(true);
  const [denoise, setDenoise] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceProgress, setEnhanceProgress] = useState(0);
  const [enhancedResultUrl, setEnhancedResultUrl] = useState<string | null>(null);

  const handleStartUpscale = async () => {
    setIsEnhancing(true);
    setEnhanceProgress(15);

    try {
      const res = await apiService.upscaleVideo(selectedVideoUrl, targetRes, fpsBoost, denoise);
      const interval = setInterval(() => {
        setEnhanceProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setIsEnhancing(false);
            setEnhancedResultUrl(res.enhancedVideoUrl);
            addToast(`Upscale para ${targetRes} com interpolação 60 FPS concluído!`, 'success');
            return 100;
          }
          return p + 25;
        });
      }, 350);
    } catch (err: any) {
      setIsEnhancing(false);
      addToast('Erro no upscale: ' + err.message, 'error');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Banner */}
      <div className="relative rounded-3xl p-8 border border-white/10 bg-gradient-to-r from-purple-950/30 via-[#10121d] to-blue-950/30 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Neural Super-Resolution Engine
          </div>
          <h1 className="text-3xl font-black text-white">8K Upscaling & Cinema Mastering</h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Enhance generated video files into pristine 4K and 8K master deliverables with AI temporal super-sampling, 60 FPS motion interpolation, and artifact denoising.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Video Preview & Comparison */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#10121d] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Play className="w-4 h-4 text-purple-400" />
                Source Master Video
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                {targetRes}
              </span>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
              <video
                src={enhancedResultUrl || selectedVideoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />

              {enhancedResultUrl && (
                <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-white font-bold">
                  ENHANCED 8K MASTER (60 FPS)
                </div>
              )}
            </div>

            {/* If enhanced, give option to compare */}
            {enhancedResultUrl && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() =>
                    setComparisonItem({
                      beforeUrl: selectedVideoUrl,
                      afterUrl: enhancedResultUrl,
                      title: '8K Super-Resolution Upscale Comparison',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-zinc-200 flex items-center gap-2 border border-white/10"
                >
                  <Maximize2 className="w-4 h-4 text-purple-400" />
                  Split-Screen Comparison
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Enhancement Parameters & Launch */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-[#10121d] p-6 space-y-6 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Upscaling Parameters
            </h3>

            {/* Target Resolution */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">Target Master Resolution</label>
              <div className="grid grid-cols-2 gap-2">
                {(['4K', '8K Super-Resolution'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTargetRes(r)}
                    className={`py-3 px-3 rounded-xl border text-xs font-mono font-bold transition-all text-center ${
                      targetRes === r
                        ? 'bg-purple-600/25 border-purple-500 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">60 FPS Motion Interpolation</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Smooth out shutter cadence without ghosting</div>
                </div>
                <input
                  type="checkbox"
                  checked={fpsBoost}
                  onChange={(e) => setFpsBoost(e.target.checked)}
                  className="rounded bg-white/10 accent-purple-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Neural Texture Reconstruction & Denoise</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Recover fine surface grain and specular reflections</div>
                </div>
                <input
                  type="checkbox"
                  checked={denoise}
                  onChange={(e) => setDenoise(e.target.checked)}
                  className="rounded bg-white/10 accent-purple-500 w-4 h-4"
                />
              </label>
            </div>

            {/* Progress */}
            {isEnhancing && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Processing Super-Resolution...</span>
                  <span className="text-purple-400 font-bold">{enhanceProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${enhanceProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action */}
            <button
              onClick={handleStartUpscale}
              disabled={isEnhancing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-purple-900/40 transition-all disabled:opacity-50"
            >
              {isEnhancing ? 'Mastering Video...' : `Execute ${targetRes} Super-Resolution`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

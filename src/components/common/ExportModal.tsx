import React, { useState } from 'react';
import {
  X,
  Download,
  Film,
  Sparkles,
  Check,
  HardDrive,
  Clock,
  Layers,
  Share2,
  Tv
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeProject, latestCompletedJob, addToast } = useApp();

  const [format, setFormat] = useState<'MP4' | 'MOV' | 'WEBM'>('MP4');
  const [resolution, setResolution] = useState<'1080p' | '2K' | '4K' | '8K Upscaled'>('4K');
  const [preset, setPreset] = useState<'Custom' | 'YouTube' | 'Reels' | 'TikTok' | 'Airbnb' | 'Advertising'>('YouTube');
  const [codec, setCodec] = useState<'H.264 (Standard)' | 'ProRes 422 HQ (Master)' | 'AV1 (Ultra-Efficient)'>('H.264 (Standard)');
  const [fps, setFps] = useState<24 | 30 | 60>(24);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(10);

    const interval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          addToast('Vídeo master exportado com sucesso sem marca d\'água!', 'success');
          
          // Trigger file download
          const downloadUrl = latestCompletedJob?.resultVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-living-room-and-kitchen-41221-large.mp4';
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${(activeProject?.name || 'Vision_AI_Master').replace(/\s+/g, '_')}_${resolution}_${fps}fps.${format.toLowerCase()}`;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          onClose();
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  const applyPreset = (presetName: typeof preset) => {
    setPreset(presetName);
    if (presetName === 'Reels' || presetName === 'TikTok') {
      setResolution('1080p');
      setFps(30);
      setFormat('MP4');
    } else if (presetName === 'YouTube' || presetName === 'Airbnb') {
      setResolution('4K');
      setFps(24);
      setFormat('MP4');
    } else if (presetName === 'Advertising') {
      setResolution('4K');
      setFps(24);
      setCodec('ProRes 422 HQ (Master)');
      setFormat('MOV');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#10121d] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Download className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Master Cinema Video</h3>
              <p className="text-xs text-zinc-400">Render high-bitrate clean video master without watermarks.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Export Presets
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(['YouTube', 'Reels', 'TikTok', 'Airbnb', 'Advertising', 'Custom'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    preset === p
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-semibold'
                      : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Format & Resolution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resolution */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Resolution
              </label>
              <div className="space-y-1.5">
                {(['1080p', '2K', '4K', '8K Upscaled'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                      resolution === res
                        ? 'bg-blue-600/20 border-blue-500/50 text-white font-semibold'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{res}</span>
                    {resolution === res && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Container Format */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                File Container
              </label>
              <div className="space-y-1.5">
                {(['MP4', 'MOV', 'WEBM'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                      format === f
                        ? 'bg-blue-600/20 border-blue-500/50 text-white font-semibold'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{f}</span>
                    {format === f && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Frame Rate & Codec */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Frame Rate
              </label>
              <div className="flex gap-2">
                {([24, 30, 60] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setFps(r)}
                    className={`flex-1 py-2 rounded-xl text-xs border font-mono transition-all ${
                      fps === r
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-bold'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {r} FPS {r === 24 ? '(Cinema)' : r === 60 ? '(Smooth)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Master Codec
              </label>
              <select
                value={codec}
                onChange={(e) => setCodec(e.target.value as any)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="H.264 (Standard)" className="bg-[#12141e]">H.264 (Broad Compatibility)</option>
                <option value="ProRes 422 HQ (Master)" className="bg-[#12141e]">ProRes 422 HQ (Master Quality)</option>
                <option value="AV1 (Ultra-Efficient)" className="bg-[#12141e]">AV1 (Ultra-Efficient 8K)</option>
              </select>
            </div>
          </div>

          {/* Summary Details */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-zinc-500" />
              <span>Est. Size: <strong className="text-white font-mono">{resolution === '8K Upscaled' ? '~420 MB' : resolution === '4K' ? '~140 MB' : '~45 MB'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-medium">Unbranded Clean License</span>
            </div>
          </div>

          {/* Progress bar if exporting */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Rendering Master Stream...</span>
                <span className="text-blue-400 font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleStartExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/40 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Render & Download Master'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

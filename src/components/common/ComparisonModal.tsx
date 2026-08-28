import React, { useState } from 'react';
import { X, SlidersHorizontal, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ComparisonModal: React.FC = () => {
  const { comparisonItem, setComparisonItem } = useApp();
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side'>('split');

  if (!comparisonItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#10121d] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Compare: Original vs AI Generated</h3>
              <p className="text-xs text-zinc-400">{comparisonItem.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-white/[0.04] p-0.5 border border-white/[0.08]">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  viewMode === 'split' ? 'bg-blue-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Interactive Slider
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  viewMode === 'side-by-side' ? 'bg-blue-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Side by Side
              </button>
            </div>

            <button
              onClick={() => setComparisonItem(null)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center overflow-hidden">
          {viewMode === 'split' ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 select-none max-h-[500px] bg-black">
              {/* After / Generated Video or Image */}
              <img
                src={comparisonItem.afterUrl}
                alt="AI Generated"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before / Original with clip-path */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={comparisonItem.beforeUrl}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-zinc-200 font-bold border border-white/10">
                  ORIGINAL REFERENCE PHOTO
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-white font-bold border border-blue-400/30">
                AI CINEMATIC RENDER
              </div>

              {/* Slider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_12px_rgba(0,0,0,0.8)]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-xl font-bold text-xs">
                  ↔
                </div>
              </div>

              {/* Invisible interactive range input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full h-full max-h-[500px]">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={comparisonItem.beforeUrl}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-zinc-300 font-bold border border-white/10">
                  ORIGINAL REFERENCE
                </div>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-blue-500/30 bg-black">
                <img
                  src={comparisonItem.afterUrl}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-white font-bold border border-blue-400/30">
                  AI GENERATED
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-400 mt-4 text-center">
            Drag the slider to inspect structural preservation, lighting consistency, and edge fidelity.
          </p>
        </div>
      </div>
    </div>
  );
};

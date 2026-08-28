import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Play,
  Film,
  Building2,
  Tv,
  ShoppingBag,
  Share2,
  Clapperboard,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VideoTemplate } from '../../types';

export const TemplatesView: React.FC = () => {
  const { templates, updateGenParams, setActiveSection, addToast } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Real Estate', 'Airbnb', 'Automotive', 'Product', 'Social Media', 'Travel'];

  const filtered = activeCategory === 'All' ? templates : templates.filter((t) => t.category === activeCategory);

  const handleUseTemplate = (tpl: VideoTemplate) => {
    updateGenParams({
      prompt: tpl.defaultPrompt,
      aspectRatio: tpl.aspectRatio as any,
      camera: {
        movement: tpl.cameraPreset as any || 'Dolly In',
        speed: 'Slow',
        stability: 'Smooth',
        lens: '35mm',
        depthOfField: 'Medium',
        zoomLevel: 1.0,
        focusDistance: 'Subject',
        cameraHeight: 'Eye level',
        fov: 65,
      },
    });
    setActiveSection('generate');
    addToast(`Template "${tpl.title}" carregado no estúdio!`, 'success');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
          <Sliders className="w-3.5 h-3.5" /> Curated Production Presets
        </div>
        <h1 className="text-3xl font-black text-white">Video Workflow Templates</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 max-w-2xl">
          Pre-configured camera choreography, timing curves, and lighting aesthetics engineered for high engagement and commercial conversion.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-[#10121d] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl border border-white/10 bg-[#10121d] overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all shadow-xl"
          >
            {/* Video preview */}
            <div className="relative aspect-video bg-black overflow-hidden border-b border-white/10">
              <video
                src={tpl.videoPreviewUrl}
                poster={tpl.thumbnailUrl}
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                onMouseLeave={(e) => e.currentTarget.pause()}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 font-bold border border-white/10">
                {tpl.aspectRatio} • {tpl.duration}
              </div>

              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                {tpl.category}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
              <div>
                <h3 className="font-bold text-white text-base">{tpl.title}</h3>
                <p className="text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{tpl.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tpl.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-zinc-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use Workflow Template</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Palette, Shield, Download, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VeloraLogo, VeloraSymbol } from '../brand/VeloraLogo';

export const BrandKitView: React.FC = () => {
  const { brandKit, updateBrandKit, addToast, language } = useApp();

  const [name, setName] = useState(brandKit.name || 'VELORA');
  const [logoUrl, setLogoUrl] = useState(brandKit.logoUrl || '');
  const [watermarkPosition, setWatermarkPosition] = useState(brandKit.watermarkPosition);
  const [watermarkOpacity, setWatermarkOpacity] = useState(brandKit.watermarkOpacity);
  const [primaryColor, setPrimaryColor] = useState(brandKit.primaryColor || '#7C3AED');
  const [secondaryColor, setSecondaryColor] = useState(brandKit.secondaryColor || '#111113');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandKit({
      name,
      logoUrl,
      watermarkPosition,
      watermarkOpacity,
      primaryColor,
      secondaryColor,
    });
    addToast('Configurações de identidade visual salvas!', 'success');
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest">
          <Palette className="w-3.5 h-3.5 text-violet-400" />
          <span>Brand & Visual Identity System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {language === 'pt-BR' ? 'Marca & Identidade Visual' : 'Brand & Visual Identity'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          {language === 'pt-BR'
            ? 'Personalize logos, marcas d’água automáticas e consulte as especificações do Design System VELORA.'
            : 'Customize automated watermark overlays, agency logos, and review VELORA Design System specs.'}
        </p>
      </div>

      {/* Brand Identity Spec Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 sm:p-6 space-y-6">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
          Especificações da Marca VELORA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Logo Card */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono text-zinc-400 block mb-2">SÍMBOLO & WORDMARK</span>
              <VeloraLogo symbolSize={24} wordmarkSize="md" variant="accent" showSubtitle={true} />
            </div>
            <p className="text-[11px] text-zinc-400">
              Construído a partir de vetores geométricos de proporção áurea com ângulo de 38° e abertura anamórfica.
            </p>
          </div>

          {/* Color Palette Card */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <span className="text-[11px] font-mono text-zinc-400 block">PALETA DE CORES</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="w-3.5 h-3.5 rounded bg-[#0A0A0B] border border-white/20 inline-block" />
                  Base Background
                </span>
                <span className="font-mono text-zinc-400">#0A0A0B</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="w-3.5 h-3.5 rounded bg-[#111113] border border-white/20 inline-block" />
                  Surface
                </span>
                <span className="font-mono text-zinc-400">#111113</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="w-3.5 h-3.5 rounded bg-[#7C3AED] inline-block" />
                  Violet Accent
                </span>
                <span className="font-mono text-violet-300">#7C3AED</span>
              </div>
            </div>
          </div>

          {/* Typography Card */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <span className="text-[11px] font-mono text-zinc-400 block">TIPOGRAFIA</span>
            <div className="space-y-1 text-xs text-zinc-300">
              <div><strong className="text-white">Headings:</strong> Sans-serif Display</div>
              <div><strong className="text-white">Body:</strong> Inter / System UI</div>
              <div><strong className="text-white">Telemetry:</strong> JetBrains Mono / Monospace</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form & Live Overlay Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 sm:p-6 space-y-5">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Marca D'água & Overlay Personalizado
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Nome da Agência / Produtora</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">URL do Logo (PNG Transparente)</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Posição do Overlay</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setWatermarkPosition(pos)}
                    className={`py-2 rounded-xl border text-xs capitalize transition-all ${
                      watermarkPosition === pos
                        ? 'bg-violet-600/20 border-violet-500 text-white font-semibold'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {pos.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1.5">
                <span>Opacidade da Marca D'água</span>
                <span className="font-mono text-violet-400">{watermarkOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Salvar Preferências de Marca
            </button>
          </form>
        </div>

        {/* Live Watermark Preview */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 space-y-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Pré-visualização do Overlay
            </h3>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/[0.08]">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                alt="preview"
                className="w-full h-full object-cover"
              />

              {/* Watermark placement */}
              <div
                className={`absolute p-4 pointer-events-none ${
                  watermarkPosition === 'top-left'
                    ? 'top-0 left-0'
                    : watermarkPosition === 'top-right'
                    ? 'top-0 right-0'
                    : watermarkPosition === 'bottom-left'
                    ? 'bottom-0 left-0'
                    : 'bottom-0 right-0'
                }`}
                style={{ opacity: watermarkOpacity / 100 }}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-14 h-auto object-contain drop-shadow-md" />
                ) : (
                  <div className="bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/20 text-xs font-semibold text-white tracking-wide">
                    {name}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 text-center">
              A marca d'água pode ser habilitada ou desabilitada durante a exportação final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Building2,
  Tv,
  Share2,
  Clapperboard,
  ShoppingBag,
  X,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from './LanguageSelector';
import { VeloraLogo } from '../brand/VeloraLogo';

export const OnboardingModal: React.FC = () => {
  const { onboardingOpen, setOnboardingOpen, setActiveSection, updateGenParams, addToast, t, language } = useApp();

  if (!onboardingOpen) return null;

  const workflows = [
    {
      id: 'real-estate',
      title: language === 'pt-BR' ? 'Imóveis & Arquitetura' : 'Real Estate & Architecture',
      icon: Building2,
      desc: language === 'pt-BR' ? 'Tours cinematográficos fluidos preservando geometria e luz real.' : 'Cinematic walkthroughs preserving architectural geometry.',
      targetSec: 'real-estate' as const,
      prompt: 'Tour cinematográfico de arquitetura em mansão de alto padrão, preservando acabamentos originais e iluminação natural.',
    },
    {
      id: 'advertising',
      title: language === 'pt-BR' ? 'Comerciais & Ads' : 'Commercials & Ads',
      icon: Tv,
      desc: language === 'pt-BR' ? 'Vídeos institucionais e campanhas de marca com textura premium.' : 'High-impact ads and brand campaigns with studio lighting.',
      targetSec: 'generate' as const,
      prompt: 'Tomada heroica cinematográfica de carro esportivo de luxo em estrada litorânea, 24fps motion blur, golden hour.',
    },
    {
      id: 'social-media',
      title: language === 'pt-BR' ? 'Redes Sociais & Reels (9:16)' : 'Social & Reels (9:16)',
      icon: Share2,
      desc: language === 'pt-BR' ? 'Formatos verticais imersivos para Instagram Reels e TikTok.' : 'Vertical immersive formats engineered for mobile screens.',
      targetSec: 'generate' as const,
      aspectRatio: '9:16' as const,
      prompt: 'Retrato de moda vertical dinâmico com iluminação de estúdio marcante e avanço suave de câmera.',
    },
    {
      id: 'film',
      title: language === 'pt-BR' ? 'Cinema & Storytelling' : 'Cinema & Storytelling',
      icon: Clapperboard,
      desc: language === 'pt-BR' ? 'Narrativas com lentes anamórficas 2.39:1 e obturador 24 FPS.' : 'Anamorphic 2.39:1 compositions with 24 FPS shutter physics.',
      targetSec: 'storyboard' as const,
      prompt: 'Plano widescreen anamórfico 2.39:1 com personagem caminhando em floresta com neblina ao amanhecer.',
    },
    {
      id: 'products',
      title: language === 'pt-BR' ? 'Showcase de Produto' : 'Product Showcase',
      icon: ShoppingBag,
      desc: language === 'pt-BR' ? 'Órbitas macro 360° com reflexos realistas em estúdio.' : 'Macro 360° orbits with realistic titanium reflections.',
      targetSec: 'generate' as const,
      aspectRatio: '1:1' as const,
      prompt: 'Revelação de produto em estúdio sobre base de vidro negro com órbita circular suave e reflexos em titânio.',
    },
  ];

  const handleSelect = (wf: typeof workflows[0]) => {
    if (wf.aspectRatio) {
      updateGenParams({ aspectRatio: wf.aspectRatio });
    }
    updateGenParams({ prompt: wf.prompt });
    setActiveSection(wf.targetSec);
    setOnboardingOpen(false);
    addToast(`${language === 'pt-BR' ? 'Modo selecionado:' : 'Selected mode:'} ${wf.title}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111113] border border-white/[0.1] rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <VeloraLogo symbolSize={18} wordmarkSize="sm" variant="accent" showSubtitle={false} />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight pt-1">
              {t('onboarding.welcomeTitle')}
            </h2>
            <p className="text-xs text-zinc-400">{t('onboarding.welcomeSubtitle')}</p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <LanguageSelector variant="compact" />
            <button
              onClick={() => setOnboardingOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {workflows.map((wf) => {
            const Icon = wf.icon;
            return (
              <div
                key={wf.id}
                onClick={() => handleSelect(wf)}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-violet-500/40 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-violet-500/40 transition-colors">
                    <Icon className="w-4 h-4 text-zinc-300 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {wf.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-snug">{wf.desc}</p>
                  </div>
                </div>

                <div className="p-1.5 rounded-md text-zinc-500 group-hover:text-violet-400 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-mono text-[11px]">VELORA Studio • Cinema Grade</span>
          <button
            onClick={() => setOnboardingOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

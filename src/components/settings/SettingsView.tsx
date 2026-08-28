import React, { useState } from 'react';
import {
  Settings,
  CreditCard,
  Check,
  Key,
  HardDrive,
  Globe,
  Languages,
  Calendar,
  Clock,
  DollarSign,
  Ruler,
  Mic,
  Subtitles,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserSubscription } from '../../types';
import { LanguageSelector } from '../common/LanguageSelector';
import { LANGUAGES, LanguageCode } from '../../i18n';

type SettingsTab = 'plans' | 'language' | 'api' | 'storage';

export const SettingsView: React.FC = () => {
  const {
    subscription,
    updateSubscriptionPlan,
    setApiModalOpen,
    addToast,
    language,
    setLanguage,
    regionalSettings,
    updateRegionalSettings,
    voiceSettings,
    updateVoiceSettings,
    subtitlesSettings,
    updateSubtitlesSettings,
    t,
    formatNumber,
    formatCurrency
  } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>('language');

  // Form states for Regional Settings
  const [localDateFormat, setLocalDateFormat] = useState(regionalSettings.dateFormat);
  const [localTimeFormat, setLocalTimeFormat] = useState(regionalSettings.timeFormat);
  const [localCurrency, setLocalCurrency] = useState(regionalSettings.currency);
  const [localUnitSystem, setLocalUnitSystem] = useState(regionalSettings.unitSystem);

  // Form states for Voice & Subtitle
  const [localVoiceLang, setLocalVoiceLang] = useState(voiceSettings.defaultVoiceLanguage);
  const [localVoiceAccent, setLocalVoiceAccent] = useState(voiceSettings.defaultAccent);
  const [localVoiceGender, setLocalVoiceGender] = useState(voiceSettings.gender);
  const [localAutoSubtitles, setLocalAutoSubtitles] = useState(subtitlesSettings.autoDetectLanguage);

  const handleSaveRegional = () => {
    updateRegionalSettings({
      dateFormat: localDateFormat,
      timeFormat: localTimeFormat,
      currency: localCurrency,
      unitSystem: localUnitSystem,
    });
    updateVoiceSettings({
      defaultVoiceLanguage: localVoiceLang,
      defaultAccent: localVoiceAccent,
      gender: localVoiceGender,
    });
    updateSubtitlesSettings({
      autoDetectLanguage: localAutoSubtitles,
    });
    addToast(t('settings.preferencesSaved'), 'success');
  };

  const plans: Array<{
    name: UserSubscription['plan'];
    price: string;
    credits: string;
    badge?: string;
    features: string[];
  }> = [
    {
      name: 'Free',
      price: '$0',
      credits: '150 Credits / mo',
      features: ['1080p Video Generation', 'Standard Queue', 'Basic Timeline Editor'],
    },
    {
      name: 'Creator',
      price: '$29 / mo',
      credits: '800 Credits / mo',
      features: ['1080p & 2K Generation', 'Faster Queue', 'Audio Soundscapes', 'No Watermark'],
    },
    {
      name: 'Pro',
      price: '$79 / mo',
      credits: '2,000 Credits / mo',
      badge: 'Popular',
      features: ['4K UHD Cinema Output', 'Multi-Track Timeline Editor', 'Real Estate AI Suite', 'Priority GPU Worker'],
    },
    {
      name: 'Studio',
      price: '$199 / mo',
      credits: '5,000 Credits / mo',
      badge: 'Current Plan',
      features: ['8K Super-Resolution Upscaling', '60 FPS Motion Interpolation', 'Veo 3.1 & Runway Gen-3', 'Zero Queue Latency', 'Unlimited Cloud Projects'],
    },
    {
      name: 'Unlimited',
      price: '$499 / mo',
      credits: 'Unlimited Fair-Use',
      badge: 'Enterprise',
      features: ['Unlimited High-Res Generations', 'Dedicated Multi-GPU Cluster', 'Custom Brand Overlays', 'Full REST API Access', 'SLA 99.9% Uptime'],
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest">
          <Settings className="w-3.5 h-3.5 text-violet-400" />
          <span>Platform Settings & Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{t('settings.title')}</h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('language')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeTab === 'language'
              ? 'bg-white/[0.08] text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
          }`}
        >
          <Languages className="w-3.5 h-3.5 text-violet-400" />
          <span>{t('settings.tabLanguageRegion')}</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeTab === 'plans'
              ? 'bg-white/[0.08] text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{t('settings.tabPlans')}</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeTab === 'api'
              ? 'bg-white/[0.08] text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{t('settings.tabApiKeys')}</span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeTab === 'storage'
              ? 'bg-white/[0.08] text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>{t('settings.tabStorage')}</span>
        </button>
      </div>

      {/* TAB 1: LANGUAGE & REGION */}
      {activeTab === 'language' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Interface Language Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-400" />
                  <span>{t('settings.languageTitle')}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {t('settings.languageSubtitle')}
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                12 {t('settings.languagesAvailable')}
              </div>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      addToast(`${t('settings.languageChanged')}: ${lang.nativeName}`, 'success');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-violet-600/15 border-violet-500 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-lg">{lang.flag}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-violet-400" />
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-white">{lang.nativeName}</div>
                      <div className="text-[10px] text-zinc-400">{lang.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional Formats */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 sm:p-6 space-y-5">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>{t('settings.regionalFormatsTitle')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">{t('settings.dateFormat')}</label>
                <select
                  value={localDateFormat}
                  onChange={(e) => setLocalDateFormat(e.target.value as any)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="DD/MM/YYYY" className="bg-[#111113]">DD/MM/YYYY (28/08/2026)</option>
                  <option value="MM/DD/YYYY" className="bg-[#111113]">MM/DD/YYYY (08/28/2026)</option>
                  <option value="YYYY-MM-DD" className="bg-[#111113]">YYYY-MM-DD (2026-08-28)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">{t('settings.timeFormat')}</label>
                <select
                  value={localTimeFormat}
                  onChange={(e) => setLocalTimeFormat(e.target.value as any)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="24h" className="bg-[#111113]">24 Horas (14:30)</option>
                  <option value="12h" className="bg-[#111113]">12 Horas (02:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">{t('settings.currency')}</label>
                <select
                  value={localCurrency}
                  onChange={(e) => setLocalCurrency(e.target.value as any)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="BRL" className="bg-[#111113]">Real Brasileiro (BRL R$)</option>
                  <option value="USD" className="bg-[#111113]">US Dollar (USD $)</option>
                  <option value="EUR" className="bg-[#111113]">Euro (EUR €)</option>
                  <option value="GBP" className="bg-[#111113]">British Pound (GBP £)</option>
                  <option value="JPY" className="bg-[#111113]">Japanese Yen (JPY ¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">{t('settings.unitSystem')}</label>
                <select
                  value={localUnitSystem}
                  onChange={(e) => setLocalUnitSystem(e.target.value as any)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="metric" className="bg-[#111113]">{t('settings.metricSystem')}</option>
                  <option value="imperial" className="bg-[#111113]">{t('settings.imperialSystem')}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveRegional}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t('settings.savePreferences')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLANS & CREDITS */}
      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {plans.map((p) => {
              const isCurrent = subscription.plan === p.name;
              return (
                <div
                  key={p.name}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-violet-600/10 border-violet-500/50 shadow-md'
                      : 'bg-[#111113] border-white/[0.08] hover:border-white/[0.14]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{p.name}</span>
                      {p.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-black text-white">{p.price}</div>
                    <div className="text-xs text-zinc-400 font-mono mt-0.5">{p.credits}</div>

                    <div className="space-y-1.5 mt-4 pt-4 border-t border-white/[0.06]">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-300">
                          <Check className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateSubscriptionPlan(p.name);
                      addToast(`Plano alterado para ${p.name}!`, 'success');
                    }}
                    disabled={isCurrent}
                    className={`w-full py-2 mt-5 rounded-xl text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-white/[0.08] text-zinc-300 cursor-default'
                        : 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm'
                    }`}
                  >
                    {isCurrent ? 'Plano Ativo' : 'Selecionar'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: API KEYS */}
      {activeTab === 'api' && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-6 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-violet-400" />
            <span>Gerenciamento de Chaves de API</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Configure chaves de provedores dedicados (Google Cloud Veo, Runway, Luma, Kling, ElevenLabs) para gerar com cotas próprias.
          </p>
          <button
            onClick={() => setApiModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm"
          >
            Abrir Painel de Chaves de API
          </button>
        </div>
      )}

      {/* TAB 4: STORAGE */}
      {activeTab === 'storage' && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-6 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-violet-400" />
            <span>Armazenamento & Nuvem</span>
          </h3>
          <div className="space-y-2 max-w-md">
            <div className="flex justify-between text-xs text-zinc-400 font-mono">
              <span>Espaço Utilizado</span>
              <span>
                {(subscription.storageUsedMb / 1024).toFixed(1)} GB de {(subscription.storageLimitMb / 1024).toFixed(0)} GB
              </span>
            </div>
            <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full"
                style={{ width: `${(subscription.storageUsedMb / subscription.storageLimitMb) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

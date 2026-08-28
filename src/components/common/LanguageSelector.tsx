import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, Check, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES, LanguageCode, LanguageMeta } from '../../i18n';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { language, setLanguage, addToast, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangMeta = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredLanguages = LANGUAGES.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (langCode: LanguageCode, meta: LanguageMeta) => {
    setLanguage(langCode);
    setIsOpen(false);
    setSearch('');
    addToast(
      langCode === 'pt-BR'
        ? `Idioma alterado para ${meta.nativeName}`
        : `Language switched to ${meta.nativeName}`,
      'success'
    );
  };

  if (variant === 'full') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredLanguages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelect(l.code, l)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-md shadow-blue-900/20 text-white'
                    : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.06] text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{l.flag}</span>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                      <span>{l.nativeName}</span>
                      {l.code === 'pt-BR' && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                          Padrão
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">{l.country}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-200 transition-all group"
        title="Seletor de Idioma / Language Selector"
      >
        <span className="text-sm">{currentLangMeta.flag}</span>
        <span className="font-medium hidden sm:inline-block max-w-[130px] truncate">
          {currentLangMeta.nativeName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
            isOpen ? 'rotate-180 text-white' : 'group-hover:text-zinc-200'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#10121d] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100 backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-white/[0.07] mb-2">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('settings.interfaceLanguage')}</span>
          </div>

          {/* Search Box */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('common.search')}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50"
              autoFocus
            />
          </div>

          {/* List of Languages */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredLanguages.map((l) => {
              const isSelected = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelect(l.code, l)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                      : 'text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{l.flag}</span>
                    <div className="truncate">
                      <div className="text-xs truncate flex items-center gap-1.5">
                        <span>{l.nativeName}</span>
                        {l.code === 'pt-BR' && (
                          <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-mono">
                            PT
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">{l.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

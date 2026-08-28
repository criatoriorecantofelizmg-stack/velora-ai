import { LanguageCode, LanguageMeta, RegionalSettings, TranslationSchema } from './types';
import { ptBR } from './locales/pt-BR';
import { enUS } from './locales/en-US';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { it } from './locales/it';
import { ptPT } from './locales/pt-PT';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { zhCN } from './locales/zh-CN';
import { zhTW } from './locales/zh-TW';
import { hi } from './locales/hi';
import { ar } from './locales/ar';

export * from './types';

export const DEFAULT_LANGUAGE: LanguageCode = 'pt-BR';

export const LANGUAGES: LanguageMeta[] = [
  {
    code: 'pt-BR',
    name: 'Português (Brasil)',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
    dir: 'ltr',
    country: 'Brasil',
    defaultRegion: 'América do Sul (Brasil)',
    defaultDateFormat: 'DD/MM/YYYY',
    defaultTimeFormat: '24h',
    defaultCurrency: 'BRL (R$)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'en-US',
    name: 'English (United States)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    dir: 'ltr',
    country: 'United States',
    defaultRegion: 'North America (US)',
    defaultDateFormat: 'MM/DD/YYYY',
    defaultTimeFormat: '12h',
    defaultCurrency: 'USD ($)',
    defaultUnitSystem: 'imperial',
  },
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
    country: 'España / Latinoamérica',
    defaultRegion: 'España / LATAM',
    defaultDateFormat: 'DD/MM/YYYY',
    defaultTimeFormat: '24h',
    defaultCurrency: 'EUR (€)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    country: 'France',
    defaultRegion: 'Europe (France)',
    defaultDateFormat: 'DD/MM/YYYY',
    defaultTimeFormat: '24h',
    defaultCurrency: 'EUR (€)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'de',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    country: 'Deutschland',
    defaultRegion: 'Europe (Germany)',
    defaultDateFormat: 'DD.MM.YYYY',
    defaultTimeFormat: '24h',
    defaultCurrency: 'EUR (€)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'it',
    name: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr',
    country: 'Italia',
    defaultRegion: 'Europe (Italy)',
    defaultDateFormat: 'DD/MM/YYYY',
    defaultTimeFormat: '24h',
    defaultCurrency: 'EUR (€)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'pt-PT',
    name: 'Português (Portugal)',
    nativeName: 'Português (Portugal)',
    flag: '🇵🇹',
    dir: 'ltr',
    country: 'Portugal',
    defaultRegion: 'Europa (Portugal)',
    defaultDateFormat: 'DD/MM/YYYY',
    defaultTimeFormat: '24h',
    defaultCurrency: 'EUR (€)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr',
    country: '日本 (Japan)',
    defaultRegion: 'Asia (Japan)',
    defaultDateFormat: 'YYYY/MM/DD',
    defaultTimeFormat: '24h',
    defaultCurrency: 'JPY (¥)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    dir: 'ltr',
    country: '대한민국 (Korea)',
    defaultRegion: 'Asia (Korea)',
    defaultDateFormat: 'YYYY. MM. DD.',
    defaultTimeFormat: '24h',
    defaultCurrency: 'KRW (₩)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '中文（简体）',
    flag: '🇨🇳',
    dir: 'ltr',
    country: '中国 (China)',
    defaultRegion: 'Asia (Mainland China)',
    defaultDateFormat: 'YYYY-MM-DD',
    defaultTimeFormat: '24h',
    defaultCurrency: 'CNY (¥)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '中文（繁體）',
    flag: '🇹🇼',
    dir: 'ltr',
    country: '台灣 / 香港',
    defaultRegion: 'Asia (Taiwan / HK)',
    defaultDateFormat: 'YYYY/MM/DD',
    defaultTimeFormat: '24h',
    defaultCurrency: 'TWD (NT$)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr',
    country: 'भारत (India)',
    defaultRegion: 'Asia (India)',
    defaultDateFormat: 'DD/MM/YYYY',
    defaultTimeFormat: '12h',
    defaultCurrency: 'INR (₹)',
    defaultUnitSystem: 'metric',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    country: 'المملكة العربية السعودية / الشرق الأوسط',
    defaultRegion: 'Middle East & North Africa',
    defaultDateFormat: 'DD/MM/YYYY',
    defaultTimeFormat: '12h',
    defaultCurrency: 'SAR (ر.س)',
    defaultUnitSystem: 'metric',
  },
];

export const LOCALES: Record<LanguageCode, TranslationSchema> = {
  'pt-BR': ptBR,
  'en-US': enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
  'pt-PT': ptPT,
  ja: ja,
  ko: ko,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  hi: hi,
  ar: ar,
};

export const detectBrowserLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const saved = localStorage.getItem('vision_ai_lang') as LanguageCode;
    if (saved && LOCALES[saved]) {
      return saved;
    }
    const navLangs = navigator.languages || [navigator.language || ''];
    for (const lang of navLangs) {
      if (!lang) continue;
      const lower = lang.toLowerCase();
      if (lower.startsWith('pt-br') || lower === 'pt') return 'pt-BR';
      if (lower.startsWith('en')) return 'en-US';
      if (lower.startsWith('es')) return 'es';
      if (lower.startsWith('fr')) return 'fr';
      if (lower.startsWith('de')) return 'de';
      if (lower.startsWith('it')) return 'it';
      if (lower.startsWith('pt-pt')) return 'pt-PT';
      if (lower.startsWith('ja')) return 'ja';
      if (lower.startsWith('ko')) return 'ko';
      if (lower.startsWith('zh-cn') || lower === 'zh-hans') return 'zh-CN';
      if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower === 'zh-hant') return 'zh-TW';
      if (lower.startsWith('hi')) return 'hi';
      if (lower.startsWith('ar')) return 'ar';
    }
  } catch {
    // fallback
  }
  return DEFAULT_LANGUAGE;
};

// Nested key resolver helper (e.g. t('nav.home'), t('generate.enhancePrompt'))
export function getNestedTranslation(
  obj: any,
  path: string,
  params?: Record<string, string | number>
): string | undefined {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  if (typeof current === 'string') {
    if (params) {
      return Object.entries(params).reduce((str, [key, val]) => {
        return str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
      }, current);
    }
    return current;
  }
  return undefined;
}

export function translate(
  lang: LanguageCode,
  key: string,
  params?: Record<string, string | number>
): string {
  const currentDict = LOCALES[lang] || ptBR;
  const direct = getNestedTranslation(currentDict, key, params);
  if (direct) return direct;

  // Fallback to pt-BR (Default)
  const fallback = getNestedTranslation(ptBR, key, params);
  if (fallback) return fallback;

  // Safe readable fallback if ever missing
  const lastKey = key.split('.').pop() || key;
  return lastKey.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

// Formatting helpers
export function formatDate(
  dateInput: string | Date | number,
  lang: LanguageCode = DEFAULT_LANGUAGE,
  customFormat?: string
): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    if (lang === 'pt-BR' || lang === 'pt-PT' || lang === 'es' || lang === 'fr' || lang === 'it') {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }

    if (lang === 'en-US') {
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    }

    if (lang === 'ja' || lang === 'zh-CN' || lang === 'zh-TW' || lang === 'ko') {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (lang === 'de') {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    }

    return d.toLocaleDateString();
  } catch {
    return String(dateInput);
  }
}

export function formatCurrency(
  amount: number,
  lang: LanguageCode = DEFAULT_LANGUAGE,
  customCurrency?: string
): string {
  try {
    if (customCurrency?.includes('BRL') || lang === 'pt-BR') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
    }
    if (customCurrency?.includes('EUR') || lang === 'es' || lang === 'fr' || lang === 'de' || lang === 'it' || lang === 'pt-PT') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    }
    if (customCurrency?.includes('JPY') || lang === 'ja') {
      return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
    }
    if (customCurrency?.includes('SAR') || lang === 'ar') {
      return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function formatNumber(
  val: number,
  lang: LanguageCode = DEFAULT_LANGUAGE
): string {
  try {
    return new Intl.NumberFormat(lang === 'pt-BR' ? 'pt-BR' : 'en-US').format(val);
  } catch {
    return String(val);
  }
}

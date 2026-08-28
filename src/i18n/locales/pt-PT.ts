import { TranslationSchema } from '../types';
import { ptBR } from './pt-BR';

export const ptPT: TranslationSchema = {
  ...ptBR,
  common: {
    ...ptBR.common,
    appName: 'VELORA',
    tagline: 'AI Video Studio',
    upload: 'Carregar Ficheiro',
    storage: 'Armazenamento',
    selectProject: 'Selecionar Projeto',
    switchProject: 'Mudar de Projeto',
    exportMaster: 'Exportar Master',
  },
  nav: {
    ...ptBR.nav,
    assets: 'Ficheiros',
    settings: 'Definições',
    templates: 'Modelos',
  },
  home: {
    ...ptBR.home,
    heroTitle: 'Crie Vídeos Cinematográficos com IA de Alta Fidelidade',
    heroSubtitle: 'Controlo de câmara milimétrico, zero distorção geométrica para imóveis de luxo, edição multi-pista e renderização ultra-rápida.',
    openEditor: 'Abrir Editor com IA',
  },
  generate: {
    ...ptBR.generate,
    cameraControls: 'Movimento de Câmara e Ótica',
    cameraMovement: 'Movimento de Câmara',
    cameraSpeed: 'Velocidade da Câmara',
  },
  settings: {
    ...ptBR.settings,
    title: 'Definições da Área de Trabalho',
    tabPlans: 'Planos e Faturação',
    tabLanguageRegion: 'Idioma e Região',
    languageTitle: 'Idioma da Interface',
    interfaceLanguage: 'Idioma Principal',
    regionTitle: 'Preferências Regionais e Formatação',
    saveChanges: 'Guardar Alterações',
    preferencesSaved: 'Preferências guardadas com sucesso!',
  },
};

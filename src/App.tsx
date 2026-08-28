import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ComparisonModal } from './components/common/ComparisonModal';
import { FeedbackModal } from './components/common/FeedbackModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { ApiIntegrationModal } from './components/common/ApiIntegrationModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { ExportModal } from './components/common/ExportModal';

import { HomeView } from './components/home/HomeView';
import { GenerateView } from './components/generate/GenerateView';
import { RealEstateView } from './components/realestate/RealEstateView';
import { EditorView } from './components/editor/EditorView';
import { StoryboardView } from './components/storyboard/StoryboardView';
import { ProjectsView } from './components/projects/ProjectsView';
import { AssetsView } from './components/assets/AssetsView';
import { TemplatesView } from './components/templates/TemplatesView';
import { HistoryView } from './components/history/HistoryView';
import { EnhanceView } from './components/enhance/EnhanceView';
import { BrandKitView } from './components/brandkit/BrandKitView';
import { AdminView } from './components/admin/AdminView';
import { SettingsView } from './components/settings/SettingsView';
import { ApiDocsView } from './components/api/ApiDocsView';

import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeSection, toasts } = useApp();
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeSection) {
      case 'home':
        return <HomeView />;
      case 'generate':
        return <GenerateView />;
      case 'real-estate':
        return <RealEstateView />;
      case 'editor':
        return <EditorView />;
      case 'storyboard':
        return <StoryboardView />;
      case 'projects':
        return <ProjectsView />;
      case 'assets':
        return <AssetsView />;
      case 'templates':
        return <TemplatesView />;
      case 'history':
        return <HistoryView />;
      case 'enhance':
        return <EnhanceView />;
      case 'brand-kit':
        return <BrandKitView />;
      case 'admin':
        return <AdminView />;
      case 'settings':
        return <SettingsView />;
      case 'api':
        return <ApiDocsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080d] text-zinc-100 font-sans antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main App Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenExport={() => setExportModalOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <ComparisonModal />
      <FeedbackModal />
      <ShortcutsModal />
      <ApiIntegrationModal />
      <OnboardingModal />
      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} />

      {/* Global Live Notification Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#121422]/95 border border-white/10 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 text-xs text-white"
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : t.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : t.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span className="font-medium leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

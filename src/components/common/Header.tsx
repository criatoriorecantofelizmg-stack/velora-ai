import React, { useState } from 'react';
import {
  FolderOpen,
  Download,
  Key,
  HelpCircle,
  Loader2,
  ChevronDown,
  Plus,
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from './LanguageSelector';

export const Header: React.FC<{ onOpenExport: () => void }> = ({ onOpenExport }) => {
  const {
    projects,
    activeProject,
    setActiveProject,
    createProject,
    jobs,
    subscription,
    setShortcutsModalOpen,
    setApiModalOpen,
    setActiveSection,
    addToast,
    t,
    formatNumber
  } = useApp();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const runningJobs = jobs.filter((j) => j.status !== 'Completed' && j.status !== 'Failed');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    createProject(newProjectName.trim(), 'Created in VELORA Studio');
    setNewProjectName('');
    setNewProjectModal(false);
  };

  return (
    <header className="h-16 border-b border-white/[0.07] bg-[#0A0A0B]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Project Selector & Status */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs sm:text-sm text-zinc-200 font-medium transition-all group"
          >
            <FolderOpen className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0" />
            <span className="max-w-[120px] sm:max-w-[200px] truncate font-medium">
              {activeProject ? activeProject.name : t('common.selectProject')}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-[#111113] border border-white/[0.1] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-3 py-1.5">
                {t('common.switchProject')}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProject(p);
                      setProjectDropdownOpen(false);
                      addToast(`${t('common.active')}: ${p.name}`, 'info');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      activeProject?.id === p.id
                        ? 'bg-violet-600/15 text-white font-semibold'
                        : 'text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{p.resolution}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-white/[0.08] mt-1 pt-1">
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    setNewProjectModal(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-violet-400 hover:bg-violet-500/10 flex items-center gap-2 transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('common.newProject')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Autosave & Cloud Sync Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-[11px]">{t('common.cloudAutosaved')}</span>
        </div>
      </div>

      {/* Right: Language Selector, Render Queue, Credits, Shortcuts, Export */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector Dropdown */}
        <LanguageSelector variant="compact" />

        {/* Render Queue Pulse */}
        {runningJobs.length > 0 && (
          <button
            onClick={() => setActiveSection('history')}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-medium animate-pulse"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400 shrink-0" />
            <span className="hidden sm:inline">
              {runningJobs.length} {runningJobs.length === 1 ? t('common.jobRendering') : t('common.jobsRendering')}
            </span>
            <span className="sm:hidden font-mono">{runningJobs.length}</span>
          </button>
        )}

        {/* Credits Meter */}
        <div
          onClick={() => setActiveSection('settings')}
          className="cursor-pointer flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-colors"
          title={`${t('common.credits')}`}
        >
          <Coins className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-white tracking-wide">
              {subscription.plan === 'Unlimited' ? '∞' : formatNumber(subscription.creditsRemaining)}
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400 font-mono uppercase">{subscription.plan}</span>
          </div>
        </div>

        {/* API Integrations Button */}
        <button
          onClick={() => setApiModalOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-zinc-300 transition-colors"
          title="API Providers & Keys"
        >
          <Key className="w-3.5 h-3.5 text-zinc-400" />
          <span>API</span>
        </button>

        {/* Keyboard Shortcuts Button */}
        <button
          onClick={() => setShortcutsModalOpen(true)}
          className="hidden sm:block p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          title="Shortcuts (?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Export Master Video Button (Primary CTA) */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{t('common.exportMaster')}</span>
          <span className="sm:hidden">{t('common.export')}</span>
        </button>
      </div>

      {/* New Project Modal */}
      {newProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/[0.1] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1">{t('projects.createNew')}</h3>
            <p className="text-xs text-zinc-400 mb-4">{t('projects.subtitle')}</p>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">{t('projects.projectName')}</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Mansão Jardim Europa"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm"
                >
                  {t('projects.createProjectBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

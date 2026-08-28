import React, { useState } from 'react';
import {
  Home,
  Wand2,
  Building2,
  FolderKanban,
  Film,
  LayoutGrid,
  Library,
  Sliders,
  Sparkles,
  History,
  Palette,
  Code2,
  ShieldAlert,
  Settings,
  User,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';
import { VeloraLogo, VeloraSymbol } from '../brand/VeloraLogo';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, subscription, t } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const creationNav: NavItem[] = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'generate', label: t('nav.generate'), icon: Wand2 },
    { id: 'editor', label: t('nav.editor'), icon: Film },
    { id: 'storyboard', label: t('nav.storyboard'), icon: LayoutGrid },
    { id: 'projects', label: t('nav.projects'), icon: FolderKanban },
    { id: 'assets', label: t('nav.assets'), icon: Library },
    { id: 'templates', label: t('nav.templates'), icon: Sliders },
  ];

  const toolsNav: NavItem[] = [
    { id: 'real-estate', label: t('nav.realEstate'), icon: Building2 },
    { id: 'enhance', label: t('nav.enhance'), icon: Sparkles, badge: '8K' },
    { id: 'history', label: t('nav.history'), icon: History },
    { id: 'brand-kit', label: 'Brand & Design', icon: Palette },
    { id: 'api', label: t('nav.api'), icon: Code2 },
    { id: 'admin', label: t('nav.admin'), icon: ShieldAlert },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1 mb-5">
      {!collapsed && (
        <div className="px-3.5 py-1 text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">
          {title}
        </div>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            title={collapsed ? item.label : undefined}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center px-0' : 'justify-between px-3'
            } py-2 rounded-xl text-xs transition-all relative group ${
              isActive
                ? 'bg-white/[0.08] text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            {/* Active Indicator Bar */}
            {isActive && (
              <div
                className={`absolute ${
                  collapsed ? 'left-1 w-1 h-4' : 'left-0 w-0.5 h-4'
                } bg-violet-500 rounded-full`}
              />
            )}

            <div className="flex items-center gap-3">
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              />
              {!collapsed && (
                <span className="truncate tracking-tight">{item.label}</span>
              )}
            </div>

            {!collapsed && item.badge && (
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`border-r border-white/[0.07] bg-[#0A0A0B] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30 transition-all duration-300 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div
          className={`h-16 border-b border-white/[0.07] px-4 flex items-center ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <button
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="VELORA Home"
          >
            <VeloraLogo
              collapsed={collapsed}
              symbolSize={20}
              wordmarkSize="md"
              variant="accent"
              showSubtitle={false}
            />
          </button>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
              title="Recolher menu lateral"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Create Action in Sidebar */}
        <div className="p-3 border-b border-white/[0.04]">
          <button
            onClick={() => setActiveSection('generate')}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] ${
              collapsed ? 'px-0' : 'px-3'
            }`}
            title="Criar Vídeo"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{t('common.create')}</span>}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav
          className={`p-3 overflow-y-auto max-h-[calc(100vh-19rem)] ${
            collapsed ? 'px-2' : 'px-3'
          }`}
        >
          {renderNavGroup('Criar', creationNav)}
          {renderNavGroup('Ferramentas', toolsNav)}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-3 border-t border-white/[0.07] space-y-2 bg-[#0C0C0E]/50">
        {/* Expand toggle when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
            title="Expandir menu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Storage Bar (Expanded only) */}
        {!collapsed && (
          <div className="px-2 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5 font-mono">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3 h-3 text-zinc-400" />
                {t('common.storage')}
              </span>
              <span>
                {(subscription.storageUsedMb / 1024).toFixed(1)} /{' '}
                {(subscription.storageLimitMb / 1024).toFixed(0)} GB
              </span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full"
                style={{
                  width: `${(subscription.storageUsedMb / subscription.storageLimitMb) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Settings button */}
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center px-0' : 'justify-between px-3'
          } py-2 rounded-xl text-xs transition-all ${
            activeSection === 'settings'
              ? 'bg-white/[0.08] text-white font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          }`}
          title={collapsed ? t('nav.settings') : undefined}
        >
          <div className="flex items-center gap-3">
            <Settings
              className={`w-4 h-4 shrink-0 ${
                activeSection === 'settings' ? 'text-violet-400' : 'text-zinc-400'
              }`}
            />
            {!collapsed && <span>{t('nav.settings')}</span>}
          </div>
        </button>

        {/* Profile Card */}
        <div
          onClick={() => setActiveSection('settings')}
          className={`flex items-center ${
            collapsed ? 'justify-center p-2' : 'gap-2.5 p-2'
          } rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] cursor-pointer transition-colors`}
          title="Conta & Preferências"
        >
          <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-violet-400" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-200 truncate flex items-center justify-between">
                <span>Studio Pro</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate">
                {subscription.creditsRemaining} créditos
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

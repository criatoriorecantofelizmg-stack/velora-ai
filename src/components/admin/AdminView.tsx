import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Cpu,
  Activity,
  DollarSign,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe,
  Languages,
  Check,
  Search,
  Sparkles
} from 'lucide-react';
import { apiService } from '../../services/api';
import { AdminTelemetry } from '../../types';
import { LANGUAGES, LanguageMeta } from '../../i18n';
import { useApp } from '../../context/AppContext';

export const AdminView: React.FC = () => {
  const { t, language, setLanguage, addToast } = useApp();
  const [telemetry, setTelemetry] = useState<AdminTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [langSearch, setLangSearch] = useState('');
  const [adminTab, setAdminTab] = useState<'system' | 'languages'>('system');

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminMetrics();
      setTelemetry(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  if (!telemetry) return null;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest mb-1">
            <ShieldAlert className="w-3.5 h-3.5" /> {t('admin.telemetryTitle')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t('admin.telemetryTitle')}</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            {t('admin.telemetrySubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setAdminTab('system')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                adminTab === 'system' ? 'bg-blue-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cluster & GPU
            </button>
            <button
              onClick={() => setAdminTab('languages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                adminTab === 'languages' ? 'bg-blue-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{t('admin.languagesTab')}</span>
            </button>
          </div>

          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 border border-white/10 font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('common.refresh')}</span>
          </button>
        </div>
      </div>

      {adminTab === 'system' && (
        <>
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#10121d] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-400" /> Success Rate</span>
                <span className="text-emerald-400 font-bold font-mono">99.4%</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{telemetry.successRatePercentage}%</div>
              <div className="text-[10px] text-zinc-500">Autonomous retry on transient API timeouts</div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#10121d] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> Avg Render Speed</span>
                <span className="text-blue-400 font-bold font-mono">Fast</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{telemetry.avgRenderTimeSec}s</div>
              <div className="text-[10px] text-zinc-500">Across 1080p, 4K and 8K queues</div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#10121d] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-amber-400" /> Compute Cost / Video</span>
                <span className="text-amber-400 font-bold font-mono">Optimized</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">${telemetry.avgCostPerVideoUsd.toFixed(3)}</div>
              <div className="text-[10px] text-zinc-500">Total today: ${telemetry.totalApiCostTodayUsd}</div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#10121d] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-purple-400" /> Active GPU Nodes</span>
                <span className="text-purple-400 font-bold font-mono">Live</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{telemetry.activeGPUQueues} Clusters</div>
              <div className="text-[10px] text-zinc-500">Auto-scaling enabled on Cloud Run</div>
            </div>
          </div>

          {/* Provider Matrix */}
          <div className="rounded-2xl border border-white/10 bg-[#10121d] p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Neural Provider Health & Latency
            </h3>
            <div className="space-y-3">
              {telemetry.providerMetrics.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="font-bold text-white uppercase tracking-wider">{p.provider}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400">
                      {p.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-[11px] text-zinc-400">
                    <span>Latency: <strong className="text-white">{p.latencyMs}ms</strong></span>
                    <span>Success: <strong className="text-emerald-400">{p.successRate}%</strong></span>
                    <span>Jobs Today: <strong className="text-white">{p.totalCallsToday}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Languages Administration Matrix */}
      {adminTab === 'languages' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#10121d] space-y-2">
              <div className="text-zinc-400 text-xs flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Total de Idiomas Ativos</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{LANGUAGES.length} Idiomas</div>
              <div className="text-[10px] text-emerald-400 font-mono">100% de cobertura de chaves de UI</div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#10121d] space-y-2">
              <div className="text-zinc-400 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Idioma Padrão do Sistema</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">Português (Brasil)</div>
              <div className="text-[10px] text-zinc-500 font-mono">Fallback prioritário: pt-BR</div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#10121d] space-y-2">
              <div className="text-zinc-400 text-xs flex items-center gap-2">
                <Languages className="w-4 h-4 text-purple-400" />
                <span>Suporte RTL (Direita para Esquerda)</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">Árabe (العربية)</div>
              <div className="text-[10px] text-zinc-500 font-mono">Layout espelhado com suporte CSS nativo</div>
            </div>
          </div>

          {/* Languages Table Card */}
          <div className="rounded-2xl border border-white/10 bg-[#10121d] p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Languages className="w-4 h-4 text-amber-400" />
                  <span>Matriz de Localização e Internacionalização</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Gerenciamento de dicionários, cobertura de termos técnicos e regionalização.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder="Buscar idioma..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px]">
                    <th className="pb-3 px-3">Idioma</th>
                    <th className="pb-3 px-3">Código</th>
                    <th className="pb-3 px-3">Direção</th>
                    <th className="pb-3 px-3">Região / Moeda</th>
                    <th className="pb-3 px-3">Cobertura</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredLanguages.map((l) => {
                    const isCurrent = language === l.code;
                    const isDefault = l.code === 'pt-BR';
                    return (
                      <tr key={l.code} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{l.flag}</span>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{l.name}</span>
                                {isDefault && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                    PADRÃO
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-zinc-400">{l.nativeName}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-zinc-300">{l.code}</td>

                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                            l.dir === 'rtl' ? 'bg-purple-500/20 text-purple-300 font-bold' : 'bg-white/[0.05] text-zinc-400'
                          }`}>
                            {l.dir.toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-zinc-300 font-mono text-[11px]">
                          {l.defaultRegion} ({l.defaultCurrency})
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                            </div>
                            <span className="font-mono text-[11px] text-emerald-400">100%</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setLanguage(l.code);
                              addToast(`Interface alterada para ${l.nativeName}`, 'success');
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              isCurrent
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                            }`}
                          >
                            {isCurrent ? 'Em Uso' : 'Testar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

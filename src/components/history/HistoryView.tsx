import React, { useState } from 'react';
import {
  History,
  Trash2,
  Maximize2,
  Film,
  Download,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GenerationJob } from '../../types';

export const HistoryView: React.FC = () => {
  const { jobs, deleteJob, setComparisonItem, setFeedbackJob, setActiveSection, updateGenParams, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('All');

  const filtered = jobs.filter((j) => {
    const matchesSearch = j.params.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = filterProvider === 'All' || j.providerUsed === filterProvider;
    return matchesSearch && matchesProvider;
  });

  const handleRemix = (job: GenerationJob) => {
    updateGenParams({ ...job.params });
    setActiveSection('generate');
    addToast('Parâmetros da geração carregados no estúdio!', 'info');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
            <History className="w-3.5 h-3.5" /> Generation Archive & Neural History
          </div>
          <h1 className="text-3xl font-black text-white">Generations Log ({jobs.length})</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Audit renders, review model fidelity, remix prompts, and download uncompressed deliverables.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="bg-[#10121d] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="bg-[#10121d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Providers</option>
            <option value="google-veo">Google Veo 3.1</option>
            <option value="runway-gen3">Runway Gen-3</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-white/10 bg-[#10121d] overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all shadow-xl"
          >
            {/* Video preview */}
            <div className="relative aspect-video bg-black overflow-hidden border-b border-white/10">
              {job.status === 'Completed' && job.resultVideoUrl ? (
                <video
                  src={job.resultVideoUrl}
                  poster={job.thumbnailUrl}
                  muted
                  loop
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-blue-950/20 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin mb-2" />
                  <span className="text-xs font-mono text-blue-300 font-bold">{job.status}</span>
                </div>
              )}

              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 font-bold border border-white/10">
                {job.params.durationSeconds}s • {job.params.resolution}
              </div>

              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-blue-600/80 backdrop-blur-md text-[10px] font-mono text-white border border-blue-400/30 font-semibold">
                {job.providerUsed.replace('google-', '').toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
              <div className="space-y-2">
                <p className="font-semibold text-white leading-relaxed line-clamp-3">{job.params.prompt}</p>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1">
                  <span>Camera: {job.params.camera.movement}</span>
                  <span>{new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (job.thumbnailUrl && job.resultVideoUrl) {
                        setComparisonItem({
                          beforeUrl: job.params.initialImageUrl || job.thumbnailUrl,
                          afterUrl: job.thumbnailUrl,
                          title: job.params.prompt,
                        });
                      }
                    }}
                    className="py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 font-medium border border-white/10"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    Compare
                  </button>

                  <button
                    onClick={() => handleRemix(job)}
                    className="py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 font-medium border border-white/10"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    Remix
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveSection('editor');
                      addToast('Geração adicionada à timeline do editor!', 'success');
                    }}
                    className="flex-1 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Edit in Timeline</span>
                  </button>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-600/20 text-zinc-400 hover:text-rose-300 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

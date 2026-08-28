import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Film,
  Calendar,
  Layers,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const { projects, activeProject, setActiveProject, createProject, deleteProject, setActiveSection, addToast } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const p = createProject(name.trim(), description.trim() || 'Custom video project', aspectRatio);
    setName('');
    setDescription('');
    setModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
            <FolderKanban className="w-3.5 h-3.5" /> Project Workspace Manager
          </div>
          <h1 className="text-3xl font-black text-white">Projects Directory</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Organize multi-shot scenes, audio compositions, and deliverables across production folders.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isActive = activeProject?.id === project.id;
          return (
            <div
              key={project.id}
              className={`rounded-2xl border bg-[#10121d] overflow-hidden flex flex-col justify-between transition-all group ${
                isActive ? 'border-blue-500 shadow-xl shadow-blue-950/40' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden border-b border-white/10">
                <img
                  src={project.thumbnailUrl}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 font-bold border border-white/10">
                  {project.aspectRatio} • {project.resolution}
                </div>

                {isActive && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-blue-600 text-[10px] font-mono text-white font-bold shadow-md">
                    ACTIVE PROJECT
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base truncate">{project.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{project.description}</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                    <span>{project.tracks.reduce((acc, t) => acc + t.clips.length, 0)} Clips in Timeline</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveProject(project);
                        setActiveSection('editor');
                        addToast(`Projeto "${project.name}" aberto no editor!`, 'info');
                      }}
                      className="flex-1 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Open in Editor</span>
                    </button>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-600/20 text-zinc-400 hover:text-rose-300 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1">Create Project</h3>
            <p className="text-xs text-zinc-400 mb-4">Set up a production workspace container.</p>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Project Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Monaco Yacht Launch 2026"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project goals, deliverable formats..."
                  rows={3}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="16:9" className="bg-[#12141e]">16:9 Cinema Widescreen</option>
                  <option value="9:16" className="bg-[#12141e]">9:16 Vertical (Reels / TikTok)</option>
                  <option value="1:1" className="bg-[#12141e]">1:1 Square (E-Commerce Ad)</option>
                  <option value="21:9" className="bg-[#12141e]">21:9 Anamorphic Master</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/40"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

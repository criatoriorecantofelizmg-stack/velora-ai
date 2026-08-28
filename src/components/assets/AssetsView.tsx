import React, { useState } from 'react';
import {
  Library,
  Plus,
  Trash2,
  Lock,
  User,
  Building,
  Box,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReferenceAsset } from '../../types';

export const AssetsView: React.FC = () => {
  const { assets, addAsset, updateGenParams, setActiveSection, addToast } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<ReferenceAsset['type']>('house');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagInput, setTagInput] = useState('Cinema, 4K');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim()) return;
    addAsset({
      name: name.trim(),
      type,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      tags: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setName('');
    setImageUrl('');
    setDescription('');
    setModalOpen(false);
  };

  const handleUseAsLock = (asset: ReferenceAsset) => {
    updateGenParams({
      initialImageUrl: asset.imageUrl,
      mode: 'image-to-video',
      preserveReference: 'Maximum',
      consistency: {
        characterLock: asset.type === 'character',
        faceLock: asset.type === 'character',
        objectLock: asset.type === 'product',
        environmentLock: asset.type === 'environment' || asset.type === 'house',
        styleLock: true,
        cameraLock: true,
      },
    });
    setActiveSection('generate');
    addToast(`Ativo "${asset.name}" fixado como âncora de consistência neural!`, 'success');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <Library className="w-3.5 h-3.5" /> Identity & Reference Anchors
          </div>
          <h1 className="text-3xl font-black text-white">Reference Library</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Store consistent character faces, recurring products, and architectural environments to lock across generations.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Save Reference Asset</span>
        </button>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-2xl border border-white/10 bg-[#10121d] overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all shadow-xl"
          >
            {/* Image Preview */}
            <div className="relative aspect-square bg-black overflow-hidden border-b border-white/10">
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-emerald-300 font-bold border border-white/10 uppercase flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                {asset.type}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
              <div>
                <h4 className="font-bold text-white text-sm truncate">{asset.name}</h4>
                <p className="text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{asset.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {asset.tags?.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[9px] font-mono text-zinc-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => handleUseAsLock(asset)}
                  className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lock & Generate</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Asset Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1">Save Reference Asset</h3>
            <p className="text-xs text-zinc-400 mb-4">Register an identity, environment, or object to ensure consistency.</p>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Bedroom Suite"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Asset Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="house" className="bg-[#12141e]">Real Estate / Property</option>
                  <option value="character" className="bg-[#12141e]">Character Face / Person</option>
                  <option value="product" className="bg-[#12141e]">Commercial Product</option>
                  <option value="environment" className="bg-[#12141e]">Environment / Landscape</option>
                  <option value="style" className="bg-[#12141e]">Visual Style Anchor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description & Key Visual Features</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. White oak floors, floor-to-ceiling glass, natural linen bedding..."
                  rows={2}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/40"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

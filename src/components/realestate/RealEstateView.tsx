import React, { useState } from 'react';
import {
  Building2,
  UploadCloud,
  Sparkles,
  Camera,
  ShieldCheck,
  Plus,
  Trash2,
  Clapperboard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RealEstateView: React.FC = () => {
  const {
    realEstateImages,
    setRealEstateImages,
    analyzedRooms,
    isAnalyzingRealEstate,
    analyzeRealEstatePhotos,
    generateRealEstateStoryboard,
    addToast,
    language
  } = useApp();

  const [propertyType, setPropertyType] = useState('Luxury Residence / Villa');

  const samplePhotoUrls = [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleAddSamplePhotos = () => {
    setRealEstateImages(samplePhotoUrls);
    addToast('Fotos de demonstração de imóvel carregadas!', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setRealEstateImages((prev) => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      addToast(`${files.length} fotos adicionadas ao lote imobiliário!`, 'success');
    }
  };

  const removePhoto = (idx: number) => {
    setRealEstateImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAnalyze = async () => {
    if (realEstateImages.length === 0) {
      addToast('Carregue ao menos 1 foto do imóvel para analisar.', 'warning');
      return;
    }
    await analyzeRealEstatePhotos(realEstateImages, propertyType);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Header Banner */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest">
          <Building2 className="w-3.5 h-3.5 text-violet-400" />
          <span>Real Estate & Architectural Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {language === 'pt-BR' ? 'Tour Cinematográfico de Imóveis' : 'AI Real Estate Cinema Tour'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          {language === 'pt-BR'
            ? 'Transforme fotos de imóveis e Airbnb em vídeos arquitetônicos com fidelidade geométrica total e iluminação natural.'
            : 'Transform listing photos into Hollywood-grade architectural video walkthroughs with geometric fidelity.'}
        </p>
      </div>

      {/* Step 1: Upload Photos */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-violet-400" />
              Etapa 1: Fotos do Imóvel ({realEstateImages.length} carregadas)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Carregue imagens de fachada, salas, cozinha, suítes e área externa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddSamplePhotos}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-zinc-300 transition-colors"
            >
              Carregar Fotos Demo
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzingRealEstate || realEstateImages.length === 0}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-40"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingRealEstate ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingRealEstate ? 'Analisando cômodos...' : 'Analisar com IA'}</span>
            </button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Upload Button Box */}
          <div className="relative border border-dashed border-white/[0.12] hover:border-violet-500/50 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/[0.01] min-h-[120px]">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <Plus className="w-5 h-5 text-zinc-400 mb-1" />
            <span className="text-xs font-medium text-zinc-300">Adicionar Fotos</span>
            <span className="text-[10px] text-zinc-500">Arraste ou clique</span>
          </div>

          {/* Uploaded Photos */}
          {realEstateImages.map((img, i) => (
            <div
              key={i}
              className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden border border-white/[0.08] group bg-black"
            >
              <img src={img} alt={`Listing ${i}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => removePhoto(i)}
                  className="p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-600 transition-colors"
                  title="Remover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="absolute bottom-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-300">
                #{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Analyzed Rooms & Camera Sequences */}
      {analyzedRooms.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 sm:p-6 space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Etapa 2: Reconhecimento de Ambientes & Trajetórias
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                O diretor neural mapeou os movimentos ideais para cada ambiente.
              </p>
            </div>

            <button
              onClick={generateRealEstateStoryboard}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Clapperboard className="w-4 h-4" />
              <span>Gerar Storyboard Completo & Renderizar</span>
            </button>
          </div>

          {/* Rooms List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {analyzedRooms.map((room) => (
              <div
                key={room.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-white/[0.06]">
                    <img src={room.imageUrl} alt={room.label} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-emerald-400 font-semibold">
                      {room.detectedType.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white">{room.label}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{room.promptGenerated}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Movimento:</span>
                    <span className="font-mono text-violet-300">{room.recommendedMovement}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Duração:</span>
                    <span className="font-mono text-zinc-300">{room.suggestedDuration}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

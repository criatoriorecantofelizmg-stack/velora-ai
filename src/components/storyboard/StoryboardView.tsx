import React, { useState } from 'react';
import {
  LayoutGrid,
  Sparkles,
  Plus,
  Play,
  Trash2,
  Clapperboard,
  Camera,
  Layers,
  ArrowRight,
  Clock,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { StoryboardScene } from '../../types';

export const StoryboardView: React.FC = () => {
  const {
    storyboardScenes,
    addStoryboardScene,
    removeStoryboardScene,
    generateAllStoryboardScenes,
    setActiveSection,
    addToast,
  } = useApp();

  const [aiGoal, setAiGoal] = useState('Luxury Airbnb 30-Second Commercial Walkthrough');
  const [isPlanning, setIsPlanning] = useState(false);

  const handleAIPlan = async () => {
    if (!aiGoal.trim()) return;
    setIsPlanning(true);
    try {
      const plan = await apiService.getDirectorPlan({ goal: aiGoal, totalDurationSeconds: 30 });
      // replace or append scenes
      plan.scenes.forEach((sc) => addStoryboardScene(sc));
      addToast(`Roteiro com ${plan.totalScenes} tomadas cinematográficas gerado pelo Diretor IA!`, 'success');
    } catch (err: any) {
      addToast('Erro ao planejar cenas: ' + err.message, 'error');
    } finally {
      setIsPlanning(false);
    }
  };

  const handleAddNewManualScene = () => {
    addStoryboardScene({
      title: `Shot 0${storyboardScenes.length + 1}`,
      prompt: 'Cinematic wide tracking shot, natural daylight, steady gimbal movement.',
      duration: 5,
      cameraMovement: 'Dolly In',
      speed: 'Slow',
      audioMood: 'Soft ambient music',
      status: 'ready',
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 border border-white/10 bg-gradient-to-r from-indigo-950/30 via-[#10121d] to-blue-950/30 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Clapperboard className="w-3.5 h-3.5" /> AI Storyboard & Multi-Shot Director
          </div>
          <h1 className="text-3xl font-black text-white">Multi-Scene Production Planner</h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Plan complete commercials, real estate tours, and narrative films shot by shot. Maintain character and environment continuity across multiple distinct camera angles.
          </p>

          {/* AI Director Auto-Generator Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="flex-1 w-full relative">
              <input
                type="text"
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                placeholder="Describe production goal (e.g. 30s Luxury Airbnb Tour, High-Impact Watch Commercial)..."
                className="w-full bg-[#0a0b12] border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleAIPlan}
              disabled={isPlanning || !aiGoal.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-900/30 transition-all shrink-0 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isPlanning ? 'animate-spin' : ''}`} />
              <span>{isPlanning ? 'Writing Script...' : 'AI Director Script Plan'}</span>
            </button>

            <button
              onClick={generateAllStoryboardScenes}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Batch Render All ({storyboardScenes.length} Shots)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scenes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-blue-400" />
            Storyboard Sequence ({storyboardScenes.length} Scenes)
          </h3>

          <button
            onClick={handleAddNewManualScene}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 border border-white/10 font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scene</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {storyboardScenes.map((scene) => (
            <div
              key={scene.id}
              className="rounded-2xl border border-white/10 bg-[#10121d] overflow-hidden flex flex-col justify-between shadow-xl hover:border-white/20 transition-all group"
            >
              {/* Scene Visual / Preview */}
              <div className="relative aspect-video bg-black overflow-hidden border-b border-white/10">
                {scene.generatedVideoUrl ? (
                  <video
                    src={scene.generatedVideoUrl}
                    poster={scene.imageUrl}
                    controls
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : scene.imageUrl ? (
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-blue-950/20 text-zinc-500 text-xs">
                    <Clapperboard className="w-8 h-8 mb-1 text-zinc-600" />
                    <span>Ready to Render</span>
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-white font-bold border border-white/10">
                  SCENE #{scene.sceneNumber} • {scene.duration}s
                </div>

                <button
                  onClick={() => removeStoryboardScene(scene.id)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-zinc-300 hover:text-white transition-colors"
                  title="Remove Scene"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scene Description & Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-sm">{scene.title}</h4>
                  <p className="text-zinc-300 line-clamp-3 leading-relaxed">{scene.prompt}</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-blue-400" /> Camera:
                    </span>
                    <span className="font-mono text-blue-300 font-semibold">{scene.cameraMovement}</span>
                  </div>

                  {scene.audioMood && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-pink-400" /> Audio:
                      </span>
                      <span className="font-mono text-zinc-300 truncate max-w-[160px]">{scene.audioMood}</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setActiveSection('editor');
                      addToast(`Cena "${scene.title}" aberta no editor!`, 'info');
                    }}
                    className="w-full py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-center font-medium transition-colors"
                  >
                    Open in Timeline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

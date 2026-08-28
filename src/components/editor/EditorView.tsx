import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Scissors,
  Copy,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Wand2,
  Volume2,
  VolumeX,
  Type,
  Music,
  Film,
  Plus,
  Sparkles,
  Layers,
  Sliders,
  Maximize2,
  SplitSquareVertical,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { TimelineClip, TimelineTrack } from '../../types';

export const EditorView: React.FC = () => {
  const {
    activeProject,
    timelineTracks,
    setTimelineTracks,
    playheadPosition,
    setPlayheadPosition,
    isPlaying,
    setIsPlaying,
    zoomLevel,
    setZoomLevel,
    selectedClipId,
    setSelectedClipId,
    splitSelectedClip,
    duplicateSelectedClip,
    deleteSelectedClip,
    undoTimeline,
    redoTimeline,
    canUndo,
    canRedo,
    updateClip,
    addClipToTrack,
    addToast,
  } = useApp();

  const [aiEditCommand, setAiEditCommand] = useState('');
  const [isParsingAiEdit, setIsParsingAiEdit] = useState(false);
  const [aiEditResult, setAiEditResult] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Find active selected clip
  let selectedClip: TimelineClip | null = null;
  timelineTracks.forEach((t) => {
    const c = t.clips.find((clip) => clip.id === selectedClipId);
    if (c) selectedClip = c;
  });

  // Calculate total timeline duration
  let maxDuration = 20;
  timelineTracks.forEach((t) => {
    t.clips.forEach((c) => {
      if (c.startTime + c.duration > maxDuration) {
        maxDuration = c.startTime + c.duration;
      }
    });
  });

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayheadPosition((pos) => {
          if (pos >= maxDuration) {
            setIsPlaying(false);
            return 0;
          }
          return pos + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxDuration]);

  // Sync video element time with playhead
  useEffect(() => {
    if (videoRef.current) {
      if (Math.abs(videoRef.current.currentTime - playheadPosition) > 0.3) {
        videoRef.current.currentTime = playheadPosition;
      }
    }
  }, [playheadPosition]);

  // Execute AI Edit Command
  const handleAIEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiEditCommand.trim()) return;

    setIsParsingAiEdit(true);
    try {
      const result = await apiService.parseAIEditCommand(aiEditCommand, selectedClip);
      setAiEditResult(result);
      addToast(`Comando de edição analisado: ${result.actionType.toUpperCase()}`, 'success');

      if (selectedClip) {
        updateClip(selectedClip.id, {
          aiEditMask: {
            promptInstruction: aiEditCommand,
            brushArea: result.targetArea,
          },
        });
      }
    } catch (err: any) {
      addToast('Erro ao processar edição IA: ' + err.message, 'error');
    } finally {
      setIsParsingAiEdit(false);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Top Section: Video Preview Canvas & AI Edit Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Center Preview Player (7 cols) */}
        <div className="lg:col-span-8 bg-[#10121d] rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-2xl overflow-hidden">
          {/* Top Canvas Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white truncate max-w-[200px]">
                {activeProject ? activeProject.name : 'Master Timeline'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400">
                4K UHD • 24 FPS
              </span>
            </div>
            <div className="font-mono text-zinc-300 font-bold">
              {playheadPosition.toFixed(2)}s / {maxDuration.toFixed(2)}s
            </div>
          </div>

          {/* Player Screen */}
          <div className="relative flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center my-3 border border-white/10">
            <video
              ref={videoRef}
              src="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-living-room-and-kitchen-41221-large.mp4"
              className="max-h-full max-w-full object-contain"
              muted
              playsInline
            />

            {/* AI Mask Overlay indicator if applied */}
            {selectedClip?.aiEditMask && (
              <div className="absolute top-4 left-4 bg-amber-500/20 border border-amber-500/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-amber-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Inpainting Mask: "{selectedClip.aiEditMask.promptInstruction}"</span>
              </div>
            )}
          </div>

          {/* Quick Playhead Transport Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 transition-colors"
                title="Play/Pause (Space)"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={() => setPlayheadPosition(0)}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 font-mono"
              >
                00:00
              </button>
            </div>

            {/* AI Edit Command Input Bar */}
            <form onSubmit={handleAIEdit} className="flex-1 max-w-lg mx-4">
              <div className="relative flex items-center bg-white/[0.04] border border-white/15 focus-within:border-blue-500 rounded-xl px-3 py-1.5 shadow-inner">
                <Wand2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={aiEditCommand}
                  onChange={(e) => setAiEditCommand(e.target.value)}
                  placeholder="AI Edit prompt (e.g. Remove coffee table, Change lighting to blue hour)..."
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isParsingAiEdit || !aiEditCommand.trim()}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all shrink-0 ml-2 disabled:opacity-40"
                >
                  {isParsingAiEdit ? 'Processing...' : 'Apply AI Edit'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Inspector & Tools (4 cols) */}
        <div className="lg:col-span-4 bg-[#10121d] rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Clip Inspector & Properties
              </h3>
              {selectedClip && (
                <span className="text-[10px] font-mono text-blue-400 font-semibold">
                  {selectedClip.type.toUpperCase()}
                </span>
              )}
            </div>

            {selectedClip ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    value={selectedClip.title}
                    onChange={(e) => updateClip(selectedClip!.id, { title: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1">Duration (s)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedClip.duration}
                      onChange={(e) => updateClip(selectedClip!.id, { duration: Math.max(1, Number(e.target.value)) })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1">Speed</label>
                    <select
                      value={selectedClip.speed || 1.0}
                      onChange={(e) => updateClip(selectedClip!.id, { speed: Number(e.target.value) })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="0.5" className="bg-[#12141e]">0.5x (Slow-Mo)</option>
                      <option value="1.0" className="bg-[#12141e]">1.0x (Normal)</option>
                      <option value="1.5" className="bg-[#12141e]">1.5x (Fast)</option>
                      <option value="2.0" className="bg-[#12141e]">2.0x (Timelapse)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1">Volume ({selectedClip.volume || 100}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedClip.volume ?? 100}
                    onChange={(e) => updateClip(selectedClip!.id, { volume: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1">Transition In</label>
                  <select
                    value={selectedClip.transitionIn || 'none'}
                    onChange={(e) => updateClip(selectedClip!.id, { transitionIn: e.target.value as any })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="none" className="bg-[#12141e]">None (Hard Cut)</option>
                    <option value="fade" className="bg-[#12141e]">Fade from Black</option>
                    <option value="crossfade" className="bg-[#12141e]">Smooth Dissolve / Crossfade</option>
                    <option value="wipe" className="bg-[#12141e]">Directional Wipe</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-zinc-500">
                Click a clip in the timeline below to inspect and customize properties.
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
            <button
              onClick={splitSelectedClip}
              disabled={!selectedClipId}
              className="flex-1 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5 disabled:opacity-40"
              title="Split at playhead (S)"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>

            <button
              onClick={duplicateSelectedClip}
              disabled={!selectedClipId}
              className="flex-1 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5 disabled:opacity-40"
              title="Duplicate (Cmd+D)"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={deleteSelectedClip}
              disabled={!selectedClipId}
              className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs disabled:opacity-40"
              title="Delete Clip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Multi-Track Timeline */}
      <div className="bg-[#10121d] rounded-2xl border border-white/10 p-5 shadow-2xl space-y-4">
        {/* Timeline Toolbar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              onClick={undoTimeline}
              disabled={!canUndo}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white disabled:opacity-40"
              title="Undo (Cmd+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redoTimeline}
              disabled={!canRedo}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white disabled:opacity-40"
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-white/10 mx-2" />

            <button
              onClick={splitSelectedClip}
              className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 flex items-center gap-1.5"
            >
              <Scissors className="w-3.5 h-3.5" /> Split (S)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Zoom:</span>
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              className="p-1 rounded bg-white/[0.04] text-zinc-400 hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-zinc-300">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel(Math.min(3.0, zoomLevel + 0.25))}
              className="p-1 rounded bg-white/[0.04] text-zinc-400 hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tracks Container */}
        <div className="space-y-3 overflow-x-auto pb-2">
          {timelineTracks.map((track) => (
            <div key={track.id} className="flex items-center gap-4 group">
              {/* Track Header (Name & Mute) */}
              <div className="w-44 shrink-0 flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  {track.type === 'video' ? (
                    <Film className="w-3.5 h-3.5 text-blue-400" />
                  ) : track.type === 'text' ? (
                    <Type className="w-3.5 h-3.5 text-pink-400" />
                  ) : (
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span className="text-xs font-semibold text-zinc-200 truncate">{track.name}</span>
                </div>
                <button
                  onClick={() => {
                    setTimelineTracks((prev) =>
                      prev.map((t) => (t.id === track.id ? { ...t, muted: !t.muted } : t))
                    );
                  }}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  {track.muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Track Content Timeline Lane */}
              <div
                className="relative h-12 flex-1 bg-black/40 rounded-xl border border-white/[0.06] overflow-hidden"
                style={{ width: `${maxDuration * 50 * zoomLevel}px` }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newTime = (clickX / (50 * zoomLevel));
                  setPlayheadPosition(Math.max(0, Math.min(maxDuration, newTime)));
                }}
              >
                {/* Clips in this track */}
                {track.clips.map((clip) => {
                  const isSelected = selectedClipId === clip.id;
                  return (
                    <div
                      key={clip.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClipId(clip.id);
                      }}
                      className={`absolute top-1 bottom-1 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer select-none transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'border-white bg-blue-600/50 shadow-lg text-white font-bold'
                          : 'border-white/10 bg-blue-900/30 text-blue-200 hover:bg-blue-900/50'
                      }`}
                      style={{
                        left: `${clip.startTime * 50 * zoomLevel}px`,
                        width: `${clip.duration * 50 * zoomLevel}px`,
                      }}
                    >
                      <span className="truncate">{clip.title}</span>
                      <span className="text-[10px] font-mono opacity-70 shrink-0 ml-1">{clip.duration}s</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

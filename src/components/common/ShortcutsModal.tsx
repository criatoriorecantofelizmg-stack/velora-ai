import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShortcutsModal: React.FC = () => {
  const { shortcutsModalOpen, setShortcutsModalOpen } = useApp();

  if (!shortcutsModalOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Video Timeline' },
    { key: 'Ctrl/Cmd + Z', desc: 'Undo last timeline edit' },
    { key: 'Ctrl/Cmd + Shift + Z', desc: 'Redo timeline edit' },
    { key: 'S', desc: 'Split clip at playhead position' },
    { key: 'Delete / Backspace', desc: 'Delete selected clip' },
    { key: 'Ctrl/Cmd + D', desc: 'Duplicate selected clip' },
    { key: 'M', desc: 'Mute / Unmute current track' },
    { key: 'L', desc: 'Lock / Unlock track editing' },
    { key: 'E', desc: 'Open AI Prompt Enhancer' },
    { key: 'G', desc: 'Quick Dispatch Video Generation' },
    { key: '?', desc: 'Toggle Shortcuts Guide' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141e] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
            >
              <span className="text-xs text-zinc-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded bg-white/[0.08] border border-white/10 text-xs font-mono font-bold text-amber-300 shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

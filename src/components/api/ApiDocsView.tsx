import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Zap,
  Server,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApiDocsView: React.FC = () => {
  const { setApiModalOpen, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'curl' | 'nodejs' | 'python'>('nodejs');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast('Código copiado!', 'success');
  };

  const nodeCode = `import { VisionAI } from '@vision-ai/sdk';

// Initialize with environment API Key
const vision = new VisionAI({
  apiKey: process.env.VISION_AI_KEY,
});

// Generate 4K Cinema Video
const job = await vision.video.generate({
  prompt: 'Modern architectural villa cantilevered over ocean cliff, sunset golden hour, 35mm lens, slow dolly in',
  provider: 'google-veo',
  resolution: '4K',
  fps: 24,
  durationSeconds: 6,
  camera: {
    movement: 'Dolly In',
    lens: '35mm',
    speed: 'Slow'
  },
  preserveReference: 'Maximum',
  audio: {
    enabled: true,
    type: 'Ambient Sound'
  }
});

console.log('Video Job dispatched:', job.id);
const result = await job.waitForCompletion();
console.log('Master Video URL:', result.videoUrl);`;

  const pythonCode = `import os
from vision_ai import VisionAI

client = VisionAI(api_key=os.environ.get("VISION_AI_KEY"))

response = client.video.generate(
    prompt="Modern architectural villa cantilevered over ocean cliff, 35mm lens",
    provider="google-veo",
    resolution="4K",
    fps=24,
    duration_seconds=6,
    camera_movement="Dolly In",
    preserve_reference="Maximum"
)

print(f"Generated video URL: {response.video_url}")`;

  const curlCode = `curl -X POST https://api.visionai.studio/v1/video/generate \\
  -H "Authorization: Bearer $VISION_AI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Modern architectural villa cantilevered over ocean cliff",
    "provider": "google-veo",
    "resolution": "4K",
    "fps": 24,
    "durationSeconds": 6,
    "camera": {
      "movement": "Dolly In",
      "lens": "35mm"
    },
    "preserveReference": "Maximum"
  }'`;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
            <Code2 className="w-3.5 h-3.5" /> Developer Integration Engine
          </div>
          <h1 className="text-3xl font-black text-white">API & SDK Documentation</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 max-w-2xl">
            Integrate cinema-grade video generation directly into your SaaS platforms, mobile apps, and enterprise marketing pipelines.
          </p>
        </div>

        <button
          onClick={() => setApiModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-all self-start sm:self-auto"
        >
          View Provider Keys
        </button>
      </div>

      {/* Code Sandbox Card */}
      <div className="rounded-2xl border border-white/10 bg-[#10121d] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Start Code Example
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-white/[0.04] p-0.5 border border-white/[0.08]">
              {(['nodejs', 'python', 'curl'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-3 py-1 text-xs rounded-md font-mono font-semibold transition-colors uppercase ${
                    activeTab === lang ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={() => copyCode(activeTab === 'nodejs' ? nodeCode : activeTab === 'python' ? pythonCode : curlCode)}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10"
              title="Copy snippet"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-[#08090f]">
          <pre className="text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto">
            {activeTab === 'nodejs' ? nodeCode : activeTab === 'python' ? pythonCode : curlCode}
          </pre>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="rounded-2xl border border-white/10 bg-[#10121d] p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Core REST API Endpoints
        </h3>
        <div className="space-y-2.5 text-xs">
          {[
            { method: 'POST', path: '/api/video/generate', desc: 'Dispatch generative video job with camera and realism params' },
            { method: 'GET', path: '/api/video/status/:jobId', desc: 'Poll render progress, timeline stages and retrieve CDN video URL' },
            { method: 'POST', path: '/api/video/extend', desc: 'Seamlessly extend scene duration while retaining camera momentum' },
            { method: 'POST', path: '/api/video/upscale', desc: 'Execute 4K/8K AI super-resolution and 60 FPS motion interpolation' },
            { method: 'POST', path: '/api/real-estate/analyze', desc: 'Analyze architectural photo batch and generate cinematic floorplan sequence' },
            { method: 'POST', path: '/api/generate/prompt-enhance', desc: 'Transform plain text into high-fidelity Hollywood camera direction' },
          ].map((ep, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  {ep.method}
                </span>
                <code className="font-mono text-zinc-200 font-semibold">{ep.path}</code>
              </div>
              <span className="text-zinc-400 text-[11px]">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

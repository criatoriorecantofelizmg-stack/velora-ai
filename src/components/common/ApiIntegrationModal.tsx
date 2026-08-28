import React from 'react';
import { X, Key, ExternalLink, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApiIntegrationModal: React.FC = () => {
  const { apiModalOpen, setApiModalOpen, addToast } = useApp();

  if (!apiModalOpen) return null;

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Código copiado para a área de transferência!', 'success');
  };

  const providers = [
    {
      name: 'Google Veo 3.1 & Gemini Video',
      model: 'veo-3.1-generate-preview',
      status: 'Connected (Server Engine Active)',
      envVar: 'GEMINI_API_KEY',
      docsUrl: 'https://ai.google.dev/gemini-api/docs/video-generation',
    },
    {
      name: 'Runway Gen-3 Alpha',
      model: 'gen3a_turbo',
      status: 'Ready for Adapter Integration',
      envVar: 'RUNWAY_API_SECRET',
      docsUrl: 'https://docs.runwayml.com',
    },
    {
      name: 'OpenAI Sora Turbo',
      model: 'sora-1.0-turbo',
      status: 'Ready for Enterprise Token',
      envVar: 'OPENAI_API_KEY',
      docsUrl: 'https://platform.openai.com',
    },
    {
      name: 'Luma Dream Machine',
      model: 'dream-machine-v2',
      status: 'Ready for API Key',
      envVar: 'LUMA_API_KEY',
      docsUrl: 'https://lumalabs.ai/dream-machine/api',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#10121d] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Key className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Video Providers & API Architecture</h3>
              <p className="text-xs text-zinc-400">Pluggable backend adapters. Keys are strictly stored server-side.</p>
            </div>
          </div>
          <button
            onClick={() => setApiModalOpen(false)}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-600/10 border border-blue-500/25 rounded-xl p-3.5 mb-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300">
            <strong className="text-white">Enterprise Security Guarantee:</strong> All proprietary API credentials and Gemini authentication tokens remain safely within container environment variables (<code className="text-blue-300 font-mono">process.env</code>) and are never transmitted to the browser bundle.
          </div>
        </div>

        {/* Providers List */}
        <div className="space-y-3 mb-6">
          {providers.map((p, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between hover:border-white/15 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{p.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400">
                    {p.model}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> {p.status}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-zinc-500">{p.envVar}</span>
                </div>
              </div>

              <button
                onClick={() => copySnippet(`// Server Adapter: ${p.name}\nimport { VideoProvider } from './services/provider';\nexport const ${p.name.replace(/[^a-zA-Z]/g, '')}Adapter = new VideoProvider({ env: process.env.${p.envVar} });`)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 flex items-center gap-1.5 font-medium transition-colors"
              >
                <Copy className="w-3 h-3 text-zinc-400" />
                Copy Adapter
              </button>
            </div>
          ))}
        </div>

        {/* cURL Example */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">REST API Generation Endpoint</span>
            <button
              onClick={() => copySnippet(`curl -X POST https://your-domain.com/api/video/generate \\\n  -H "Content-Type: application/json" \\\n  -d '{"prompt": "Villa Horizon living room push-in", "durationSeconds": 6, "resolution": "4K"}'`)}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy cURL
            </button>
          </div>
          <pre className="p-3 bg-black/60 rounded-xl border border-white/10 text-[11px] font-mono text-zinc-300 overflow-x-auto">
{`POST /api/video/generate
Content-Type: application/json

{
  "prompt": "Modern beachfront villa with pool, slow dolly in, 35mm lens",
  "provider": "google-veo",
  "resolution": "4K",
  "fps": 24,
  "preserveReference": "Maximum"
}`}
          </pre>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setApiModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

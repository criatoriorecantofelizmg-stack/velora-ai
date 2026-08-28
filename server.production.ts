import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const GENERATED_DIR = path.resolve(process.cwd(), 'generated');

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));
app.use('/generated', express.static(GENERATED_DIR));

let client: GoogleGenAI | null = null;
function getAI() {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

type JobStatus = 'Queued' | 'Preparing' | 'Generating' | 'Enhancing' | 'Upscaling' | 'Finalizing' | 'Completed' | 'Failed';
interface Job {
  id: string;
  createdAt: string;
  status: JobStatus;
  progress: number;
  statusMessage: string;
  params: any;
  resultVideoUrl?: string;
  thumbnailUrl?: string;
  durationActual?: number;
  renderingEngine: string;
  providerUsed: string;
  costCredits: number;
  error?: string;
  operation?: any;
  providerVideo?: any;
}

const jobs = new Map<string, Job>();
const completedToday: Job[] = [];

function dataUrlToImage(value?: string) {
  if (!value || !value.startsWith('data:image/')) return undefined;
  const match = value.match(/^data:(image\/[\w.+-]+);base64,(.+)$/s);
  if (!match) return undefined;
  return { imageBytes: match[2], mimeType: match[1] };
}

async function remoteImageToInlineData(url?: string) {
  if (!url) return undefined;
  const direct = dataUrlToImage(url);
  if (direct) return direct;
  if (!/^https?:\/\//i.test(url)) return undefined;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao carregar imagem de referência (${response.status})`);
  const mimeType = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
  const bytes = Buffer.from(await response.arrayBuffer()).toString('base64');
  return { imageBytes: bytes, mimeType };
}

function normalizeAspectRatio(value?: string) {
  return value === '9:16' ? '9:16' : '16:9';
}

function normalizeResolution(value?: string) {
  const v = String(value || '').toLowerCase();
  if (v.includes('4k') || v.includes('2160')) return '4k';
  if (v.includes('1080')) return '1080p';
  return '720p';
}

async function downloadVideo(ai: GoogleGenAI, video: any, jobId: string) {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  const filename = `${jobId}.mp4`;
  const downloadPath = path.join(GENERATED_DIR, filename);
  await ai.files.download({ file: video, downloadPath });
  return `/generated/${filename}`;
}

async function runVeoJob(jobId: string, input: { prompt: string; image?: any; video?: any; config?: any }) {
  const job = jobs.get(jobId);
  if (!job) return;
  const ai = getAI();
  if (!ai) {
    job.status = 'Failed';
    job.progress = 0;
    job.error = 'GEMINI_API_KEY não configurada no servidor.';
    job.statusMessage = job.error;
    return;
  }

  try {
    job.status = 'Preparing';
    job.progress = 10;
    job.statusMessage = 'Enviando solicitação ao Google Veo 3.1...';

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: input.prompt,
      ...(input.image ? { image: input.image } : {}),
      ...(input.video ? { video: input.video } : {}),
      config: input.config || {},
    } as any);
    job.operation = operation;
    job.status = 'Generating';
    job.progress = 30;
    job.statusMessage = 'Veo 3.1 está gerando o vídeo e o áudio...';

    let polls = 0;
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation } as any);
      job.operation = operation;
      polls += 1;
      job.progress = Math.min(88, 35 + polls * 4);
      job.statusMessage = 'Renderização real em andamento no Veo 3.1...';
    }

    const generated = operation?.response?.generatedVideos?.[0];
    const video = generated?.video;
    if (!video) throw new Error('O Veo concluiu a operação sem retornar um arquivo de vídeo.');

    job.status = 'Finalizing';
    job.progress = 94;
    job.statusMessage = 'Baixando e preparando o arquivo final...';
    job.providerVideo = video;
    job.resultVideoUrl = await downloadVideo(ai, video, jobId);
    job.status = 'Completed';
    job.progress = 100;
    job.statusMessage = 'Vídeo gerado com sucesso pelo Google Veo 3.1.';
    completedToday.push(job);
  } catch (error: any) {
    console.error('Veo generation failed:', error);
    job.status = 'Failed';
    job.progress = 0;
    job.error = error?.message || 'Falha desconhecida ao gerar vídeo.';
    job.statusMessage = `Falha na geração: ${job.error}`;
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    service: 'VELORA Core Engine',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    videoProvider: 'Google Veo 3.1',
    realVideoGeneration: true,
    simulatedVideoGeneration: false,
    capabilities: {
      textToVideo: true,
      imageToVideo: true,
      videoExtension: true,
      promptEnhancement: true,
      realEstateVision: true,
      arbitraryVideoUpscale: false,
      destructiveVideoEditing: false,
    },
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/generate/prompt-enhance', async (req: Request, res: Response) => {
  try {
    const { prompt, mode, camera, lens, realism, style } = req.body;
    if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'Prompt é obrigatório' });
    const ai = getAI();
    if (!ai) return res.status(503).json({ error: 'GEMINI_API_KEY não configurada' });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Transforme o prompt abaixo em um prompt profissional para Veo 3.1, preservando rigorosamente a intenção original. Modo: ${mode || 'text-to-video'}. Câmera: ${camera || 'natural'}. Lente: ${lens || '35mm'}. Realismo: ${realism || 'fotorealista'}. Estilo: ${style || 'cinematográfico'}. Retorne somente o prompt final, sem explicações.\n\nPrompt: ${prompt}`,
    });
    res.json({ enhancedPrompt: response.text?.trim() || prompt, source: 'gemini-2.5-flash' });
  } catch (error: any) {
    res.status(500).json({ error: 'Falha ao melhorar prompt', message: error?.message });
  }
});

app.post('/api/real-estate/analyze', async (req: Request, res: Response) => {
  try {
    const images: string[] = Array.isArray(req.body.images) ? req.body.images.slice(0, 12) : [];
    const ai = getAI();
    if (!ai) return res.status(503).json({ error: 'GEMINI_API_KEY não configurada' });
    if (!images.length) return res.status(400).json({ error: 'Envie ao menos uma imagem' });

    const parts: any[] = [{ text: `Analise estas fotos de um imóvel (${req.body.propertyType || 'imóvel'}). Para cada foto, identifique o ambiente real sem inventar elementos, recomende um movimento de câmera seguro para image-to-video e duração entre 4 e 8 segundos. Retorne JSON com {propertyType, rooms:[{index,detectedType,label,confidence,recommendedMovement,suggestedDuration,promptGenerated}],recommendedSoundtrack}. O promptGenerated deve exigir preservação exata da arquitetura, móveis, materiais, iluminação e geometria.` }];
    for (const image of images) {
      const inlineData = await remoteImageToInlineData(image);
      if (inlineData) parts.push({ inlineData });
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
      config: { responseMimeType: 'application/json' },
    } as any);
    const parsed = JSON.parse(response.text || '{}');
    const rooms = (parsed.rooms || []).map((room: any, idx: number) => ({
      id: `room-${Date.now()}-${idx}`,
      imageUrl: images[room.index ?? idx] || images[idx],
      detectedType: room.detectedType || 'ambiente',
      label: room.label || `Ambiente ${idx + 1}`,
      confidence: Number(room.confidence || 90),
      recommendedMovement: room.recommendedMovement || 'Dolly In lento',
      suggestedDuration: Math.max(4, Math.min(8, Number(room.suggestedDuration || 5))),
      promptGenerated: room.promptGenerated || 'Slow cinematic camera movement, preserve the exact architecture, furniture, materials, proportions and lighting of the reference image. Do not add or remove objects.',
      selected: true,
    }));
    res.json({
      propertyType: parsed.propertyType || req.body.propertyType || 'Imóvel',
      roomsDetected: rooms.length,
      rooms,
      recommendedSoundtrack: parsed.recommendedSoundtrack || 'Ambient cinematic minimal',
      estimatedTourDurationSeconds: rooms.reduce((sum: number, room: any) => sum + room.suggestedDuration, 0),
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao analisar imóvel', message: error?.message });
  }
});

app.post('/api/director/plan', async (req: Request, res: Response) => {
  try {
    const ai = getAI();
    if (!ai) return res.status(503).json({ error: 'GEMINI_API_KEY não configurada' });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crie um storyboard profissional para: ${req.body.goal || 'vídeo cinematográfico'}. Nome: ${req.body.propertyName || ''}. Estilo: ${req.body.style || 'cinematográfico'}. Duração total: ${req.body.totalDurationSeconds || 30}s. Retorne JSON {scenes:[{sceneNumber,title,prompt,duration,cameraMovement,speed,audioMood}],directorNotes}.`,
      config: { responseMimeType: 'application/json' },
    } as any);
    const parsed = JSON.parse(response.text || '{}');
    const scenes = (parsed.scenes || []).map((s: any, idx: number) => ({ id: `scene-${Date.now()}-${idx}`, ...s, status: 'ready', imageUrl: req.body.images?.[idx] }));
    res.json({ goal: req.body.goal || '', totalScenes: scenes.length, scenes, directorNotes: parsed.directorNotes || '' });
  } catch (error: any) {
    res.status(500).json({ error: 'Falha no AI Director', message: error?.message });
  }
});

app.post('/api/ai-edit/parse', async (req: Request, res: Response) => {
  try {
    const ai = getAI();
    if (!ai) return res.status(503).json({ error: 'GEMINI_API_KEY não configurada' });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Interprete esta instrução de edição de vídeo: ${req.body.command}. Retorne JSON com actionType, targetArea, suggestedMask, parameterChanges, userExplanation. Não afirme que uma edição foi executada; apenas descreva a operação solicitada.`,
      config: { responseMimeType: 'application/json' },
    } as any);
    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    res.status(500).json({ error: 'Falha ao interpretar edição', message: error?.message });
  }
});

app.post('/api/video/generate', async (req: Request, res: Response) => {
  try {
    if (!getAI()) return res.status(503).json({ error: 'GEMINI_API_KEY não configurada. Configure o secret no Google AI Studio.' });
    const params = req.body || {};
    if (!params.prompt || typeof params.prompt !== 'string') return res.status(400).json({ error: 'Prompt é obrigatório' });
    const jobId = `veo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const image = await remoteImageToInlineData(params.initialImageUrl || params.imageUrl);
    const job: Job = {
      id: jobId,
      createdAt: new Date().toISOString(),
      status: 'Queued',
      progress: 5,
      statusMessage: 'Geração real enfileirada para o Veo 3.1...',
      params,
      thumbnailUrl: params.initialImageUrl,
      durationActual: 8,
      renderingEngine: 'Google Veo 3.1',
      providerUsed: 'google-veo-3.1',
      costCredits: 0,
    };
    jobs.set(jobId, job);
    void runVeoJob(jobId, {
      prompt: params.prompt,
      image,
      config: {
        numberOfVideos: 1,
        aspectRatio: normalizeAspectRatio(params.aspectRatio),
        resolution: normalizeResolution(params.resolution),
      },
    });
    res.json({ jobId, status: 'Queued', message: 'Geração real iniciada no Google Veo 3.1' });
  } catch (error: any) {
    res.status(500).json({ error: 'Falha ao iniciar geração', message: error?.message });
  }
});

app.get('/api/video/status/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job não encontrado' });
  res.json(job);
});

app.post('/api/video/extend', async (req: Request, res: Response) => {
  try {
    const parent = jobs.get(req.body.parentJobId);
    if (!parent || parent.status !== 'Completed' || !parent.providerVideo) return res.status(400).json({ error: 'A extensão só pode ser feita em um vídeo concluído e gerado pelo Veo nesta sessão.' });
    const jobId = `veo-ext-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const job: Job = {
      id: jobId,
      createdAt: new Date().toISOString(),
      status: 'Queued',
      progress: 5,
      statusMessage: 'Preparando extensão real no Veo 3.1...',
      params: { ...parent.params, isExtension: true },
      thumbnailUrl: parent.thumbnailUrl,
      durationActual: (parent.durationActual || 8) + 8,
      renderingEngine: 'Google Veo 3.1 Extension',
      providerUsed: 'google-veo-3.1',
      costCredits: 0,
    };
    jobs.set(jobId, job);
    void runVeoJob(jobId, {
      prompt: `Continue esta cena de forma perfeitamente fluida, mantendo personagem, ambiente, arquitetura, objetos, direção de câmera, iluminação e estilo. ${parent.params?.prompt || ''}`,
      video: parent.providerVideo,
      config: { numberOfVideos: 1, resolution: '720p' },
    });
    res.json({ jobId, status: 'Queued', message: 'Extensão real iniciada no Veo 3.1' });
  } catch (error: any) {
    res.status(500).json({ error: 'Falha ao estender vídeo', message: error?.message });
  }
});

app.post('/api/video/upscale', (_req, res) => {
  res.status(501).json({
    error: 'Upscale de vídeo arbitrário ainda não possui provedor conectado.',
    code: 'UPSCALER_NOT_CONFIGURED',
    message: 'A VELORA não simula upscale. Conecte um provedor de super-resolução para habilitar esta função.',
  });
});

app.get('/api/admin/metrics', (_req, res) => {
  const all = [...jobs.values()];
  const failed = all.filter(j => j.status === 'Failed');
  const active = all.filter(j => !['Completed', 'Failed'].includes(j.status));
  res.json({
    activeUsers: 1,
    totalGenerationsToday: completedToday.length,
    avgRenderTimeSec: 0,
    totalApiCostTodayUsd: 0,
    avgCostPerVideoUsd: 0,
    activeGPUQueues: active.length,
    successRatePercentage: all.length ? Math.round(((all.length - failed.length) / all.length) * 1000) / 10 : 100,
    storageTotalGb: 0,
    providerMetrics: [{ provider: 'Google Veo 3.1', jobsCompleted: completedToday.length, avgLatencySec: 0, errorRate: all.length ? failed.length / all.length * 100 : 0, costUsd: 0 }],
    recentFailedJobs: failed.slice(-10).map(j => ({ id: j.id, error: j.error, createdAt: j.createdAt })),
  });
});

async function start() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`VELORA running on port ${PORT}`));
}

start().catch(error => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});

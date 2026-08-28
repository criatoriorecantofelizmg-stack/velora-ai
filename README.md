# VELORA

Professional AI video studio built with React, TypeScript, Express and Google GenAI.

## Current production engine

The application is wired to Google Veo 3.1 for real text-to-video and image-to-video generation. Prompt enhancement, AI Director and real-estate visual analysis use Gemini.

The project intentionally does **not** return stock/demo videos when a real provider is unavailable. Missing provider capabilities return an explicit error instead of simulating success.

## Required secret

Configure `GEMINI_API_KEY` as a server-side secret in Google AI Studio / your deployment environment. Never expose the key in frontend code.

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Real capabilities

- Text-to-video with Google Veo 3.1
- Image-to-video with Google Veo 3.1
- Video continuation for eligible Veo-generated videos
- Gemini prompt enhancement
- Gemini AI Director/storyboard planning
- Gemini multimodal real-estate image analysis
- Real job status and error reporting
- Generated MP4 delivery from the server
- Runtime metrics based on actual session jobs

## Provider-dependent / not faked

Arbitrary video super-resolution/upscale and destructive timeline edits require dedicated processing providers. Until one is connected, these endpoints report that the capability is unavailable rather than presenting a fake completed render.

## Security

Keep `.env` files out of Git. `.env.example` documents the required variables without containing real credentials.

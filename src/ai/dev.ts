import { config } from 'dotenv';
config();

import '@/ai/flows/video-scan-analysis.ts';
import '@/ai/flows/prompt-based-summary.ts';
import '@/ai/flows/prompt-to-video.ts';
import '@/ai/flows/text-to-video.ts';
import '@/ai/flows/auto-suggest-prompt.ts';
import '@/ai/flows/background-music-generation.ts';
import '@/ai/flows/generate-clip-ideas.ts';
import '@/ai/flows/text-to-speech-narration.ts';
import '@/ai/flows/image-to-video.ts';
import '@/ai/flows/audio-to-video.ts';

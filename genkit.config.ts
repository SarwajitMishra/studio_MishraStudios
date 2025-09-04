import { defineConfig } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

export default defineConfig({
  plugins: [
 googleAI({
 models: [
 { name: 'gemini-pro' },
 ],
 }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

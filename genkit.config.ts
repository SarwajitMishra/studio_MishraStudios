
import {googleAI} from '@genkit-ai/googleai';
import {defineConfig} from 'genkit';

export default defineConfig({
  plugins: [
    googleAI({
      // The API key is read from the GOOGLE_API_KEY environment variable.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

import { MapKey, type StringLiterals } from '../utils';

type OpenAiModel = StringLiterals<Parameters<typeof openai>[0]>;
type GoogleModel = StringLiterals<Parameters<typeof google>[0]>;
export type SupportedModel = `openai/${OpenAiModel}` | `google/${GoogleModel}`;

export type Model = MapKey<typeof models>;

type ModelMeta = {
  model: SupportedModel;
  provider: string;
  name: string;
};

export const models = new Map<SupportedModel, ModelMeta>([
  [
    'openai/gpt-4.1-nano',
    {
      model: 'openai/gpt-4.1-nano',
      provider: 'OpenAI',
      name: 'GPT-4.1 Nano',
    },
  ],
  [
    'openai/gpt-5-mini',
    {
      model: 'openai/gpt-5-mini',
      provider: 'OpenAI',
      name: 'GPT-5 Mini',
    },
  ],
  [
    'openai/gpt-5',
    {
      model: 'openai/gpt-5',
      provider: 'OpenAI',
      name: 'GPT-5',
    },
  ],
  [
    'google/gemini-2.5-flash',
    {
      model: 'google/gemini-2.5-flash',
      provider: 'Google',
      name: 'Gemini 2.5 Flash',
    },
  ],
] as const);

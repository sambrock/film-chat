import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';

import { MapKey, type StringLiterals } from '../utils';

type OpenAiModel = StringLiterals<Parameters<typeof openai>[0]>;
type GoogleModel = StringLiterals<Parameters<typeof google>[0]>;
type XaiModel = StringLiterals<Parameters<typeof xai>[0]>;
export type SupportedModel = `openai/${OpenAiModel}` | `google/${GoogleModel}` | `xai/${XaiModel}`;

export type Model = MapKey<typeof models>;
export type ModelProvider = 'OpenAI' | 'Google' | 'xAI';

type ModelMeta = {
  model: SupportedModel;
  provider: ModelProvider;
  name: string;
  active: boolean;
};

export const models = new Map<SupportedModel, ModelMeta>([
  [
    'openai/gpt-4.1-nano',
    {
      model: 'openai/gpt-4.1-nano',
      provider: 'OpenAI',
      name: 'GPT-4.1 Nano',
      active: true,
    },
  ],
  [
    'openai/gpt-5-mini',
    {
      model: 'openai/gpt-5-mini',
      provider: 'OpenAI',
      name: 'GPT-5 Mini',
      active: true,
    },
  ],
  [
    'openai/gpt-5',
    {
      model: 'openai/gpt-5',
      provider: 'OpenAI',
      name: 'GPT-5',
      active: true,
    },
  ],
  [
    'google/gemini-2.5-flash',
    {
      model: 'google/gemini-2.5-flash',
      provider: 'Google',
      name: 'Gemini 2.5 Flash',
      active: true,
    },
  ],
  [
    'xai/grok-4',
    {
      model: 'xai/grok-4',
      provider: 'xAI',
      name: 'Grok 4',
      active: false,
    },
  ],
] as const);

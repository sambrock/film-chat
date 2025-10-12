import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

import { Model } from './models';

export const streamTextModel = (model: Model | (string & {})) => {
  const [modelProvider, modelName] = model.split('/');

  switch (modelProvider) {
    case 'openai': {
      return openai(modelName);
    }
    case 'google': {
      return google(modelName);
    }
    default: {
      return openai('gpt-4.1-nano');
    }
  }
};

export const SYSTEM_CONTEXT_MESSAGE = `
  You are a movie recommendation AI.

  Suggest exactly **4 existing movies** based on conversations.
  Do not suggest TV series. Only existing movies.

  Return the result as a **JSON array of 4 objects**.  
  Each object must have the following keys:

  - **title**: string  
  - **release_year**: number (e.g., 2010)  
  - **why**: string (explain briefly why you recommend it)  

  Example output:
  [
    {
      "title": "Inception",
      "release_year": 2010,
      "why": "A mind-bending thriller with emotional depth."
    }
  ]
`;

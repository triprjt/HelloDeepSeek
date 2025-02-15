import {
  GSContext,
  GSDataSource,
  GSStatus,
  logger,
  PlainObject,
} from '@godspeedsystems/core';
import { TokenJS } from 'token.js';
type LLMProvider =
  | 'openai'
  | 'ai21'
  | 'anthropic'
  | 'gemini'
  | 'cohere'
  | 'bedrock'
  | 'mistral'
  | 'groq'
  | 'perplexity'
  | 'openrouter'
  | 'openai-compatible';

interface TokenJSConfig {
  provider: LLMProvider;
  baseURL: string;
  models: {
    name: string;
    config: {
      temperature: number;
      max_tokens: number;
      [key: string]: any;
    };
  }[];
}
export default class DataSource extends GSDataSource {
  protected async initClient(): Promise<object> {
    const yamlconfig = (this.config as { config: TokenJSConfig }).config;
    console.log('Hello there this is the parsed yaml' + yamlconfig);
    const client = new TokenJS({ baseURL: yamlconfig.baseURL });
    return client;
  }

  async execute(ctx: GSContext, args: PlainObject): Promise<any> {
    console.log('Hello');
    const client = this.client as TokenJS;
    const { prompt } = args;
    const yamlconfig = (this.config as { config: TokenJSConfig }).config;

    const completion = await client.chat.completions.create({
      provider: yamlconfig.provider,
      model: yamlconfig.models[0].name,
      messages: [{ role: 'user', content: prompt }],
      ...yamlconfig.models[0].config,
    });
    const generatedText =
      completion.choices[0]?.message?.content || 'No response';
    return new GSStatus(true, 200, 'Success', { response: generatedText });
  }
}
const SourceType = 'DS';
const Type = 'tokenjs'; // this is the loader file of the plugin, So the final loader file will be `types/${Type.js}`
const CONFIG_FILE_NAME = 'tokenjs'; // in case of event source, this also works as event identifier, and in case of datasource works as datasource name
const DEFAULT_CONFIG = {};

export { DataSource, SourceType, Type, CONFIG_FILE_NAME, DEFAULT_CONFIG };

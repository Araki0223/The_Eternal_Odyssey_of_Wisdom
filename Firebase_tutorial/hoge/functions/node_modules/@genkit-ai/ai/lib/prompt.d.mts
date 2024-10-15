import { Action, JSONSchema7 } from '@genkit-ai/core';
import z__default from 'zod';
import { DocumentData } from './document.mjs';
import { GenerateOptions } from './generate.mjs';
import { GenerateRequest, GenerateRequestSchema, ModelArgument } from './model.mjs';
import './tool.mjs';

/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

type PromptFn<I extends z__default.ZodTypeAny = z__default.ZodTypeAny, CustomOptionsSchema extends z__default.ZodTypeAny = z__default.ZodTypeAny> = (input: z__default.infer<I>) => Promise<GenerateRequest<CustomOptionsSchema>>;
type PromptAction<I extends z__default.ZodTypeAny = z__default.ZodTypeAny> = Action<I, typeof GenerateRequestSchema> & {
    __action: {
        metadata: {
            type: 'prompt';
        };
    };
};
declare function isPrompt(arg: any): boolean;
/**
 * Defines and registers a prompt action. The action can be called to obtain
 * a `GenerateRequest` which can be passed to a model action. The given
 * `PromptFn` can perform any action needed to create the request such as rendering
 * a template or fetching a prompt from a database.
 *
 * @returns The new `PromptAction`.
 */
declare function definePrompt<I extends z__default.ZodTypeAny>({ name, description, inputSchema, inputJsonSchema, metadata, }: {
    name: string;
    description?: string;
    inputSchema?: I;
    inputJsonSchema?: JSONSchema7;
    metadata?: Record<string, any>;
}, fn: PromptFn<I>): PromptAction<I>;
type PromptArgument<I extends z__default.ZodTypeAny = z__default.ZodTypeAny> = string | PromptAction<I>;
/**
 * This veneer renders a `PromptAction` into a `GenerateOptions` object.
 *
 * @returns A promise of an options object for use with the `generate()` function.
 */
declare function renderPrompt<I extends z__default.ZodTypeAny = z__default.ZodTypeAny, O extends z__default.ZodTypeAny = z__default.ZodTypeAny, CustomOptions extends z__default.ZodTypeAny = z__default.ZodTypeAny>(params: {
    prompt: PromptArgument<I>;
    input: z__default.infer<I>;
    context?: DocumentData[];
    model: ModelArgument<CustomOptions>;
    config?: z__default.infer<CustomOptions>;
}): Promise<GenerateOptions<O, CustomOptions>>;

export { type PromptAction, type PromptArgument, type PromptFn, definePrompt, isPrompt, renderPrompt };

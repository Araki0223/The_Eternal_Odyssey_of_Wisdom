import { ModelReference, MessageData, CandidateData, ModelAction } from '@genkit-ai/ai/model';
import { Content, GenerateContentCandidate } from '@google/generative-ai';
import z from 'zod';

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

declare const geminiPro: ModelReference<z.ZodObject<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
}, "strip", z.ZodTypeAny, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}>>;
/**
 * @deprecated Use `gemini15Pro`, `gemini15Flash`, or `gemini15flash8B` instead.
 */
declare const geminiProVision: ModelReference<z.ZodObject<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
}, "strip", z.ZodTypeAny, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}>>;
declare const gemini15Pro: ModelReference<z.ZodObject<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
}, "strip", z.ZodTypeAny, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}>>;
declare const gemini15Flash: ModelReference<z.ZodObject<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
}, "strip", z.ZodTypeAny, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}>>;
declare const gemini15Flash8B: ModelReference<z.ZodObject<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
}, "strip", z.ZodTypeAny, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}>>;
declare const geminiUltra: ModelReference<z.ZodObject<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
}, "strip", z.ZodTypeAny, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
}>>;
declare const SUPPORTED_V1_MODELS: Record<string, ModelReference<z.ZodTypeAny>>;
declare const SUPPORTED_V15_MODELS: Record<string, ModelReference<z.ZodTypeAny>>;
declare function toGeminiMessage(message: MessageData, model?: ModelReference<z.ZodTypeAny>): Content;
declare function toGeminiSystemInstruction(message: MessageData): Content;
declare function fromGeminiCandidate(candidate: GenerateContentCandidate, jsonMode?: boolean): CandidateData;
/**
 *
 */
declare function googleAIModel(name: string, apiKey?: string, apiVersion?: string, baseUrl?: string): ModelAction;

export { SUPPORTED_V15_MODELS, SUPPORTED_V1_MODELS, fromGeminiCandidate, gemini15Flash, gemini15Flash8B, gemini15Pro, geminiPro, geminiProVision, geminiUltra, googleAIModel, toGeminiMessage, toGeminiSystemInstruction };

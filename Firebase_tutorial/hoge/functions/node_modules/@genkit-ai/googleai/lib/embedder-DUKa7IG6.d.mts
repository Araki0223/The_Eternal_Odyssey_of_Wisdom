import * as _genkit_ai_ai_embedder from '@genkit-ai/ai/embedder';
import { z } from 'zod';
import { Plugin } from '@genkit-ai/core';
import './gemini.mjs';

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

interface PluginOptions {
    apiKey?: string;
    apiVersion?: string | string[];
    baseUrl?: string;
}
declare const googleAI: Plugin<[PluginOptions] | []>;

declare const TaskTypeSchema: z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>;
type TaskType = z.infer<typeof TaskTypeSchema>;
declare const TextEmbeddingGeckoConfigSchema: z.ZodObject<{
    /**
     * The `task_type` parameter is defined as the intended downstream application to help the model
     * produce better quality embeddings.
     **/
    taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
}, {
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
}>;
type TextEmbeddingGeckoConfig = z.infer<typeof TextEmbeddingGeckoConfigSchema>;
declare const textEmbeddingGecko001: _genkit_ai_ai_embedder.EmbedderReference<z.ZodObject<{
    /**
     * The `task_type` parameter is defined as the intended downstream application to help the model
     * produce better quality embeddings.
     **/
    taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
}, {
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
}>>;
declare const SUPPORTED_MODELS: {
    'embedding-001': _genkit_ai_ai_embedder.EmbedderReference<z.ZodObject<{
        /**
         * The `task_type` parameter is defined as the intended downstream application to help the model
         * produce better quality embeddings.
         **/
        taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
        title: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
        title?: string | undefined;
    }, {
        taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
        title?: string | undefined;
    }>>;
};
declare function textEmbeddingGeckoEmbedder(name: string, options: PluginOptions): _genkit_ai_ai_embedder.EmbedderAction<z.ZodObject<{
    /**
     * The `task_type` parameter is defined as the intended downstream application to help the model
     * produce better quality embeddings.
     **/
    taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
}, {
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
}>>;

export { type PluginOptions as P, SUPPORTED_MODELS as S, TaskTypeSchema as T, type TaskType as a, TextEmbeddingGeckoConfigSchema as b, type TextEmbeddingGeckoConfig as c, textEmbeddingGeckoEmbedder as d, googleAI as g, textEmbeddingGecko001 as t };

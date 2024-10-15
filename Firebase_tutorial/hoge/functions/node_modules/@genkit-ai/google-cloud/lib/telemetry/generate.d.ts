import { PathMetadata } from '@genkit-ai/core/tracing';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { Telemetry } from '../metrics.js';
import '@opentelemetry/api';

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

declare class GenerateTelemetry implements Telemetry {
    /**
     * Wraps the declared metrics in a Genkit-specific, internal namespace.
     */
    private _N;
    /** The maximum length (in bytes) of a logged prompt message. The maximum log
     * size in GCP is 256kb, so using slightly lower for some buffer for the rest
     * of the message*/
    private MAX_LOG_CONTENT_BYTES;
    private actionCounter;
    private latencies;
    private inputCharacters;
    private inputTokens;
    private inputImages;
    private inputVideos;
    private inputAudio;
    private outputCharacters;
    private outputTokens;
    private outputImages;
    private outputVideos;
    private outputAudio;
    tick(span: ReadableSpan, paths: Set<PathMetadata>, logIO: boolean, projectId?: string): void;
    private recordGenerateActionMetrics;
    private recordGenerateActionConfigLogs;
    private recordGenerateActionInputLogs;
    private recordGenerateActionOutputLogs;
    private toPartCounts;
    private xOfY;
    private toPartLogContent;
    private toPartLogText;
    private toPartLogMedia;
    private toPartLogToolRequest;
    private toPartLogToolResponse;
    /**
     * Records all metrics associated with performing a GenerateAction.
     */
    private doRecordGenerateActionMetrics;
}
declare const generateTelemetry: GenerateTelemetry;

export { generateTelemetry };

import { Plugin } from '@genkit-ai/core';
import { GcpLogger } from './gcpLogger.js';
export { __addTransportStreamForTesting } from './gcpLogger.js';
import { GcpOpenTelemetry } from './gcpOpenTelemetry.js';
export { __forceFlushSpansForTesting, __getMetricExporterForTesting, __getSpanExporterForTesting } from './gcpOpenTelemetry.js';
import { GcpPluginOptions, GcpPluginConfig } from './types.js';
export { GcpTelemetryConfigOptions } from './types.js';
import 'winston';
import 'stream';
import '@opentelemetry/sdk-metrics';
import '@opentelemetry/sdk-node';
import '@opentelemetry/sdk-trace-base';
import '@opentelemetry/auto-instrumentations-node';
import '@opentelemetry/instrumentation';
import 'google-auth-library';

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

/**
 * Provides a plugin for using Genkit with GCP.
 */
declare const googleCloud: Plugin<[GcpPluginOptions] | []>;
/**
 * Configures and builds the plugin.
 * Not normally needed, but exposed for use by the firebase plugin.
 */
declare function build(options?: GcpPluginOptions): Promise<{
    telemetry: {
        instrumentation: {
            id: string;
            value: GcpOpenTelemetry;
        };
        logger: {
            id: string;
            value: GcpLogger;
        };
    };
}>;
/**
 * Create a configuration object for the plugin.
 * Not normally needed, but exposed for use by the firebase plugin.
 */
declare function configureGcpPlugin(options?: GcpPluginOptions): Promise<GcpPluginConfig>;

export { GcpLogger, GcpOpenTelemetry, GcpPluginOptions, build, configureGcpPlugin, googleCloud as default, googleCloud };

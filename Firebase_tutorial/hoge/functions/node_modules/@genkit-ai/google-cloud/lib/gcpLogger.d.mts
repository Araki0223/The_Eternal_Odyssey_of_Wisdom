import * as winston from 'winston';
import { LoggerConfig } from '@genkit-ai/core';
import { Writable } from 'stream';
import { GcpPluginConfig } from './types.mjs';
import '@opentelemetry/auto-instrumentations-node';
import '@opentelemetry/instrumentation';
import '@opentelemetry/sdk-trace-base';
import 'google-auth-library';

/**
 * Provides a {LoggerConfig} for exporting Genkit debug logs to GCP Cloud
 * logs.
 */
declare class GcpLogger implements LoggerConfig {
    private readonly config;
    constructor(config: GcpPluginConfig);
    getLogger(env: string): Promise<winston.Logger>;
    private shouldExport;
}
declare function __addTransportStreamForTesting(stream: Writable): void;

export { GcpLogger, __addTransportStreamForTesting };

import { GcpPluginOptions } from './types.js';
import '@opentelemetry/auto-instrumentations-node';
import '@opentelemetry/instrumentation';
import '@opentelemetry/sdk-trace-base';
import 'google-auth-library';

/**
 * Allow customers to pass in cloud credentials from environment variables
 * following: https://github.com/googleapis/google-auth-library-nodejs?tab=readme-ov-file#loading-credentials-from-environment-variables
 */
declare function credentialsFromEnvironment(): Promise<GcpPluginOptions>;

export { credentialsFromEnvironment };

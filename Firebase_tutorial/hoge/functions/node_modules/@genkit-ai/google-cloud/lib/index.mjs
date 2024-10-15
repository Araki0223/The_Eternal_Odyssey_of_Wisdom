import {
  __async
} from "./chunk-DJRN6NKF.mjs";
import { genkitPlugin } from "@genkit-ai/core";
import { credentialsFromEnvironment } from "./auth.js";
import { GcpLogger } from "./gcpLogger.js";
import { GcpOpenTelemetry } from "./gcpOpenTelemetry.js";
import { TelemetryConfigs } from "./telemetry/defaults.js";
const googleCloud = genkitPlugin(
  "googleCloud",
  (options) => __async(void 0, null, function* () {
    return build(options);
  })
);
function build(options) {
  return __async(this, null, function* () {
    const pluginConfig = yield configureGcpPlugin(options);
    return {
      telemetry: {
        instrumentation: {
          id: "googleCloud",
          value: new GcpOpenTelemetry(pluginConfig)
        },
        logger: {
          id: "googleCloud",
          value: new GcpLogger(pluginConfig)
        }
      }
    };
  });
}
function configureGcpPlugin(options) {
  return __async(this, null, function* () {
    const envOptions = yield credentialsFromEnvironment();
    return {
      projectId: (options == null ? void 0 : options.projectId) || envOptions.projectId,
      credentials: (options == null ? void 0 : options.credentials) || envOptions.credentials,
      telemetry: TelemetryConfigs.defaults(options == null ? void 0 : options.telemetryConfig)
    };
  });
}
var src_default = googleCloud;
export * from "./gcpLogger.js";
export * from "./gcpOpenTelemetry.js";
import { GcpPluginOptions as GcpPluginOptions2, GcpTelemetryConfigOptions } from "./types.js";
export {
  GcpPluginOptions2 as GcpPluginOptions,
  GcpTelemetryConfigOptions,
  build,
  configureGcpPlugin,
  src_default as default,
  googleCloud
};
//# sourceMappingURL=index.mjs.map
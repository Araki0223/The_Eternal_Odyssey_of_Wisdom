"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var src_exports = {};
__export(src_exports, {
  GcpPluginOptions: () => import_types2.GcpPluginOptions,
  GcpTelemetryConfigOptions: () => import_types2.GcpTelemetryConfigOptions,
  build: () => build,
  configureGcpPlugin: () => configureGcpPlugin,
  default: () => src_default,
  googleCloud: () => googleCloud
});
module.exports = __toCommonJS(src_exports);
var import_core = require("@genkit-ai/core");
var import_auth = require("./auth.js");
var import_gcpLogger = require("./gcpLogger.js");
var import_gcpOpenTelemetry = require("./gcpOpenTelemetry.js");
var import_defaults = require("./telemetry/defaults.js");
__reExport(src_exports, require("./gcpLogger.js"), module.exports);
__reExport(src_exports, require("./gcpOpenTelemetry.js"), module.exports);
var import_types2 = require("./types.js");
const googleCloud = (0, import_core.genkitPlugin)(
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
          value: new import_gcpOpenTelemetry.GcpOpenTelemetry(pluginConfig)
        },
        logger: {
          id: "googleCloud",
          value: new import_gcpLogger.GcpLogger(pluginConfig)
        }
      }
    };
  });
}
function configureGcpPlugin(options) {
  return __async(this, null, function* () {
    const envOptions = yield (0, import_auth.credentialsFromEnvironment)();
    return {
      projectId: (options == null ? void 0 : options.projectId) || envOptions.projectId,
      credentials: (options == null ? void 0 : options.credentials) || envOptions.credentials,
      telemetry: import_defaults.TelemetryConfigs.defaults(options == null ? void 0 : options.telemetryConfig)
    };
  });
}
var src_default = googleCloud;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GcpPluginOptions,
  GcpTelemetryConfigOptions,
  build,
  configureGcpPlugin,
  googleCloud,
  ...require("./gcpLogger.js"),
  ...require("./gcpOpenTelemetry.js")
});
//# sourceMappingURL=index.js.map
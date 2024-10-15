"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
  defineFirestoreRetriever: () => import_firestoreRetriever.defineFirestoreRetriever,
  firebase: () => firebase
});
module.exports = __toCommonJS(src_exports);
var import_core = require("@genkit-ai/core");
var import_logging = require("@genkit-ai/core/logging");
var import_flow = require("@genkit-ai/flow");
var import_google_cloud = require("@genkit-ai/google-cloud");
var import_firestoreTraceStore = require("./firestoreTraceStore.js");
var import_firestoreRetriever = require("./firestoreRetriever.js");
const firebase = (0, import_core.genkitPlugin)(
  "firebase",
  (params) => __async(void 0, null, function* () {
    const gcpConfig = yield (0, import_google_cloud.configureGcpPlugin)(params);
    if ((0, import_core.isDevEnv)() && !gcpConfig.projectId) {
      import_logging.logger.warn(
        'WARNING: unable to determine Firebase Project ID. Run "gcloud auth application-default login --project MY_PROJECT_ID"'
      );
    }
    const flowStateStoreOptions = __spreadValues({
      projectId: gcpConfig.projectId,
      credentials: gcpConfig.credentials
    }, params == null ? void 0 : params.flowStateStore);
    const traceStoreOptions = __spreadValues({
      projectId: gcpConfig.projectId,
      credentials: gcpConfig.credentials
    }, params == null ? void 0 : params.traceStore);
    return {
      flowStateStore: {
        id: "firestore",
        value: new import_flow.FirestoreStateStore(flowStateStoreOptions)
      },
      traceStore: {
        id: "firestore",
        value: new import_firestoreTraceStore.FirestoreTraceStore(traceStoreOptions)
      },
      telemetry: {
        instrumentation: {
          id: "firebase",
          value: new import_google_cloud.GcpOpenTelemetry(gcpConfig)
        },
        logger: {
          id: "firebase",
          value: new import_google_cloud.GcpLogger(gcpConfig)
        }
      }
    };
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineFirestoreRetriever,
  firebase
});
//# sourceMappingURL=index.js.map
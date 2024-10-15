import {
  __async,
  __spreadValues
} from "./chunk-DJRN6NKF.mjs";
import { genkitPlugin, isDevEnv } from "@genkit-ai/core";
import { logger } from "@genkit-ai/core/logging";
import { FirestoreStateStore } from "@genkit-ai/flow";
import {
  configureGcpPlugin,
  GcpLogger,
  GcpOpenTelemetry
} from "@genkit-ai/google-cloud";
import { FirestoreTraceStore } from "./firestoreTraceStore.js";
import { defineFirestoreRetriever } from "./firestoreRetriever.js";
const firebase = genkitPlugin(
  "firebase",
  (params) => __async(void 0, null, function* () {
    const gcpConfig = yield configureGcpPlugin(params);
    if (isDevEnv() && !gcpConfig.projectId) {
      logger.warn(
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
        value: new FirestoreStateStore(flowStateStoreOptions)
      },
      traceStore: {
        id: "firestore",
        value: new FirestoreTraceStore(traceStoreOptions)
      },
      telemetry: {
        instrumentation: {
          id: "firebase",
          value: new GcpOpenTelemetry(gcpConfig)
        },
        logger: {
          id: "firebase",
          value: new GcpLogger(gcpConfig)
        }
      }
    };
  })
);
export {
  defineFirestoreRetriever,
  firebase
};
//# sourceMappingURL=index.mjs.map
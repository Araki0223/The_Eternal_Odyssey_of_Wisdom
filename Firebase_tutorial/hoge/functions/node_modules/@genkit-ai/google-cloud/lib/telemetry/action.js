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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var action_exports = {};
__export(action_exports, {
  actionTelemetry: () => actionTelemetry
});
module.exports = __toCommonJS(action_exports);
var import_core = require("@genkit-ai/core");
var import_logging = require("@genkit-ai/core/logging");
var import_api = require("@opentelemetry/api");
var import_core2 = require("@opentelemetry/core");
var import_metrics = require("../metrics.js");
var import_utils = require("../utils");
class ActionTelemetry {
  constructor() {
    /**
     * Wraps the declared metrics in a Genkit-specific, internal namespace.
     */
    this._N = import_metrics.internalMetricNamespaceWrap.bind(null, "action");
    this.actionCounter = new import_metrics.MetricCounter(this._N("requests"), {
      description: "Counts calls to genkit actions.",
      valueType: import_api.ValueType.INT
    });
    this.actionLatencies = new import_metrics.MetricHistogram(this._N("latency"), {
      description: "Latencies when calling Genkit actions.",
      valueType: import_api.ValueType.DOUBLE,
      unit: "ms"
    });
  }
  tick(span, paths, logIO, projectId) {
    const attributes = span.attributes;
    const actionName = attributes["genkit:name"] || "<unknown>";
    const path = attributes["genkit:path"] || "<unknown>";
    const flowName = attributes["genkit:metadata:flow:name"] || (0, import_utils.extractOuterFlowNameFromPath)(path);
    const state = attributes["genkit:state"] || "success";
    const latencyMs = (0, import_core2.hrTimeToMilliseconds)(
      (0, import_core2.hrTimeDuration)(span.startTime, span.endTime)
    );
    const errorName = (0, import_utils.extractErrorName)(span.events);
    if (state === "success") {
      this.writeSuccess(actionName, flowName, path, latencyMs);
      return;
    }
    if (state === "error") {
      this.writeFailure(actionName, flowName, path, latencyMs, errorName);
    }
    import_logging.logger.warn(`Unknown action state; ${state}`);
  }
  writeSuccess(actionName, flowName, path, latencyMs) {
    const dimensions = {
      name: actionName,
      flowName,
      path,
      status: "success",
      source: "ts",
      sourceVersion: import_core.GENKIT_VERSION
    };
    this.actionCounter.add(1, dimensions);
    this.actionLatencies.record(latencyMs, dimensions);
  }
  writeFailure(actionName, flowName, path, latencyMs, errorName) {
    const dimensions = {
      name: actionName,
      flowName,
      path,
      source: "ts",
      sourceVersion: import_core.GENKIT_VERSION,
      status: "failure",
      error: errorName
    };
    this.actionCounter.add(1, dimensions);
    this.actionLatencies.record(latencyMs, dimensions);
  }
}
const actionTelemetry = new ActionTelemetry();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actionTelemetry
});
//# sourceMappingURL=action.js.map
"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
var flow_exports = {};
__export(flow_exports, {
  flowsTelemetry: () => flowsTelemetry
});
module.exports = __toCommonJS(flow_exports);
var import_core = require("@genkit-ai/core");
var import_logging = require("@genkit-ai/core/logging");
var import_tracing = require("@genkit-ai/core/tracing");
var import_api = require("@opentelemetry/api");
var import_core2 = require("@opentelemetry/core");
var import_metrics = require("../metrics");
var import_utils = require("../utils");
class FlowsTelemetry {
  constructor() {
    /**
     * Wraps the declared metrics in a Genkit-specific, internal namespace.
     */
    this._N = import_metrics.internalMetricNamespaceWrap.bind(null, "flow");
    this.flowCounter = new import_metrics.MetricCounter(this._N("requests"), {
      description: "Counts calls to genkit flows.",
      valueType: import_api.ValueType.INT
    });
    this.pathCounter = new import_metrics.MetricCounter(this._N("path/requests"), {
      description: "Tracks unique flow paths per flow.",
      valueType: import_api.ValueType.INT
    });
    this.pathLatencies = new import_metrics.MetricHistogram(this._N("path/latency"), {
      description: "Latencies per flow path.",
      ValueType: import_api.ValueType.DOUBLE,
      unit: "ms"
    });
    this.flowLatencies = new import_metrics.MetricHistogram(this._N("latency"), {
      description: "Latencies when calling Genkit flows.",
      valueType: import_api.ValueType.DOUBLE,
      unit: "ms"
    });
  }
  tick(span, paths, logIO, projectId) {
    const attributes = span.attributes;
    const name = attributes["genkit:name"];
    const path = attributes["genkit:path"];
    const latencyMs = (0, import_core2.hrTimeToMilliseconds)(
      (0, import_core2.hrTimeDuration)(span.startTime, span.endTime)
    );
    const isRoot = attributes["genkit:isRoot"] || false;
    const state = attributes["genkit:state"];
    const input = attributes["genkit:input"];
    const output = attributes["genkit:output"];
    if (input && logIO) {
      this.recordIO(span, "Input", name, path, input, projectId);
    }
    if (output && logIO) {
      this.recordIO(span, "Output", name, path, output, projectId);
    }
    if (state === "success") {
      this.writeFlowSuccess(
        span,
        paths,
        name,
        path,
        latencyMs,
        isRoot,
        projectId
      );
      return;
    }
    if (state === "error") {
      const errorName = (0, import_utils.extractErrorName)(span.events) || "<unknown>";
      const errorMessage = (0, import_utils.extractErrorMessage)(span.events) || "<unknown>";
      const errorStack = (0, import_utils.extractErrorStack)(span.events) || "";
      this.writeFlowFailure(
        span,
        paths,
        name,
        path,
        latencyMs,
        errorName,
        isRoot,
        projectId
      );
      this.recordError(
        span,
        path,
        errorName,
        errorMessage,
        errorStack,
        projectId
      );
      return;
    }
    import_logging.logger.warn(`Unknown flow state; ${state}`);
  }
  recordIO(span, tag, flowName, qualifiedPath, input, projectId) {
    const path = (0, import_tracing.toDisplayPath)(qualifiedPath);
    const sharedMetadata = __spreadProps(__spreadValues({}, (0, import_utils.createCommonLogAttributes)(span, projectId)), {
      path,
      qualifiedPath,
      flowName
    });
    import_logging.logger.logStructured(`${tag}[${path}, ${flowName}]`, __spreadProps(__spreadValues({}, sharedMetadata), {
      content: input
    }));
  }
  recordError(span, path, errorName, errorMessage, errorStack, projectId) {
    const displayPath = (0, import_tracing.toDisplayPath)(path);
    import_logging.logger.logStructuredError(`Error[${displayPath}, ${errorName}]`, __spreadProps(__spreadValues({}, (0, import_utils.createCommonLogAttributes)(span, projectId)), {
      path: displayPath,
      qualifiedPath: path,
      name: errorName,
      message: errorMessage,
      stack: errorStack,
      source: "ts",
      sourceVersion: import_core.GENKIT_VERSION
    }));
  }
  writeFlowSuccess(span, paths, flowName, path, latencyMs, isRoot, projectId) {
    const dimensions = {
      name: flowName,
      status: "success",
      source: "ts",
      sourceVersion: import_core.GENKIT_VERSION
    };
    this.flowCounter.add(1, dimensions);
    this.flowLatencies.record(latencyMs, dimensions);
    if (isRoot) {
      this.writePathMetrics(
        span,
        path,
        paths,
        flowName,
        latencyMs,
        void 0,
        projectId
      );
    }
  }
  writeFlowFailure(span, paths, flowName, path, latencyMs, errorName, isRoot, projectId) {
    const dimensions = {
      name: flowName,
      status: "failure",
      source: "ts",
      sourceVersion: import_core.GENKIT_VERSION,
      error: errorName
    };
    this.flowCounter.add(1, dimensions);
    this.flowLatencies.record(latencyMs, dimensions);
    if (isRoot) {
      this.writePathMetrics(
        span,
        path,
        paths,
        flowName,
        latencyMs,
        errorName,
        projectId
      );
    }
  }
  /** Writes all path-level metrics stored in the current flow execution. */
  writePathMetrics(span, rootPath, paths, flowName, latencyMs, err, projectId) {
    const flowPaths = Array.from(paths).filter(
      (meta) => meta.path.includes(flowName)
    );
    if (flowPaths) {
      import_logging.logger.logStructured(`Paths[${flowName}]`, __spreadProps(__spreadValues({}, (0, import_utils.createCommonLogAttributes)(span, projectId)), {
        flowName,
        paths: flowPaths.map((p) => (0, import_tracing.toDisplayPath)(p.path))
      }));
      flowPaths.forEach((p) => this.writePathMetric(flowName, p));
      if (err && !flowPaths.some((p) => p.status === "failure")) {
        this.writePathMetric(flowName, {
          status: "failure",
          path: rootPath,
          error: err,
          latency: latencyMs
        });
      }
    }
  }
  /** Writes metrics for a single PathMetadata */
  writePathMetric(flowName, meta) {
    const pathDimensions = {
      flowName,
      status: meta.status,
      error: meta.error,
      path: meta.path,
      source: "ts",
      sourceVersion: import_core.GENKIT_VERSION
    };
    this.pathCounter.add(1, pathDimensions);
    this.pathLatencies.record(meta.latency, pathDimensions);
  }
}
const flowsTelemetry = new FlowsTelemetry();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  flowsTelemetry
});
//# sourceMappingURL=flow.js.map
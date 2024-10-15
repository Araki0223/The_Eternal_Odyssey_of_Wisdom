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
var gcpOpenTelemetry_exports = {};
__export(gcpOpenTelemetry_exports, {
  GcpOpenTelemetry: () => GcpOpenTelemetry,
  __forceFlushSpansForTesting: () => __forceFlushSpansForTesting,
  __getMetricExporterForTesting: () => __getMetricExporterForTesting,
  __getSpanExporterForTesting: () => __getSpanExporterForTesting
});
module.exports = __toCommonJS(gcpOpenTelemetry_exports);
var import_core = require("@genkit-ai/core");
var import_opentelemetry_cloud_monitoring_exporter = require("@google-cloud/opentelemetry-cloud-monitoring-exporter");
var import_opentelemetry_cloud_trace_exporter = require("@google-cloud/opentelemetry-cloud-trace-exporter");
var import_opentelemetry_resource_util = require("@google-cloud/opentelemetry-resource-util");
var import_api = require("@opentelemetry/api");
var import_auto_instrumentations_node = require("@opentelemetry/auto-instrumentations-node");
var import_core2 = require("@opentelemetry/core");
var import_instrumentation_pino = require("@opentelemetry/instrumentation-pino");
var import_instrumentation_winston = require("@opentelemetry/instrumentation-winston");
var import_resources = require("@opentelemetry/resources");
var import_sdk_metrics = require("@opentelemetry/sdk-metrics");
var import_sdk_trace_base = require("@opentelemetry/sdk-trace-base");
var import_utils = require("./utils");
var import_action = require("./telemetry/action.js");
var import_flow = require("./telemetry/flow.js");
var import_generate = require("./telemetry/generate.js");
let metricExporter;
let spanProcessor;
let spanExporter;
class GcpOpenTelemetry {
  constructor(config) {
    /**
     * Log hook for writing trace and span metadata to log messages in the format
     * required by GCP.
     */
    this.gcpTraceLogHook = (span, record) => {
      var _a, _b, _c;
      const spanContext = span.spanContext();
      const isSampled = !!(spanContext.traceFlags & import_api.TraceFlags.SAMPLED);
      const projectId = this.config.projectId;
      (_a = record["logging.googleapis.com/trace"]) != null ? _a : record["logging.googleapis.com/trace"] = `projects/${projectId}/traces/${spanContext.traceId}`;
      (_b = record["logging.googleapis.com/trace_sampled"]) != null ? _b : record["logging.googleapis.com/trace_sampled"] = isSampled ? "1" : "0";
      (_c = record["logging.googleapis.com/spanId"]) != null ? _c : record["logging.googleapis.com/spanId"] = spanContext.spanId;
    };
    this.config = config;
    this.resource = new import_resources.Resource({ type: "global" }).merge(
      new import_opentelemetry_resource_util.GcpDetectorSync().detect()
    );
  }
  getConfig() {
    spanProcessor = new import_sdk_trace_base.BatchSpanProcessor(this.createSpanExporter());
    return {
      resource: this.resource,
      spanProcessor,
      sampler: this.config.telemetry.sampler,
      instrumentations: this.getInstrumentations(),
      metricReader: this.createMetricReader()
    };
  }
  createSpanExporter() {
    spanExporter = new AdjustingTraceExporter(
      this.shouldExportTraces() ? new import_opentelemetry_cloud_trace_exporter.TraceExporter({
        credentials: this.config.credentials
      }) : new import_sdk_trace_base.InMemorySpanExporter(),
      this.config.telemetry.exportIO,
      this.config.projectId
    );
    return spanExporter;
  }
  /**
   * Creates a {MetricReader} for pushing metrics out to GCP via OpenTelemetry.
   */
  createMetricReader() {
    metricExporter = this.buildMetricExporter();
    return new import_sdk_metrics.PeriodicExportingMetricReader({
      exportIntervalMillis: this.config.telemetry.metricExportIntervalMillis,
      exportTimeoutMillis: this.config.telemetry.metricExportTimeoutMillis,
      exporter: metricExporter
    });
  }
  /** Gets all open telemetry instrumentations as configured by the plugin. */
  getInstrumentations() {
    if (this.config.telemetry.autoInstrumentation) {
      return (0, import_auto_instrumentations_node.getNodeAutoInstrumentations)(
        this.config.telemetry.autoInstrumentationConfig
      ).concat(this.getDefaultLoggingInstrumentations());
    }
    return this.getDefaultLoggingInstrumentations();
  }
  shouldExportTraces() {
    return this.config.telemetry.export && !this.config.telemetry.disableTraces;
  }
  shouldExportMetrics() {
    return this.config.telemetry.export && !this.config.telemetry.disableMetrics;
  }
  /** Always configure the Pino and Winston instrumentations */
  getDefaultLoggingInstrumentations() {
    return [
      new import_instrumentation_winston.WinstonInstrumentation({ logHook: this.gcpTraceLogHook }),
      new import_instrumentation_pino.PinoInstrumentation({ logHook: this.gcpTraceLogHook })
    ];
  }
  buildMetricExporter() {
    const exporter = this.shouldExportMetrics() ? new import_opentelemetry_cloud_monitoring_exporter.MetricExporter({
      projectId: this.config.projectId,
      userAgent: {
        product: "genkit",
        version: import_core.GENKIT_VERSION
      },
      credentials: this.config.credentials
    }) : new import_sdk_metrics.InMemoryMetricExporter(import_sdk_metrics.AggregationTemporality.DELTA);
    exporter.selectAggregation = (instrumentType) => {
      if (instrumentType === import_sdk_metrics.InstrumentType.HISTOGRAM) {
        return new import_sdk_metrics.ExponentialHistogramAggregation();
      }
      return new import_sdk_metrics.DefaultAggregation();
    };
    exporter.selectAggregationTemporality = (instrumentType) => {
      return import_sdk_metrics.AggregationTemporality.DELTA;
    };
    return exporter;
  }
}
class AdjustingTraceExporter {
  constructor(exporter, logIO, projectId) {
    this.exporter = exporter;
    this.logIO = logIO;
    this.projectId = projectId;
  }
  export(spans, resultCallback) {
    var _a;
    (_a = this.exporter) == null ? void 0 : _a.export(this.adjust(spans), resultCallback);
  }
  shutdown() {
    var _a;
    return (_a = this.exporter) == null ? void 0 : _a.shutdown();
  }
  getExporter() {
    return this.exporter;
  }
  forceFlush() {
    var _a;
    if ((_a = this.exporter) == null ? void 0 : _a.forceFlush) {
      return this.exporter.forceFlush();
    }
    return Promise.resolve();
  }
  adjust(spans) {
    const allPaths = spans.filter((span) => span.attributes["genkit:path"]).map(
      (span) => ({
        path: span.attributes["genkit:path"],
        status: span.attributes["genkit:state"] === "error" ? "failure" : "success",
        error: (0, import_utils.extractErrorName)(span.events),
        latency: (0, import_core2.hrTimeToMilliseconds)(
          (0, import_core2.hrTimeDuration)(span.startTime, span.endTime)
        )
      })
    );
    const allLeafPaths = new Set(
      allPaths.filter(
        (leafPath) => allPaths.every(
          (path) => path.path === leafPath.path || !path.path.startsWith(leafPath.path) || path.path.startsWith(leafPath.path) && path.status !== leafPath.status
        )
      )
    );
    return spans.map((span) => {
      this.tickTelemetry(span, allLeafPaths);
      span = this.redactPii(span);
      span = this.markErrorSpanAsError(span);
      span = this.normalizeLabels(span);
      return span;
    });
  }
  tickTelemetry(span, paths) {
    const attributes = span.attributes;
    if (!Object.keys(attributes).includes("genkit:type")) {
      return;
    }
    const type = attributes["genkit:type"];
    const subtype = attributes["genkit:metadata:subtype"];
    if (type === "flow") {
      import_flow.flowsTelemetry.tick(span, paths, this.logIO, this.projectId);
      return;
    }
    if (type === "action" && subtype === "model") {
      import_generate.generateTelemetry.tick(span, paths, this.logIO, this.projectId);
      return;
    }
    if (type === "action" || type == "flowStep") {
      import_action.actionTelemetry.tick(span, paths, this.logIO, this.projectId);
    }
  }
  redactPii(span) {
    const hasInput = "genkit:input" in span.attributes;
    const hasOutput = "genkit:output" in span.attributes;
    return !hasInput && !hasOutput ? span : __spreadProps(__spreadValues({}, span), {
      spanContext: span.spanContext,
      attributes: __spreadProps(__spreadValues({}, span.attributes), {
        "genkit:input": "<redacted>",
        "genkit:output": "<redacted>"
      })
    });
  }
  // This is a workaround for GCP Trace to mark a span with a red
  // exclamation mark indicating that it is an error.
  markErrorSpanAsError(span) {
    return span.status.code !== import_api.SpanStatusCode.ERROR ? span : __spreadProps(__spreadValues({}, span), {
      spanContext: span.spanContext,
      attributes: __spreadProps(__spreadValues({}, span.attributes), {
        "/http/status_code": "599"
      })
    });
  }
  // This is a workaround for GCP Trace to mark a span with a red
  // exclamation mark indicating that it is an error.
  normalizeLabels(span) {
    const normalized = {};
    for (const [key, value] of Object.entries(span.attributes)) {
      normalized[key.replace(/\:/g, "/")] = value;
    }
    return __spreadProps(__spreadValues({}, span), {
      spanContext: span.spanContext,
      attributes: normalized
    });
  }
}
function __getMetricExporterForTesting() {
  return metricExporter;
}
function __getSpanExporterForTesting() {
  return spanExporter.getExporter();
}
function __forceFlushSpansForTesting() {
  spanProcessor.forceFlush();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GcpOpenTelemetry,
  __forceFlushSpansForTesting,
  __getMetricExporterForTesting,
  __getSpanExporterForTesting
});
//# sourceMappingURL=gcpOpenTelemetry.js.map
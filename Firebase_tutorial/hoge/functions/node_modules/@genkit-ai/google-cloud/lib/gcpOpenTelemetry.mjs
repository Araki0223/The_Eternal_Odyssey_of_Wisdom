import {
  __spreadProps,
  __spreadValues
} from "./chunk-DJRN6NKF.mjs";
import { GENKIT_VERSION } from "@genkit-ai/core";
import { MetricExporter } from "@google-cloud/opentelemetry-cloud-monitoring-exporter";
import { TraceExporter } from "@google-cloud/opentelemetry-cloud-trace-exporter";
import { GcpDetectorSync } from "@google-cloud/opentelemetry-resource-util";
import { SpanStatusCode, TraceFlags } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import {
  hrTimeDuration,
  hrTimeToMilliseconds
} from "@opentelemetry/core";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { Resource } from "@opentelemetry/resources";
import {
  AggregationTemporality,
  DefaultAggregation,
  ExponentialHistogramAggregation,
  InMemoryMetricExporter,
  InstrumentType,
  PeriodicExportingMetricReader
} from "@opentelemetry/sdk-metrics";
import {
  BatchSpanProcessor,
  InMemorySpanExporter
} from "@opentelemetry/sdk-trace-base";
import { extractErrorName } from "./utils";
import { actionTelemetry } from "./telemetry/action.js";
import { flowsTelemetry } from "./telemetry/flow.js";
import { generateTelemetry } from "./telemetry/generate.js";
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
      const isSampled = !!(spanContext.traceFlags & TraceFlags.SAMPLED);
      const projectId = this.config.projectId;
      (_a = record["logging.googleapis.com/trace"]) != null ? _a : record["logging.googleapis.com/trace"] = `projects/${projectId}/traces/${spanContext.traceId}`;
      (_b = record["logging.googleapis.com/trace_sampled"]) != null ? _b : record["logging.googleapis.com/trace_sampled"] = isSampled ? "1" : "0";
      (_c = record["logging.googleapis.com/spanId"]) != null ? _c : record["logging.googleapis.com/spanId"] = spanContext.spanId;
    };
    this.config = config;
    this.resource = new Resource({ type: "global" }).merge(
      new GcpDetectorSync().detect()
    );
  }
  getConfig() {
    spanProcessor = new BatchSpanProcessor(this.createSpanExporter());
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
      this.shouldExportTraces() ? new TraceExporter({
        credentials: this.config.credentials
      }) : new InMemorySpanExporter(),
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
    return new PeriodicExportingMetricReader({
      exportIntervalMillis: this.config.telemetry.metricExportIntervalMillis,
      exportTimeoutMillis: this.config.telemetry.metricExportTimeoutMillis,
      exporter: metricExporter
    });
  }
  /** Gets all open telemetry instrumentations as configured by the plugin. */
  getInstrumentations() {
    if (this.config.telemetry.autoInstrumentation) {
      return getNodeAutoInstrumentations(
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
      new WinstonInstrumentation({ logHook: this.gcpTraceLogHook }),
      new PinoInstrumentation({ logHook: this.gcpTraceLogHook })
    ];
  }
  buildMetricExporter() {
    const exporter = this.shouldExportMetrics() ? new MetricExporter({
      projectId: this.config.projectId,
      userAgent: {
        product: "genkit",
        version: GENKIT_VERSION
      },
      credentials: this.config.credentials
    }) : new InMemoryMetricExporter(AggregationTemporality.DELTA);
    exporter.selectAggregation = (instrumentType) => {
      if (instrumentType === InstrumentType.HISTOGRAM) {
        return new ExponentialHistogramAggregation();
      }
      return new DefaultAggregation();
    };
    exporter.selectAggregationTemporality = (instrumentType) => {
      return AggregationTemporality.DELTA;
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
        error: extractErrorName(span.events),
        latency: hrTimeToMilliseconds(
          hrTimeDuration(span.startTime, span.endTime)
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
      flowsTelemetry.tick(span, paths, this.logIO, this.projectId);
      return;
    }
    if (type === "action" && subtype === "model") {
      generateTelemetry.tick(span, paths, this.logIO, this.projectId);
      return;
    }
    if (type === "action" || type == "flowStep") {
      actionTelemetry.tick(span, paths, this.logIO, this.projectId);
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
    return span.status.code !== SpanStatusCode.ERROR ? span : __spreadProps(__spreadValues({}, span), {
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
export {
  GcpOpenTelemetry,
  __forceFlushSpansForTesting,
  __getMetricExporterForTesting,
  __getSpanExporterForTesting
};
//# sourceMappingURL=gcpOpenTelemetry.mjs.map
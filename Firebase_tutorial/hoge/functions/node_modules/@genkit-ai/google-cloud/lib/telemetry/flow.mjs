import {
  __spreadProps,
  __spreadValues
} from "../chunk-DJRN6NKF.mjs";
import { GENKIT_VERSION } from "@genkit-ai/core";
import { logger } from "@genkit-ai/core/logging";
import { toDisplayPath } from "@genkit-ai/core/tracing";
import { ValueType } from "@opentelemetry/api";
import { hrTimeDuration, hrTimeToMilliseconds } from "@opentelemetry/core";
import {
  MetricCounter,
  MetricHistogram,
  internalMetricNamespaceWrap
} from "../metrics";
import {
  createCommonLogAttributes,
  extractErrorMessage,
  extractErrorName,
  extractErrorStack
} from "../utils";
class FlowsTelemetry {
  constructor() {
    /**
     * Wraps the declared metrics in a Genkit-specific, internal namespace.
     */
    this._N = internalMetricNamespaceWrap.bind(null, "flow");
    this.flowCounter = new MetricCounter(this._N("requests"), {
      description: "Counts calls to genkit flows.",
      valueType: ValueType.INT
    });
    this.pathCounter = new MetricCounter(this._N("path/requests"), {
      description: "Tracks unique flow paths per flow.",
      valueType: ValueType.INT
    });
    this.pathLatencies = new MetricHistogram(this._N("path/latency"), {
      description: "Latencies per flow path.",
      ValueType: ValueType.DOUBLE,
      unit: "ms"
    });
    this.flowLatencies = new MetricHistogram(this._N("latency"), {
      description: "Latencies when calling Genkit flows.",
      valueType: ValueType.DOUBLE,
      unit: "ms"
    });
  }
  tick(span, paths, logIO, projectId) {
    const attributes = span.attributes;
    const name = attributes["genkit:name"];
    const path = attributes["genkit:path"];
    const latencyMs = hrTimeToMilliseconds(
      hrTimeDuration(span.startTime, span.endTime)
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
      const errorName = extractErrorName(span.events) || "<unknown>";
      const errorMessage = extractErrorMessage(span.events) || "<unknown>";
      const errorStack = extractErrorStack(span.events) || "";
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
    logger.warn(`Unknown flow state; ${state}`);
  }
  recordIO(span, tag, flowName, qualifiedPath, input, projectId) {
    const path = toDisplayPath(qualifiedPath);
    const sharedMetadata = __spreadProps(__spreadValues({}, createCommonLogAttributes(span, projectId)), {
      path,
      qualifiedPath,
      flowName
    });
    logger.logStructured(`${tag}[${path}, ${flowName}]`, __spreadProps(__spreadValues({}, sharedMetadata), {
      content: input
    }));
  }
  recordError(span, path, errorName, errorMessage, errorStack, projectId) {
    const displayPath = toDisplayPath(path);
    logger.logStructuredError(`Error[${displayPath}, ${errorName}]`, __spreadProps(__spreadValues({}, createCommonLogAttributes(span, projectId)), {
      path: displayPath,
      qualifiedPath: path,
      name: errorName,
      message: errorMessage,
      stack: errorStack,
      source: "ts",
      sourceVersion: GENKIT_VERSION
    }));
  }
  writeFlowSuccess(span, paths, flowName, path, latencyMs, isRoot, projectId) {
    const dimensions = {
      name: flowName,
      status: "success",
      source: "ts",
      sourceVersion: GENKIT_VERSION
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
      sourceVersion: GENKIT_VERSION,
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
      logger.logStructured(`Paths[${flowName}]`, __spreadProps(__spreadValues({}, createCommonLogAttributes(span, projectId)), {
        flowName,
        paths: flowPaths.map((p) => toDisplayPath(p.path))
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
      sourceVersion: GENKIT_VERSION
    };
    this.pathCounter.add(1, pathDimensions);
    this.pathLatencies.record(meta.latency, pathDimensions);
  }
}
const flowsTelemetry = new FlowsTelemetry();
export {
  flowsTelemetry
};
//# sourceMappingURL=flow.mjs.map
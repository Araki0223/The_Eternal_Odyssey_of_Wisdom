import "../chunk-DJRN6NKF.mjs";
import { GENKIT_VERSION } from "@genkit-ai/core";
import { logger } from "@genkit-ai/core/logging";
import { ValueType } from "@opentelemetry/api";
import { hrTimeDuration, hrTimeToMilliseconds } from "@opentelemetry/core";
import {
  MetricCounter,
  MetricHistogram,
  internalMetricNamespaceWrap
} from "../metrics.js";
import { extractErrorName, extractOuterFlowNameFromPath } from "../utils";
class ActionTelemetry {
  constructor() {
    /**
     * Wraps the declared metrics in a Genkit-specific, internal namespace.
     */
    this._N = internalMetricNamespaceWrap.bind(null, "action");
    this.actionCounter = new MetricCounter(this._N("requests"), {
      description: "Counts calls to genkit actions.",
      valueType: ValueType.INT
    });
    this.actionLatencies = new MetricHistogram(this._N("latency"), {
      description: "Latencies when calling Genkit actions.",
      valueType: ValueType.DOUBLE,
      unit: "ms"
    });
  }
  tick(span, paths, logIO, projectId) {
    const attributes = span.attributes;
    const actionName = attributes["genkit:name"] || "<unknown>";
    const path = attributes["genkit:path"] || "<unknown>";
    const flowName = attributes["genkit:metadata:flow:name"] || extractOuterFlowNameFromPath(path);
    const state = attributes["genkit:state"] || "success";
    const latencyMs = hrTimeToMilliseconds(
      hrTimeDuration(span.startTime, span.endTime)
    );
    const errorName = extractErrorName(span.events);
    if (state === "success") {
      this.writeSuccess(actionName, flowName, path, latencyMs);
      return;
    }
    if (state === "error") {
      this.writeFailure(actionName, flowName, path, latencyMs, errorName);
    }
    logger.warn(`Unknown action state; ${state}`);
  }
  writeSuccess(actionName, flowName, path, latencyMs) {
    const dimensions = {
      name: actionName,
      flowName,
      path,
      status: "success",
      source: "ts",
      sourceVersion: GENKIT_VERSION
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
      sourceVersion: GENKIT_VERSION,
      status: "failure",
      error: errorName
    };
    this.actionCounter.add(1, dimensions);
    this.actionLatencies.record(latencyMs, dimensions);
  }
}
const actionTelemetry = new ActionTelemetry();
export {
  actionTelemetry
};
//# sourceMappingURL=action.mjs.map
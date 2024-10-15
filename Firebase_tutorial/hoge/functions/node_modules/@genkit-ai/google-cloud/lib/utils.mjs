import "./chunk-DJRN6NKF.mjs";
import { TraceFlags } from "@opentelemetry/api";
function extractOuterFlowNameFromPath(path) {
  if (!path || path === "<unknown>") {
    return "<unknown>";
  }
  const flowName = path.match("/{([^,}]+),t:flow}+");
  return flowName ? flowName[1] : "<unknown>";
}
function extractErrorName(events) {
  return events.filter((event) => event.name === "exception").map((event) => {
    const attributes = event.attributes;
    return attributes ? attributes["exception.type"] : "<unknown>";
  }).at(0);
}
function extractErrorMessage(events) {
  return events.filter((event) => event.name === "exception").map((event) => {
    const attributes = event.attributes;
    return attributes ? attributes["exception.message"] : "<unknown>";
  }).at(0);
}
function extractErrorStack(events) {
  return events.filter((event) => event.name === "exception").map((event) => {
    const attributes = event.attributes;
    return attributes ? attributes["exception.stacktrace"] : "<unknown>";
  }).at(0);
}
function createCommonLogAttributes(span, projectId) {
  const spanContext = span.spanContext();
  const isSampled = !!(spanContext.traceFlags & TraceFlags.SAMPLED);
  return {
    "logging.googleapis.com/spanId": spanContext.spanId,
    "logging.googleapis.com/trace": `projects/${projectId}/traces/${spanContext.traceId}`,
    "logging.googleapis.com/trace_sampled": isSampled ? "1" : "0"
  };
}
export {
  createCommonLogAttributes,
  extractErrorMessage,
  extractErrorName,
  extractErrorStack,
  extractOuterFlowNameFromPath
};
//# sourceMappingURL=utils.mjs.map
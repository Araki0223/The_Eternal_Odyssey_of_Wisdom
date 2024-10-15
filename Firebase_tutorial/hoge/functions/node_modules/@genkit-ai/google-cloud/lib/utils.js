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
var utils_exports = {};
__export(utils_exports, {
  createCommonLogAttributes: () => createCommonLogAttributes,
  extractErrorMessage: () => extractErrorMessage,
  extractErrorName: () => extractErrorName,
  extractErrorStack: () => extractErrorStack,
  extractOuterFlowNameFromPath: () => extractOuterFlowNameFromPath
});
module.exports = __toCommonJS(utils_exports);
var import_api = require("@opentelemetry/api");
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
  const isSampled = !!(spanContext.traceFlags & import_api.TraceFlags.SAMPLED);
  return {
    "logging.googleapis.com/spanId": spanContext.spanId,
    "logging.googleapis.com/trace": `projects/${projectId}/traces/${spanContext.traceId}`,
    "logging.googleapis.com/trace_sampled": isSampled ? "1" : "0"
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCommonLogAttributes,
  extractErrorMessage,
  extractErrorName,
  extractErrorStack,
  extractOuterFlowNameFromPath
});
//# sourceMappingURL=utils.js.map
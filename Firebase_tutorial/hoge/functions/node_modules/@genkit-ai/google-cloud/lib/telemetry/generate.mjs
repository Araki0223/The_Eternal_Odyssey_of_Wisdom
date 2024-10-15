import {
  __spreadProps,
  __spreadValues
} from "../chunk-DJRN6NKF.mjs";
import { GENKIT_VERSION } from "@genkit-ai/core";
import { logger } from "@genkit-ai/core/logging";
import { toDisplayPath } from "@genkit-ai/core/tracing";
import { ValueType } from "@opentelemetry/api";
import { createHash } from "crypto";
import {
  MetricCounter,
  MetricHistogram,
  internalMetricNamespaceWrap
} from "../metrics";
import truncate from "truncate-utf8-bytes";
import {
  createCommonLogAttributes,
  extractErrorName,
  extractOuterFlowNameFromPath
} from "../utils";
class GenerateTelemetry {
  constructor() {
    /**
     * Wraps the declared metrics in a Genkit-specific, internal namespace.
     */
    this._N = internalMetricNamespaceWrap.bind(null, "ai");
    /** The maximum length (in bytes) of a logged prompt message. The maximum log
     * size in GCP is 256kb, so using slightly lower for some buffer for the rest
     * of the message*/
    this.MAX_LOG_CONTENT_BYTES = 2e5;
    this.actionCounter = new MetricCounter(this._N("generate/requests"), {
      description: "Counts calls to genkit generate actions.",
      valueType: ValueType.INT
    });
    this.latencies = new MetricHistogram(this._N("generate/latency"), {
      description: "Latencies when interacting with a Genkit model.",
      valueType: ValueType.DOUBLE,
      unit: "ms"
    });
    this.inputCharacters = new MetricCounter(
      this._N("generate/input/characters"),
      {
        description: "Counts input characters to any Genkit model.",
        valueType: ValueType.INT
      }
    );
    this.inputTokens = new MetricCounter(this._N("generate/input/tokens"), {
      description: "Counts input tokens to a Genkit model.",
      valueType: ValueType.INT
    });
    this.inputImages = new MetricCounter(this._N("generate/input/images"), {
      description: "Counts input images to a Genkit model.",
      valueType: ValueType.INT
    });
    this.inputVideos = new MetricCounter(this._N("generate/input/videos"), {
      description: "Counts input videos to a Genkit model.",
      valueType: ValueType.INT
    });
    this.inputAudio = new MetricCounter(this._N("generate/input/audio"), {
      description: "Counts input audio files to a Genkit model.",
      valueType: ValueType.INT
    });
    this.outputCharacters = new MetricCounter(
      this._N("generate/output/characters"),
      {
        description: "Counts output characters from a Genkit model.",
        valueType: ValueType.INT
      }
    );
    this.outputTokens = new MetricCounter(this._N("generate/output/tokens"), {
      description: "Counts output tokens from a Genkit model.",
      valueType: ValueType.INT
    });
    this.outputImages = new MetricCounter(this._N("generate/output/images"), {
      description: "Count output images from a Genkit model.",
      valueType: ValueType.INT
    });
    this.outputVideos = new MetricCounter(this._N("generate/output/videos"), {
      description: "Count output videos from a Genkit model.",
      valueType: ValueType.INT
    });
    this.outputAudio = new MetricCounter(this._N("generate/output/audio"), {
      description: "Count output audio files from a Genkit model.",
      valueType: ValueType.INT
    });
  }
  tick(span, paths, logIO, projectId) {
    const attributes = span.attributes;
    const modelName = attributes["genkit:name"];
    const path = attributes["genkit:path"] || "";
    const input = "genkit:input" in attributes ? JSON.parse(
      attributes["genkit:input"]
    ) : void 0;
    const output = "genkit:output" in attributes ? JSON.parse(
      attributes["genkit:output"]
    ) : void 0;
    const errName = extractErrorName(span.events);
    const flowName = extractOuterFlowNameFromPath(path);
    if (input) {
      this.recordGenerateActionMetrics(modelName, flowName, path, input, {
        response: output,
        errName
      });
      this.recordGenerateActionConfigLogs(
        span,
        modelName,
        flowName,
        path,
        input,
        projectId
      );
      if (logIO) {
        this.recordGenerateActionInputLogs(
          span,
          modelName,
          flowName,
          path,
          input,
          projectId
        );
      }
    }
    if (output && logIO) {
      this.recordGenerateActionOutputLogs(
        span,
        modelName,
        flowName,
        path,
        output,
        projectId
      );
    }
  }
  recordGenerateActionMetrics(modelName, flowName, path, input, opts) {
    var _a, _b, _c, _d, _e, _f;
    this.doRecordGenerateActionMetrics(modelName, ((_a = opts.response) == null ? void 0 : _a.usage) || {}, {
      temperature: (_b = input.config) == null ? void 0 : _b.temperature,
      topK: (_c = input.config) == null ? void 0 : _c.topK,
      topP: (_d = input.config) == null ? void 0 : _d.topP,
      maxOutputTokens: (_e = input.config) == null ? void 0 : _e.maxOutputTokens,
      flowName,
      path,
      latencyMs: (_f = opts.response) == null ? void 0 : _f.latencyMs,
      errName: opts.errName,
      source: "ts",
      sourceVersion: GENKIT_VERSION
    });
  }
  recordGenerateActionConfigLogs(span, model, flowName, qualifiedPath, input, projectId) {
    var _a, _b, _c, _d, _e;
    const path = toDisplayPath(qualifiedPath);
    const sharedMetadata = __spreadProps(__spreadValues({}, createCommonLogAttributes(span, projectId)), {
      model,
      path,
      qualifiedPath,
      flowName
    });
    logger.logStructured(`Config[${path}, ${model}]`, __spreadProps(__spreadValues({}, sharedMetadata), {
      temperature: (_a = input.config) == null ? void 0 : _a.temperature,
      topK: (_b = input.config) == null ? void 0 : _b.topK,
      topP: (_c = input.config) == null ? void 0 : _c.topP,
      maxOutputTokens: (_d = input.config) == null ? void 0 : _d.maxOutputTokens,
      stopSequences: (_e = input.config) == null ? void 0 : _e.stopSequences,
      source: "ts",
      sourceVersion: GENKIT_VERSION
    }));
  }
  recordGenerateActionInputLogs(span, model, flowName, qualifiedPath, input, projectId) {
    const path = toDisplayPath(qualifiedPath);
    const sharedMetadata = __spreadProps(__spreadValues({}, createCommonLogAttributes(span, projectId)), {
      model,
      path,
      qualifiedPath,
      flowName
    });
    const messages = input.messages.length;
    input.messages.forEach((msg, msgIdx) => {
      const parts = msg.content.length;
      msg.content.forEach((part, partIdx) => {
        const partCounts = this.toPartCounts(partIdx, parts, msgIdx, messages);
        logger.logStructured(`Input[${path}, ${model}] ${partCounts}`, __spreadProps(__spreadValues({}, sharedMetadata), {
          content: this.toPartLogContent(part),
          partIndex: partIdx,
          totalParts: parts,
          messageIndex: msgIdx,
          totalMessages: messages
        }));
      });
    });
  }
  recordGenerateActionOutputLogs(span, model, flowName, qualifiedPath, output, projectId) {
    const path = toDisplayPath(qualifiedPath);
    const sharedMetadata = __spreadProps(__spreadValues({}, createCommonLogAttributes(span, projectId)), {
      model,
      path,
      qualifiedPath,
      flowName
    });
    const candidates = output.candidates.length;
    output.candidates.forEach((cand, candIdx) => {
      const parts = cand.message.content.length;
      const candCounts = parts > 1 ? ` (${candIdx + 1} of ${parts})` : "";
      logger.logStructured(`Output Candidate[${path}, ${model}]${candCounts}`, __spreadProps(__spreadValues({}, sharedMetadata), {
        candidateIndex: candIdx,
        totalCandidates: candidates,
        messageIndex: cand.index,
        finishReason: cand.finishReason,
        finishMessage: cand.finishMessage,
        role: cand.message.role,
        usage: cand.usage,
        custom: cand.custom
      }));
      cand.message.content.forEach((part, partIdx) => {
        const partCounts = this.toPartCounts(
          partIdx,
          parts,
          candIdx,
          candidates
        );
        const initial = cand.finishMessage ? { finishMessage: this.toPartLogText(cand.finishMessage) } : {};
        logger.logStructured(`Output[${path}, ${model}] ${partCounts}`, __spreadProps(__spreadValues(__spreadValues({}, initial), sharedMetadata), {
          content: this.toPartLogContent(part),
          partIndex: partIdx,
          totalParts: parts,
          candidateIndex: candIdx,
          totalCandidates: candidates,
          messageIndex: cand.index,
          finishReason: cand.finishReason
        }));
      });
      if (output.usage) {
        logger.logStructured(`Usage[${path}, ${model}]`, __spreadProps(__spreadValues({}, sharedMetadata), {
          usage: output.usage
        }));
      }
    });
  }
  toPartCounts(partOrdinal, parts, msgOrdinal, messages) {
    if (parts > 1 && messages > 1) {
      return `(part ${this.xOfY(partOrdinal, parts)} in message ${this.xOfY(
        msgOrdinal,
        messages
      )})`;
    }
    if (parts > 1) {
      return `(part ${this.xOfY(partOrdinal, parts)})`;
    }
    if (messages > 1) {
      return `(message ${this.xOfY(msgOrdinal, messages)})`;
    }
    return "";
  }
  xOfY(x, y) {
    return `${x} of ${y}`;
  }
  toPartLogContent(part) {
    if (part.text) {
      return this.toPartLogText(part.text);
    }
    if (part.media) {
      return this.toPartLogMedia(part);
    }
    if (part.toolRequest) {
      return this.toPartLogToolRequest(part);
    }
    if (part.toolResponse) {
      return this.toPartLogToolResponse(part);
    }
    return "<unknown format>";
  }
  toPartLogText(text) {
    return truncate(text, this.MAX_LOG_CONTENT_BYTES);
  }
  toPartLogMedia(part) {
    if (part.media.url.startsWith("data:")) {
      const splitIdx = part.media.url.indexOf("base64,");
      if (splitIdx < 0) {
        return "<unknown media format>";
      }
      const prefix = part.media.url.substring(0, splitIdx + 7);
      const hashedContent = createHash("sha256").update(part.media.url.substring(splitIdx + 7)).digest("hex");
      return `${prefix}<sha256(${hashedContent})>`;
    }
    return this.toPartLogText(part.media.url);
  }
  toPartLogToolRequest(part) {
    const inputText = typeof part.toolRequest.input === "string" ? part.toolRequest.input : JSON.stringify(part.toolRequest.input);
    return this.toPartLogText(
      `Tool request: ${part.toolRequest.name}, ref: ${part.toolRequest.ref}, input: ${inputText}`
    );
  }
  toPartLogToolResponse(part) {
    const outputText = typeof part.toolResponse.output === "string" ? part.toolResponse.output : JSON.stringify(part.toolResponse.output);
    return this.toPartLogText(
      `Tool response: ${part.toolResponse.name}, ref: ${part.toolResponse.ref}, output: ${outputText}`
    );
  }
  /**
   * Records all metrics associated with performing a GenerateAction.
   */
  doRecordGenerateActionMetrics(modelName, usage, dimensions) {
    const shared = {
      modelName,
      flowName: dimensions.flowName,
      path: dimensions.path,
      temperature: dimensions.temperature,
      topK: dimensions.topK,
      topP: dimensions.topP,
      source: dimensions.source,
      sourceVersion: dimensions.sourceVersion,
      status: dimensions.errName ? "failure" : "success"
    };
    this.actionCounter.add(1, __spreadValues({
      maxOutputTokens: dimensions.maxOutputTokens,
      error: dimensions.errName
    }, shared));
    this.latencies.record(dimensions.latencyMs, shared);
    this.inputTokens.add(usage.inputTokens, shared);
    this.inputCharacters.add(usage.inputCharacters, shared);
    this.inputImages.add(usage.inputImages, shared);
    this.inputVideos.add(usage.inputVideos, shared);
    this.inputAudio.add(usage.inputAudioFiles, shared);
    this.outputTokens.add(usage.outputTokens, shared);
    this.outputCharacters.add(usage.outputCharacters, shared);
    this.outputImages.add(usage.outputImages, shared);
    this.outputVideos.add(usage.outputVideos, shared);
    this.outputAudio.add(usage.outputAudioFiles, shared);
  }
}
const generateTelemetry = new GenerateTelemetry();
export {
  generateTelemetry
};
//# sourceMappingURL=generate.mjs.map
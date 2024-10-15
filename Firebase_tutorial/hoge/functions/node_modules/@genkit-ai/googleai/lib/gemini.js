"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __knownSymbol = (name, symbol) => {
  return (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);
var gemini_exports = {};
__export(gemini_exports, {
  SUPPORTED_V15_MODELS: () => SUPPORTED_V15_MODELS,
  SUPPORTED_V1_MODELS: () => SUPPORTED_V1_MODELS,
  fromGeminiCandidate: () => fromGeminiCandidate,
  gemini15Flash: () => gemini15Flash,
  gemini15Flash8B: () => gemini15Flash8B,
  gemini15Pro: () => gemini15Pro,
  geminiPro: () => geminiPro,
  geminiProVision: () => geminiProVision,
  geminiUltra: () => geminiUltra,
  googleAIModel: () => googleAIModel,
  toGeminiMessage: () => toGeminiMessage,
  toGeminiSystemInstruction: () => toGeminiSystemInstruction
});
module.exports = __toCommonJS(gemini_exports);
var import_extract = require("@genkit-ai/ai/extract");
var import_model = require("@genkit-ai/ai/model");
var import_middleware = require("@genkit-ai/ai/model/middleware");
var import_core = require("@genkit-ai/core");
var import_generative_ai = require("@google/generative-ai");
var import_process = __toESM(require("process"));
var import_zod = __toESM(require("zod"));
const SafetySettingsSchema = import_zod.default.object({
  category: import_zod.default.enum([
    "HARM_CATEGORY_UNSPECIFIED",
    "HARM_CATEGORY_HATE_SPEECH",
    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "HARM_CATEGORY_HARASSMENT",
    "HARM_CATEGORY_DANGEROUS_CONTENT"
  ]),
  threshold: import_zod.default.enum([
    "BLOCK_LOW_AND_ABOVE",
    "BLOCK_MEDIUM_AND_ABOVE",
    "BLOCK_ONLY_HIGH",
    "BLOCK_NONE"
  ])
});
const GeminiConfigSchema = import_model.GenerationCommonConfigSchema.extend({
  safetySettings: import_zod.default.array(SafetySettingsSchema).optional(),
  codeExecution: import_zod.default.union([import_zod.default.boolean(), import_zod.default.object({}).strict()]).optional()
});
const geminiPro = (0, import_model.modelRef)({
  name: "googleai/gemini-pro",
  info: {
    label: "Google AI - Gemini Pro",
    supports: {
      multiturn: true,
      media: false,
      tools: true,
      systemRole: true
    },
    versions: ["gemini-1.0-pro", "gemini-1.0-pro-latest", "gemini-1.0-pro-001"]
  },
  configSchema: GeminiConfigSchema
});
const geminiProVision = (0, import_model.modelRef)({
  name: "googleai/gemini-pro-vision",
  info: {
    label: "Google AI - Gemini Pro Vision",
    // none declared on https://ai.google.dev/models/gemini#model-variations
    versions: [],
    supports: {
      multiturn: true,
      media: true,
      tools: false,
      systemRole: false
    },
    stage: "deprecated"
  },
  configSchema: GeminiConfigSchema
});
const gemini15Pro = (0, import_model.modelRef)({
  name: "googleai/gemini-1.5-pro-latest",
  info: {
    label: "Google AI - Gemini 1.5 Pro",
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      systemRole: true,
      output: ["text", "json"]
    },
    versions: [
      "gemini-1.5-pro",
      "gemini-1.5-pro-001",
      "gemini-1.5-pro-002",
      "gemini-1.5-pro-exp-0827"
    ]
  },
  configSchema: GeminiConfigSchema
});
const gemini15Flash = (0, import_model.modelRef)({
  name: "googleai/gemini-1.5-flash-latest",
  info: {
    label: "Google AI - Gemini 1.5 Flash",
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      systemRole: true,
      output: ["text", "json"]
    },
    versions: [
      "gemini-1.5-flash",
      "gemini-1.5-flash-001",
      "gemini-1.5-flash-002",
      "gemini-1.5-flash-8b-exp-0924",
      "gemini-1.5-flash-8b-exp-0827",
      "gemini-1.5-flash-exp-0827"
    ]
  },
  configSchema: GeminiConfigSchema
});
const gemini15Flash8B = (0, import_model.modelRef)({
  name: "googleai/gemini-1.5-flash-8b-latest",
  info: {
    label: "Google AI - Gemini 1.5 Flash-8B",
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      systemRole: true,
      output: ["text", "json"]
    },
    versions: ["gemini-1.5-flash-8b", "gemini-1.5-flash-8b-001"]
  },
  configSchema: GeminiConfigSchema
});
const geminiUltra = (0, import_model.modelRef)({
  name: "googleai/gemini-ultra",
  info: {
    label: "Google AI - Gemini Ultra",
    versions: [],
    supports: {
      multiturn: true,
      media: false,
      tools: true,
      systemRole: true
    }
  },
  configSchema: GeminiConfigSchema
});
const SUPPORTED_V1_MODELS = {
  "gemini-pro": geminiPro,
  "gemini-pro-vision": geminiProVision
  // 'gemini-ultra': geminiUltra,
};
const SUPPORTED_V15_MODELS = {
  "gemini-1.5-pro-latest": gemini15Pro,
  "gemini-1.5-flash-latest": gemini15Flash,
  "gemini-1.5-flash-8b-latest": gemini15Flash8B
};
const SUPPORTED_MODELS = __spreadValues(__spreadValues({}, SUPPORTED_V1_MODELS), SUPPORTED_V15_MODELS);
function toGeminiRole(role, model) {
  switch (role) {
    case "user":
      return "user";
    case "model":
      return "model";
    case "system":
      if (model && SUPPORTED_V15_MODELS[model.name]) {
        throw new Error(
          "system role is only supported for a single message in the first position"
        );
      } else {
        throw new Error("system role is not supported");
      }
    case "tool":
      return "function";
    default:
      return "user";
  }
}
function convertSchemaProperty(property) {
  if (!property) {
    return null;
  }
  if (property.type === "object") {
    const nestedProperties = {};
    Object.keys(property.properties).forEach((key) => {
      nestedProperties[key] = convertSchemaProperty(property.properties[key]);
    });
    return {
      type: import_generative_ai.FunctionDeclarationSchemaType.OBJECT,
      properties: nestedProperties,
      required: property.required
    };
  } else if (property.type === "array") {
    return {
      type: import_generative_ai.FunctionDeclarationSchemaType.ARRAY,
      items: convertSchemaProperty(property.items)
    };
  } else {
    return {
      type: import_generative_ai.FunctionDeclarationSchemaType[property.type.toUpperCase()]
    };
  }
}
function toGeminiTool(tool) {
  const declaration = {
    name: tool.name.replace(/\//g, "__"),
    // Gemini throws on '/' in tool name
    description: tool.description,
    parameters: convertSchemaProperty(tool.inputSchema)
  };
  return declaration;
}
function toInlineData(part) {
  const dataUrl = part.media.url;
  const b64Data = dataUrl.substring(dataUrl.indexOf(",") + 1);
  const contentType = part.media.contentType || dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
  return { inlineData: { mimeType: contentType, data: b64Data } };
}
function toFileData(part) {
  if (!part.media.contentType)
    throw new Error(
      "Must supply a `contentType` when sending File URIs to Gemini."
    );
  return {
    fileData: { mimeType: part.media.contentType, fileUri: part.media.url }
  };
}
function fromInlineData(inlinePart) {
  if (!inlinePart.inlineData || !inlinePart.inlineData.hasOwnProperty("mimeType") || !inlinePart.inlineData.hasOwnProperty("data")) {
    throw new Error("Invalid InlineDataPart: missing required properties");
  }
  const { mimeType, data } = inlinePart.inlineData;
  const dataUrl = `data:${mimeType};base64,${data}`;
  return {
    media: {
      url: dataUrl,
      contentType: mimeType
    }
  };
}
function toFunctionCall(part) {
  var _a;
  if (!((_a = part == null ? void 0 : part.toolRequest) == null ? void 0 : _a.input)) {
    throw Error("Invalid ToolRequestPart: input was missing.");
  }
  return {
    functionCall: {
      name: part.toolRequest.name,
      args: part.toolRequest.input
    }
  };
}
function fromFunctionCall(part) {
  if (!part.functionCall) {
    throw Error("Invalid FunctionCallPart");
  }
  return {
    toolRequest: {
      name: part.functionCall.name,
      input: part.functionCall.args
    }
  };
}
function toFunctionResponse(part) {
  var _a;
  if (!((_a = part == null ? void 0 : part.toolResponse) == null ? void 0 : _a.output)) {
    throw Error("Invalid ToolResponsePart: output was missing.");
  }
  return {
    functionResponse: {
      name: part.toolResponse.name,
      response: {
        name: part.toolResponse.name,
        content: part.toolResponse.output
      }
    }
  };
}
function fromFunctionResponse(part) {
  if (!part.functionResponse) {
    throw new Error("Invalid FunctionResponsePart.");
  }
  return {
    toolResponse: {
      name: part.functionResponse.name.replace(/__/g, "/"),
      // restore slashes
      output: part.functionResponse.response
    }
  };
}
function fromExecutableCode(part) {
  if (!part.executableCode) {
    throw new Error("Invalid GeminiPart: missing executableCode");
  }
  return {
    custom: {
      executableCode: {
        language: part.executableCode.language,
        code: part.executableCode.code
      }
    }
  };
}
function fromCodeExecutionResult(part) {
  if (!part.codeExecutionResult) {
    throw new Error("Invalid GeminiPart: missing codeExecutionResult");
  }
  return {
    custom: {
      codeExecutionResult: {
        outcome: part.codeExecutionResult.outcome,
        output: part.codeExecutionResult.output
      }
    }
  };
}
function toCustomPart(part) {
  if (!part.custom) {
    throw new Error("Invalid GeminiPart: missing custom");
  }
  if (part.custom.codeExecutionResult) {
    return { codeExecutionResult: part.custom.codeExecutionResult };
  }
  if (part.custom.executableCode) {
    return { executableCode: part.custom.executableCode };
  }
  throw new Error("Unsupported Custom Part type");
}
function toGeminiPart(part) {
  if (part.text !== void 0)
    return { text: part.text };
  if (part.media) {
    if (part.media.url.startsWith("data:"))
      return toInlineData(part);
    return toFileData(part);
  }
  if (part.toolRequest)
    return toFunctionCall(part);
  if (part.toolResponse)
    return toFunctionResponse(part);
  if (part.custom)
    return toCustomPart(part);
  throw new Error("Unsupported Part type");
}
function fromGeminiPart(part, jsonMode) {
  if (jsonMode && part.text !== void 0) {
    return { data: (0, import_extract.extractJson)(part.text) };
  }
  if (part.text !== void 0)
    return { text: part.text };
  if (part.inlineData)
    return fromInlineData(part);
  if (part.functionCall)
    return fromFunctionCall(part);
  if (part.functionResponse)
    return fromFunctionResponse(part);
  if (part.executableCode)
    return fromExecutableCode(part);
  if (part.codeExecutionResult)
    return fromCodeExecutionResult(part);
  throw new Error("Unsupported GeminiPart type");
}
function toGeminiMessage(message, model) {
  return {
    role: toGeminiRole(message.role, model),
    parts: message.content.map(toGeminiPart)
  };
}
function toGeminiSystemInstruction(message) {
  return {
    role: "user",
    parts: message.content.map(toGeminiPart)
  };
}
function fromGeminiFinishReason(reason) {
  if (!reason)
    return "unknown";
  switch (reason) {
    case "STOP":
      return "stop";
    case "MAX_TOKENS":
      return "length";
    case "SAFETY":
    case "RECITATION":
      return "blocked";
    default:
      return "unknown";
  }
}
function fromGeminiCandidate(candidate, jsonMode = false) {
  var _a;
  return {
    index: candidate.index || 0,
    // reasonable default?
    message: {
      role: "model",
      content: (((_a = candidate.content) == null ? void 0 : _a.parts) || []).map(
        (part) => fromGeminiPart(part, jsonMode)
      )
    },
    finishReason: fromGeminiFinishReason(candidate.finishReason),
    finishMessage: candidate.finishMessage,
    custom: {
      safetyRatings: candidate.safetyRatings,
      citationMetadata: candidate.citationMetadata
    }
  };
}
function googleAIModel(name, apiKey, apiVersion, baseUrl) {
  var _a, _b;
  const modelName = `googleai/${name}`;
  if (!apiKey) {
    apiKey = import_process.default.env.GOOGLE_GENAI_API_KEY || import_process.default.env.GOOGLE_API_KEY;
  }
  if (!apiKey) {
    throw new Error(
      "Please pass in the API key or set the GOOGLE_GENAI_API_KEY or GOOGLE_API_KEY environment variable.\nFor more details see https://firebase.google.com/docs/genkit/plugins/google-genai"
    );
  }
  const model = SUPPORTED_MODELS[name];
  if (!model)
    throw new Error(`Unsupported model: ${name}`);
  const middleware = [];
  if (SUPPORTED_V1_MODELS[name]) {
    middleware.push((0, import_middleware.simulateSystemPrompt)());
  }
  if ((_b = (_a = model == null ? void 0 : model.info) == null ? void 0 : _a.supports) == null ? void 0 : _b.media) {
    middleware.push(
      (0, import_middleware.downloadRequestMedia)({
        maxBytes: 1024 * 1024 * 10,
        // don't downlaod files that have been uploaded using the Files API
        filter: (part) => !part.media.url.startsWith(
          "https://generativelanguage.googleapis.com/"
        )
      })
    );
  }
  return (0, import_model.defineModel)(
    __spreadProps(__spreadValues({
      name: modelName
    }, model.info), {
      configSchema: model.configSchema,
      use: middleware
    }),
    (request, streamingCallback) => __async(this, null, function* () {
      var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
      const options = { apiClient: import_core.GENKIT_CLIENT_HEADER };
      if (apiVersion) {
        options.apiVersion = apiVersion;
      }
      if (apiVersion) {
        options.baseUrl = baseUrl;
      }
      const client = new import_generative_ai.GoogleGenerativeAI(apiKey).getGenerativeModel(
        {
          model: ((_a2 = request.config) == null ? void 0 : _a2.version) || model.version || name
        },
        options
      );
      const messages = [...request.messages];
      if (messages.length === 0)
        throw new Error("No messages provided.");
      let systemInstruction = void 0;
      if (SUPPORTED_V15_MODELS[name]) {
        const systemMessage = messages.find((m) => m.role === "system");
        if (systemMessage) {
          messages.splice(messages.indexOf(systemMessage), 1);
          systemInstruction = toGeminiSystemInstruction(systemMessage);
        }
      }
      const tools = [];
      if ((_b2 = request.tools) == null ? void 0 : _b2.length) {
        tools.push({
          functionDeclarations: request.tools.map(toGeminiTool)
        });
      }
      if ((_c = request.config) == null ? void 0 : _c.codeExecution) {
        tools.push({
          codeExecution: request.config.codeExecution === true ? {} : request.config.codeExecution
        });
      }
      const jsonMode = (((_d = request.output) == null ? void 0 : _d.format) === "json" || !!((_e = request.output) == null ? void 0 : _e.schema)) && tools.length === 0;
      const generationConfig = {
        candidateCount: request.candidates || void 0,
        temperature: (_f = request.config) == null ? void 0 : _f.temperature,
        maxOutputTokens: (_g = request.config) == null ? void 0 : _g.maxOutputTokens,
        topK: (_h = request.config) == null ? void 0 : _h.topK,
        topP: (_i = request.config) == null ? void 0 : _i.topP,
        stopSequences: (_j = request.config) == null ? void 0 : _j.stopSequences,
        responseMimeType: jsonMode ? "application/json" : void 0
      };
      const chatRequest = {
        systemInstruction,
        generationConfig,
        tools,
        history: messages.slice(0, -1).map((message) => toGeminiMessage(message, model)),
        safetySettings: (_k = request.config) == null ? void 0 : _k.safetySettings
      };
      const msg = toGeminiMessage(messages[messages.length - 1], model);
      const fromJSONModeScopedGeminiCandidate = (candidate) => {
        return fromGeminiCandidate(candidate, jsonMode);
      };
      if (streamingCallback) {
        const result = yield client.startChat(chatRequest).sendMessageStream(msg.parts, options);
        try {
          for (var iter = __forAwait(result.stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
            const item = temp.value;
            (_l = item.candidates) == null ? void 0 : _l.forEach((candidate) => {
              const c = fromJSONModeScopedGeminiCandidate(candidate);
              streamingCallback({
                index: c.index,
                content: c.message.content
              });
            });
          }
        } catch (temp) {
          error = [temp];
        } finally {
          try {
            more && (temp = iter.return) && (yield temp.call(iter));
          } finally {
            if (error)
              throw error[0];
          }
        }
        const response = yield result.response;
        if (!((_m = response.candidates) == null ? void 0 : _m.length)) {
          throw new Error("No valid candidates returned.");
        }
        return {
          candidates: ((_n = response.candidates) == null ? void 0 : _n.map(fromJSONModeScopedGeminiCandidate)) || [],
          custom: response
        };
      } else {
        const result = yield client.startChat(chatRequest).sendMessage(msg.parts, options);
        if (!((_o = result.response.candidates) == null ? void 0 : _o.length))
          throw new Error("No valid candidates returned.");
        const responseCandidates = ((_p = result.response.candidates) == null ? void 0 : _p.map(fromJSONModeScopedGeminiCandidate)) || [];
        return {
          candidates: responseCandidates,
          custom: result.response,
          usage: __spreadProps(__spreadValues({}, (0, import_model.getBasicUsageStats)(request.messages, responseCandidates)), {
            inputTokens: (_q = result.response.usageMetadata) == null ? void 0 : _q.promptTokenCount,
            outputTokens: (_r = result.response.usageMetadata) == null ? void 0 : _r.candidatesTokenCount,
            totalTokens: (_s = result.response.usageMetadata) == null ? void 0 : _s.totalTokenCount
          })
        };
      }
    })
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SUPPORTED_V15_MODELS,
  SUPPORTED_V1_MODELS,
  fromGeminiCandidate,
  gemini15Flash,
  gemini15Flash8B,
  gemini15Pro,
  geminiPro,
  geminiProVision,
  geminiUltra,
  googleAIModel,
  toGeminiMessage,
  toGeminiSystemInstruction
});
//# sourceMappingURL=gemini.js.map
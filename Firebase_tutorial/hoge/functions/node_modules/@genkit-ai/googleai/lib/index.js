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
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  gemini15Flash: () => import_gemini.gemini15Flash,
  gemini15Flash8B: () => import_gemini.gemini15Flash8B,
  gemini15Pro: () => import_gemini.gemini15Pro,
  geminiPro: () => import_gemini.geminiPro,
  geminiProVision: () => import_gemini.geminiProVision,
  googleAI: () => googleAI,
  textEmbeddingGecko001: () => import_embedder.textEmbeddingGecko001
});
module.exports = __toCommonJS(src_exports);
var import_core = require("@genkit-ai/core");
var import_embedder = require("./embedder.js");
var import_gemini = require("./gemini.js");
const googleAI = (0, import_core.genkitPlugin)(
  "googleai",
  (options) => __async(void 0, null, function* () {
    let models;
    let embedders;
    let apiVersions = ["v1"];
    if (options == null ? void 0 : options.apiVersion) {
      if (Array.isArray(options == null ? void 0 : options.apiVersion)) {
        apiVersions = options == null ? void 0 : options.apiVersion;
      } else {
        apiVersions = [options == null ? void 0 : options.apiVersion];
      }
    }
    if (apiVersions.includes("v1beta")) {
      embedders = [], models = [
        ...Object.keys(import_gemini.SUPPORTED_V15_MODELS).map(
          (name) => (0, import_gemini.googleAIModel)(name, options == null ? void 0 : options.apiKey, "v1beta", options == null ? void 0 : options.baseUrl)
        )
      ];
    }
    if (apiVersions.includes("v1")) {
      models = [
        ...Object.keys(import_gemini.SUPPORTED_V1_MODELS).map(
          (name) => (0, import_gemini.googleAIModel)(name, options == null ? void 0 : options.apiKey, void 0, options == null ? void 0 : options.baseUrl)
        ),
        ...Object.keys(import_gemini.SUPPORTED_V15_MODELS).map(
          (name) => (0, import_gemini.googleAIModel)(name, options == null ? void 0 : options.apiKey, void 0, options == null ? void 0 : options.baseUrl)
        )
      ];
      embedders = [
        ...Object.keys(import_embedder.SUPPORTED_MODELS).map(
          (name) => (0, import_embedder.textEmbeddingGeckoEmbedder)(name, { apiKey: options == null ? void 0 : options.apiKey })
        )
      ];
    }
    return {
      models,
      embedders
    };
  })
);
var src_default = googleAI;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  gemini15Flash,
  gemini15Flash8B,
  gemini15Pro,
  geminiPro,
  geminiProVision,
  googleAI,
  textEmbeddingGecko001
});
//# sourceMappingURL=index.js.map
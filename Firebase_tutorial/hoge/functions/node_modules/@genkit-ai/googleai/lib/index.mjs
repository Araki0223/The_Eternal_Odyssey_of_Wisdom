import {
  __async
} from "./chunk-WFI2LP4G.mjs";
import { genkitPlugin } from "@genkit-ai/core";
import {
  SUPPORTED_MODELS as EMBEDDER_MODELS,
  textEmbeddingGecko001,
  textEmbeddingGeckoEmbedder
} from "./embedder.js";
import {
  gemini15Flash,
  gemini15Flash8B,
  gemini15Pro,
  geminiPro,
  geminiProVision,
  googleAIModel,
  SUPPORTED_V15_MODELS,
  SUPPORTED_V1_MODELS
} from "./gemini.js";
const googleAI = genkitPlugin(
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
        ...Object.keys(SUPPORTED_V15_MODELS).map(
          (name) => googleAIModel(name, options == null ? void 0 : options.apiKey, "v1beta", options == null ? void 0 : options.baseUrl)
        )
      ];
    }
    if (apiVersions.includes("v1")) {
      models = [
        ...Object.keys(SUPPORTED_V1_MODELS).map(
          (name) => googleAIModel(name, options == null ? void 0 : options.apiKey, void 0, options == null ? void 0 : options.baseUrl)
        ),
        ...Object.keys(SUPPORTED_V15_MODELS).map(
          (name) => googleAIModel(name, options == null ? void 0 : options.apiKey, void 0, options == null ? void 0 : options.baseUrl)
        )
      ];
      embedders = [
        ...Object.keys(EMBEDDER_MODELS).map(
          (name) => textEmbeddingGeckoEmbedder(name, { apiKey: options == null ? void 0 : options.apiKey })
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
export {
  src_default as default,
  gemini15Flash,
  gemini15Flash8B,
  gemini15Pro,
  geminiPro,
  geminiProVision,
  googleAI,
  textEmbeddingGecko001
};
//# sourceMappingURL=index.mjs.map
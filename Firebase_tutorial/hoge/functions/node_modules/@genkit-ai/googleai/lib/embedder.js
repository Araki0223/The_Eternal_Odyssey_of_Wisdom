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
var embedder_exports = {};
__export(embedder_exports, {
  SUPPORTED_MODELS: () => SUPPORTED_MODELS,
  TaskTypeSchema: () => TaskTypeSchema,
  TextEmbeddingGeckoConfigSchema: () => TextEmbeddingGeckoConfigSchema,
  textEmbeddingGecko001: () => textEmbeddingGecko001,
  textEmbeddingGeckoEmbedder: () => textEmbeddingGeckoEmbedder
});
module.exports = __toCommonJS(embedder_exports);
var import_embedder = require("@genkit-ai/ai/embedder");
var import_generative_ai = require("@google/generative-ai");
var import_zod = require("zod");
const TaskTypeSchema = import_zod.z.enum([
  "RETRIEVAL_DOCUMENT",
  "RETRIEVAL_QUERY",
  "SEMANTIC_SIMILARITY",
  "CLASSIFICATION",
  "CLUSTERING"
]);
const TextEmbeddingGeckoConfigSchema = import_zod.z.object({
  /**
   * The `task_type` parameter is defined as the intended downstream application to help the model
   * produce better quality embeddings.
   **/
  taskType: TaskTypeSchema.optional(),
  title: (0, import_zod.string)().optional()
});
const textEmbeddingGecko001 = (0, import_embedder.embedderRef)({
  name: "googleai/embedding-001",
  configSchema: TextEmbeddingGeckoConfigSchema,
  info: {
    dimensions: 768,
    label: "Google Gen AI - Text Embedding Gecko (Legacy)",
    supports: {
      input: ["text"]
    }
  }
});
const SUPPORTED_MODELS = {
  "embedding-001": textEmbeddingGecko001
};
function textEmbeddingGeckoEmbedder(name, options) {
  let apiKey = (options == null ? void 0 : options.apiKey) || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey)
    throw new Error(
      "Please pass in the API key or set either GOOGLE_GENAI_API_KEY or GOOGLE_API_KEY environment variable.\nFor more details see https://firebase.google.com/docs/genkit/plugins/google-genai"
    );
  const client = new import_generative_ai.GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: name
  });
  const embedder = SUPPORTED_MODELS[name];
  return (0, import_embedder.defineEmbedder)(
    {
      name: embedder.name,
      configSchema: TextEmbeddingGeckoConfigSchema,
      info: embedder.info
    },
    (input, options2) => __async(this, null, function* () {
      const embeddings = yield Promise.all(
        input.map((doc) => __async(this, null, function* () {
          const response = yield client.embedContent({
            taskType: options2 == null ? void 0 : options2.taskType,
            title: options2 == null ? void 0 : options2.title,
            content: {
              role: "",
              parts: [{ text: doc.text() }]
            }
          });
          const values = response.embedding.values;
          return { embedding: values };
        }))
      );
      return { embeddings };
    })
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SUPPORTED_MODELS,
  TaskTypeSchema,
  TextEmbeddingGeckoConfigSchema,
  textEmbeddingGecko001,
  textEmbeddingGeckoEmbedder
});
//# sourceMappingURL=embedder.js.map
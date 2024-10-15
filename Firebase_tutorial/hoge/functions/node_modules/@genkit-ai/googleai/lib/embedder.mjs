import {
  __async
} from "./chunk-WFI2LP4G.mjs";
import { defineEmbedder, embedderRef } from "@genkit-ai/ai/embedder";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { string, z } from "zod";
const TaskTypeSchema = z.enum([
  "RETRIEVAL_DOCUMENT",
  "RETRIEVAL_QUERY",
  "SEMANTIC_SIMILARITY",
  "CLASSIFICATION",
  "CLUSTERING"
]);
const TextEmbeddingGeckoConfigSchema = z.object({
  /**
   * The `task_type` parameter is defined as the intended downstream application to help the model
   * produce better quality embeddings.
   **/
  taskType: TaskTypeSchema.optional(),
  title: string().optional()
});
const textEmbeddingGecko001 = embedderRef({
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
  const client = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: name
  });
  const embedder = SUPPORTED_MODELS[name];
  return defineEmbedder(
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
export {
  SUPPORTED_MODELS,
  TaskTypeSchema,
  TextEmbeddingGeckoConfigSchema,
  textEmbeddingGecko001,
  textEmbeddingGeckoEmbedder
};
//# sourceMappingURL=embedder.mjs.map
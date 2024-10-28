/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/// functions/src/index.ts

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

// GPTに渡すテンプレート
const promptTemplate = `
あなたは優秀なアシスタントです。
以下のコンテキストを参考に、質問に答えてください。

--------
# context
{context}
--------

質問文: {input}
`;


export const helloWorld = onRequest(
  {
    region: 'asia-northeast1',
    secrets: ['OPENAI_API_KEY', 'SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET'],  },
  async (_request, response) => {
    // OpenAIのAPIキーを環境変数から取得
    const API_Key = process.env.OPENAI_API_KEY;


    // APIキーが取得できなかった場合はエラーを返す
    // エラーハンドリング
    if (!API_Key) {
    response.status(500).send('APIキーが取得できませんでした。');
    return;
    }
    
    // OpenAIのChat APIを使ったLLMを生成
    const llm = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0.5,
      apiKey:API_Key,
    });
    

    // テンプレートからPromptを生成
    const prompt = ChatPromptTemplate.fromTemplate(promptTemplate);


    // PromptとLLMをパイプラインでつないで
    const chain = prompt.pipe(llm);

    // 質問に対する回答を取得
    const answer = await chain.invoke({
      context: '',
      input: 'お腹が空きました。お昼ご飯のオススメを教えてください。',
    });

    logger.info(answer, { structuredData: true });
    response.send(answer.content);
  },
);
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

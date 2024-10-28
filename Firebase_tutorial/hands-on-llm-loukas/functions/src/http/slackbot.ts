/// functions/src/slackbot.ts

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { App, ExpressReceiver } from '@slack/bolt';
import { onRequest } from 'firebase-functions/v2/https';

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

/**
 * Slackイベントハンドラを作成する
 * @param signingSecret Slackからのリクエストを検証するための署名シークレット
 * @param token Slackアプリのトークン
 * @returns ExpressReceiverのインスタンス
 */
const createReceiver = (signingSecret: string, token: string) => {

    //  SlackとAIのつなぎ役を作る
    const receiver = new ExpressReceiver({
        signingSecret,
        endpoints: '/events',
        processBeforeResponse: true,
    });
    const app = new App({
        receiver,
        token,
        processBeforeResponse: true,
    });

  /**
   * メンションイベントをリッスンする
   * @param event app_mention イベント
   * @param context コンテキスト
   * @param client Slack WebClient
   * @param say メッセージ送信関数
   */
  app.event('app_mention', async ({ event, context, client, say }) => {
    const { bot_id: botId, text, user, channel } = event;
    const { retryNum, retryReason } = context;
    const ts = event.thread_ts || event.ts;

    console.log(`app_mention: user=${user}, ts=${ts}`);

    // リトライの場合はスキップ
    if (retryNum) {
      console.log(`skipped: retryNum=${retryNum} ${retryReason}`);
      return;
    }

    // Botのメンションの場合はスキップ
    if (botId) {
      console.log(`skipped: botId=${botId}`);
      return;
    }

    // 考え中
    const botMessage = await say({
      thread_ts: ts,
      text: 'thinking...',
    });
    if (!botMessage.ts) return;

    // テンプレートからPromptを生成
    const prompt = ChatPromptTemplate.fromTemplate(promptTemplate);

    // OpenAIのChat APIを使ったLLMを生成
    const llm = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0.5,
    });

    // PromptとLLMをパイプラインでつないで
    const chain = prompt.pipe(llm);

    // 質問に対する回答を取得
    const answer = await chain.invoke({
      context: '',
      input: text,
    });

    await client.chat.update({
      channel,
      ts: botMessage.ts as string,
      text: answer.content as string,
    });
  });

  return receiver;
};

/**
 * Slackbotのエンドポイント
 */
// export const slackbot = onRequest(
//   {
//     region: 'asia-northeast1',
//     secrets: ['OPENAI_API_KEY', 'SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET'],
//   },
//   (req, res) => {
//     const signingSecret = process.env.SLACK_SIGNING_SECRET;
//     const token = process.env.SLACK_BOT_TOKEN;
//     return createReceiver(signingSecret!, token!).app(req, res);
//   },
// );

export const slackbot = onRequest(
    {
      region: 'asia-northeast1',
      secrets: ['OPENAI_API_KEY', 'SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET'],
    },
    (req, res) => {
      // Slackからのリクエストでchallengeパラメータがある場合、そのまま返す
      if (req.body && req.body.challenge) {
        res.send(req.body.challenge); // Slackの検証リクエストに応答
        return;
      }
  
      const signingSecret = process.env.SLACK_SIGNING_SECRET;
      console.log(`signingSecret: ${signingSecret}`);
      const token = process.env.SLACK_BOT_TOKEN;
  
      // createReceiver関数を使用してSlackのリクエストを処理
      return createReceiver(signingSecret!, token!).app(req, res);
    }
  );
  
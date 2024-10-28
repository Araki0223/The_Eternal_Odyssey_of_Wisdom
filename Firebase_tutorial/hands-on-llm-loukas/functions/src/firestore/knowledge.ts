/// functions/src/firestore/knowledge.ts

import { OpenAIEmbeddings } from '@langchain/openai';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

/**
 * knowledges/{id} が書き込まれたときに、content をベクトル化してドキュメントに付与する
 */
module.exports.onwriteknowledge = onDocumentWritten(
  { document: 'knowledges/{id}', secrets: ['OPENAI_API_KEY'] },
  async (event) => {
    console.log(`onDocumentWritten: knowledges/${event.params.id}`);
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    // データがない場合は何もしない
    if (!after) {
      return;
    }

    // before と after で content が等しければ何もしない
    if (before?.content === after.content) {
      return;
    }

    // OpenAI Embeddings API を使ってベクトル化
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const vector = await embeddings.embedQuery(after.content);

    // ベクトルデータをドキュメントに付与
    return event.data?.after.ref.update({
      vector: FieldValue.vector(vector),
      updatedAt: Timestamp.now(),
    });
  },
);
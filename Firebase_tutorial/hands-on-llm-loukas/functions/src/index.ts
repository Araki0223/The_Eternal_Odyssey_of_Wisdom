/// functions/src/index.ts

const { initializeApp } = require('firebase-admin/app');
const { setGlobalOptions } = require('firebase-functions/v2');

initializeApp();
setGlobalOptions({ timezone: 'Asia/Tokyo', region: 'asia-northeast1' });

export * from './firestore';
export * from './http';
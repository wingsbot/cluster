import path from 'node:path';

import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default {
  host: process.env.HTTP_HOST || 'localhost',
  port: Number(process.env.HTTP_PORT || 4000),
  APIVersion: process.env.API_VERSION || '10',
  botToken: process.env.BOT_TOKEN,
  applicationId: process.env.BOT_APPLICATION_ID,
  publicKey: process.env.BOT_PUBLIC_KEY,
  devServerId: process.env.DEVELOPMENT_SERVER_ID,
};
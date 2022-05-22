import path from 'path';

import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default {
  host: process.env.HTTP_HOST || 'localhost',
  port: Number(process.env.HTTP_PORT || 4000),
  publicKey: process.env.BOT_PUBLIC_KEY,
  devServerId: process.env.DEVELOPMENT_SERVER_ID,
};
import 'dotenv/config';

export default {
  host: process.env.HTTP_HOST || 'localhost',
  port: Number(process.env.HTTP_PORT || 4000),
  publicKey: process.env.PUBLIC_KEY,
  devServerId: process.env.DEV_SERVER_ID,
};
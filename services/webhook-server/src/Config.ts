import 'dotenv/config';

export default {
  host: process.env.TUNNEL_HOST || 'localhost',
  port: Number(process.env.TUNNEL_PORT || 3489),
}
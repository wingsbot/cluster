import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

import { handleInteraction, handleWebsocket } from './handlers';
import config from './Config';

const app = fastify({ logger: true });
app.register(fastifyWebsocket);

app.get('api/websocket', { websocket: true }, handleWebsocket);
app.post('api/interactions', {}, handleInteraction);

app.listen(config.port, config.host, (err, address) => {
  console.log(`Listening on port ${config.port}\nLink: ${address}`);
});

import * as express from 'express';
import * as path from 'path';

const staticServer = express();

const PUBLIC_PATH = path.resolve(
  process.cwd(),
  process.env.PUBLIC_PATH || './client/dist',
);

const indexFile = path.resolve(PUBLIC_PATH, 'index.html');

staticServer.use(express.static(PUBLIC_PATH));

staticServer.use((_, res) => res.sendFile(indexFile));

export { staticServer };

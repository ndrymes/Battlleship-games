import * as restify from 'restify';
import * as plugins from 'restify-plugins';
import { config } from './config/config';

const server = restify.createServer({
    name: config.app_name,
    versions: ['1.0.0'],
    port: config.port,
  });
  // set API versioning and allow trailing slashes
server.pre(restify.pre.sanitizePath());

// set request handling and parsing
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

server.listen(config.port, () => {
    console.log(`${config.app_name} listening at ${config.port}`);
  });
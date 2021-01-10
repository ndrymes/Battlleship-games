import * as restify from 'restify';
import * as plugins from 'restify-plugins';
import { config } from './config/config';

// service locator via dependency injection
const serviceLocator = require('./config/di');
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

// setup Routing and Error Event Handling
import { setup } from './routes/index';

setup(server, serviceLocator);
server.listen(config.port, () => {
  console.log(`${config.app_name} listening at ${config.port}`);
});
module.exports = server;

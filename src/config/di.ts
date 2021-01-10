import * as redis from 'async-redis';

import { constants } from '../constants/constatnts';
//Controllers
import { Board } from '../controllers/board';
import { Ship } from '../controllers/ship';
import { MainController } from '../controllers/index';

const serviceLocator = require('../lib/service_locator');
serviceLocator.register('client', () => {
  const client = redis.createClient();
  return client;
});

/**
 * Creates an instance of the constants
 *
 */
serviceLocator.register('constants', () => {
  return constants;
});

/**
 * Creates an instance of the boardControllers
 */
serviceLocator.register('boardControllers', (serviceLocator) => {
  const client:object = serviceLocator.get('client');
  const constants:object = serviceLocator.get('constants');
  return new Board(client, constants);
});

/**
 * Creates an instance of the shipControllers
 */
serviceLocator.register('shipControllers', (serviceLocator) => {
  const client:object = serviceLocator.get('client');
  const constants:object = serviceLocator.get('constants');
  return new Ship(client, constants);
});

/**
 * Creates an instance of the Main Controller
 */
serviceLocator.register('mainController', (serviceLocator) => {
  const boardControllers:object = serviceLocator.get('boardControllers');
  const shipControllers:object = serviceLocator.get('shipControllers');
  const constants:object = serviceLocator.get('constants');
  return new MainController(boardControllers, shipControllers, constants);
});
module.exports = serviceLocator;

import * as redis from 'async-redis';

//Controllers
import { Board } from '../controllers/board';
import { MainController } from '../controllers/index';

const serviceLocator = require('../lib/service_locator')
serviceLocator.register('client', () => {
    const client = redis.createClient();
    return client;
  });

  /**
 * Creates an instance of the Crash board Controllers
 */
  serviceLocator.register('boardControllers', (serviceLocator) => {
    const client = serviceLocator.get('client');
    return new Board(client);
  });

  /**
 * Creates an instance of the Main Controller
 */
  serviceLocator.register('mainController', (serviceLocator) => {
    const boardControllers = serviceLocator.get('boardControllers');
    return new MainController(boardControllers);
  });
  module.exports = serviceLocator;
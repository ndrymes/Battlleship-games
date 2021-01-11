import * as redis from 'async-redis';
import * as winston from 'winston'

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

serviceLocator.register('logger', () => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),

    defaultMeta: { service: 'taskworld-test' },
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/info.log', level: 'info' })

    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),

    }));
  }
  return logger;
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
  const logger:object = serviceLocator.get('logger');
  return new Board(client, constants,logger);
});

/**
 * Creates an instance of the shipControllers
 */
serviceLocator.register('shipControllers', (serviceLocator) => {
  const client:object = serviceLocator.get('client');
  const constants:object = serviceLocator.get('constants');
  const logger:object = serviceLocator.get('logger');
  return new Ship(client, constants,logger);
});

/**
 * Creates an instance of the Main Controller
 */
serviceLocator.register('mainController', (serviceLocator) => {
  const boardControllers:object = serviceLocator.get('boardControllers');
  const shipControllers:object = serviceLocator.get('shipControllers');
  const constants:object = serviceLocator.get('constants');
  const logger:object = serviceLocator.get('logger');
  return new MainController(boardControllers, shipControllers, constants,logger);
});
module.exports = serviceLocator;

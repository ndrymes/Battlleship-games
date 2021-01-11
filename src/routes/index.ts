import * as bodyParser from 'body-parser';

export const setup = (server, serviceLocator) => {
  const mainController = serviceLocator.get('mainController');

  // parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  server.use(bodyParser.json());

  server.get(
    {
      path: '/',
      name: 'app health check',
      version: '1.0.0',
    },
    (req, res) => res.send('Welcome to the Test API Service')
  );
  // create game sesssion
  server.post(
    {
      path: '/game/start',
      name: 'start game vehicle data',
      version: '1.0.0',
    },
    (req, res) => mainController.startGame(req, res)
  );

  // place individual ship
  server.post(
    {
      path: '/place/ship',
      name: 'place individual ship',
      version: '1.0.0',
    },
    (req, res) => mainController.placeShip(req, res)
  );
  //attack ship
  server.post(
    {
      path: '/ship/attack',
      name: 'attack ship',
      version: '1.0.0',
    },
    (req, res) => mainController.attackShip(req, res)
  );
  //get board details
  server.get(
    {
      path: '/board/details/:playerName',
      name: 'get board details',
      version: '1.0.0',
    },
    (req, res) => mainController.getBoardDetails(req, res)
  );
};

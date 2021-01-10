import { Responses } from '../lib/response';
import { Request, Response } from 'restify';
const HTTPStatus = require('../constants/http_status');
export class MainController {
  boardControllers: any;
  constants: any;
  shipControllers: any;
  /**
   * Class Constructor
   * @param logger - winston logger
   * @param boardControllers
   * @param  shipControllers;
   */
  constructor(boardControllers, shipControllers, constants) {
    this.boardControllers = boardControllers;
    this.constants = constants;
    this.shipControllers = shipControllers;
  }
//start a new game session
  async startGame(req: Request, res: Response) {
    const { playerName } = req.body;
    if (!playerName) {
      return this.handleBadRequest(res, 'player name or id is required');
    }
    try {
      const data = await this.boardControllers.addBoard(playerName);
      return this.handleOk(
        res,
        `new Game session is created for player ${playerName}`,
        data
      );
    } catch (error) {
      this.handleInternalServerError(res, error);
    }
  }

  async placeShip(req: Request, res: Response) {
    const { playerName, direction, shipType, row, column } = req.body;
    if (!playerName || !direction || !shipType || !row || !column) {
      return this.handleBadRequest(
        res,
        'player name,direction , type, row and column are required'
      );
    }
    if (!this.constants.DIRECTION.includes(direction)) {
      return this.handleBadRequest(
        res,
        'direction can only be VERTICAL or HORIZONTAL'
      );
    }
    //check if ships name is included in type
    if (
      ![
        this.constants.SHIPNAMES.BATTLESHIPS,
        this.constants.SHIPNAMES.CRUISERS,
        this.constants.SHIPNAMES.DESTROYERS,
        this.constants.SHIPNAMES.SUBMARINES,
      ].includes(shipType)
    ) {
      return this.handleBadRequest(
        res,
        'ship can only be battleShips,cruisers, destroyers and submarines'
      );
    }
    const originalShipSizes = {
      battleShips: 1,
      cruisers: 2,
      destroyers: 3,
      submarines: 4,
    };
    const shipLength: number = originalShipSizes[shipType];
    try {
      const data: string = await this.boardControllers.addShip({
        shipLength,
        direction,
        row,
        column,
        playerName,
      });
      return this.handleOk(res, 'ship placed succesfully', data);
    } catch (error) {
      console.log(error);

      return this.handleBadRequest(res, error.message);
    }
  }
  async attackShip(req: Request, res: Response) {
    const { playerName, row, column } = req.body;
    if (!playerName || !row || !column) {
      return this.handleBadRequest(
        res,
        'player name, row and column are required'
      );
    }
    try {
      const data: string = await this.shipControllers.attack({
        playerName,
        row,
        column,
      });

      return this.handleOk(res, 'move made succesfully', data);
    } catch (error) {
      return this.handleBadRequest(res, error.message);
    }
  }
  async getBoardDetails(req: Request, res: Response) {
    const playerName: string = req.params.playerName;
    try {
      const data: string = await this.boardControllers.getBoardDetails(
        playerName
      );

      return this.handleOk(res, 'move made succesfully', data);
    } catch (error) {
      return this.handleBadRequest(res, error.message);
    }
  }
  handleOk(res: Response, message: string, data: any) {
    //this.logger.info('vehicle data gotten successfully');
    const response = new Responses(HTTPStatus.OK, message, res, false, data);
    return response.res_message();
  }

  handleNoContent(res: Response, data) {
    //this.logger.info('There is no vehicle data ');
    const emptyResponse = new Responses(
      HTTPStatus.NO_CONTENT,
      'No content available',
      res,
      false,
      data
    );
    return emptyResponse.res_message();
  }

  handleInternalServerError(res: Response, err) {
    // this.logger.error('Error from getting vehicle data', err);
    const resp = new Responses(
      HTTPStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      res,
      true,
      []
    );
    return resp.res_message();
  }
  handleBadRequest(res: Response, message: string) {
    const resp = new Responses(HTTPStatus.BadRequest, message, res, true, null);
    return resp.res_message();
  }
}

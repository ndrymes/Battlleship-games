import { Responses } from '../lib/response';
import { Request, Response } from 'restify';
const HTTPStatus = require('../constants/http_status');
export class MainController {
  boardControllers: any;
  constants: any;
  /**
   * Class Constructor
   * @param logger - winston logger
   * @param boardControllers
   * @param crashRatingControllers
   */
  constructor(boardControllers,constants) {
    this.boardControllers = boardControllers;
    this.constants = constants
  }

  async startGame(req: Request, res: Response) {
    const { playerName } = req.body;
    if (!playerName) {
      return this.handleBadRequest(res, 'player name or id is required');
    }
    const data = await this.boardControllers.addBoard(playerName);
    return this.handleOk(
      res,
      `new Game session is created for player ${playerName}`,
      data
    );
  }

  async placeShip(req: Request, res: Response) {
    const { playerName, direction, shipLength, row, column } = req.body;
    if (!playerName || !direction || !shipLength || !row || !column) {
      return this.handleBadRequest(
        res,
        'player name,direction , length, row and column are required'
      );
    }
    if (!this.constants.DIRECTION.includes(direction)) {
      return this.handleBadRequest(
        res,
        'direction can only be VERTICAL or HORIZONTAL'
      );
    }
    try {
      const data = await this.boardControllers.addShip({
        shipLength,
        direction,
        row,
        column,
        playerName,
      });
      return this.handleOk(res, 'ship placed succesfully', data);
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

  // eslint-disable-next-line class-methods-use-this
  handleBadRequest(res: Response, message: string) {
    const resp = new Responses(HTTPStatus.BadRequest, message, res, true, null);
    return resp.res_message();
  }
}
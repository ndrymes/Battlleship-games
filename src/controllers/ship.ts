import { attackShip } from '../schema/attack';

export class Ship {
  client: any;
  constants: any;
  logger: any;
  /**
     * Class Constructor
     * @param logger - winston logger
     * @param constants
     * @param client
     */
  constructor(client, constants,logger) {
    this.client = client;
    this.constants = constants;
    this.logger = logger
  }
  async attack(reqBody: attackShip) {
    return new Promise<string>(async (resolve, reject) => {
      let { row, column, playerName }: attackShip = reqBody;
      try {
        //get current baord
        const data: string = await this.client.get(playerName);
        const board = JSON.parse(data);
        //check if the board is being attacked for the first time
        const checkAttack: string = await this.client.get(
          `${playerName}attack`
        );
        if (parseInt(checkAttack) === 0) {
          const ships: string[] = [
            this.constants.SHIPNAMES.BATTLESHIPS,
            this.constants.SHIPNAMES.CRUISERS,
            this.constants.SHIPNAMES.DESTROYERS,
            this.constants.SHIPNAMES.SUBMARINES,
          ];
          let flagArr: string[] = [];
          // checks if board contains all ships before it is attacked
          for (let row of board) {
            for (let column of row) {
              flagArr.push(column);
            }
          }
          //check if all ships has been placed on the board to be attacked
          const indexArray: number[] = ships.map((el) => {
            return flagArr.indexOf(el);
          });
          const flag: boolean = indexArray.indexOf(-1) === -1;

          if (!flag) {
            return resolve(
              'The defender needs to place all ships before you can attack'
            );
          }
        }
        //increament the number of time board has been attacked
        await this.client.incr(`${playerName}attack`);

        // check if board is not empty or has not been hit once
        if (board[row][column] !== '-' && board[row][column] !== 'x') {
          const storedshipdetails: string = await this.client.get(
            `${playerName}ship`
          );
          const shipStatus: object = JSON.parse(storedshipdetails);
          //get the ship that was hit
          const shipName: string = board[row][column];
          let lifeCount = shipStatus[shipName];
          //decreament the life count
          lifeCount = lifeCount - 1;
          shipStatus[shipName] = lifeCount;
          //signal that the field has been hit once
          board[row][column] = 'x';
          const currentBoard: string = JSON.stringify(board);
          //store the board as a session
          await this.client.set(playerName, currentBoard);
          const redisValue: string = JSON.stringify(shipStatus);
          await this.client.set(`${playerName}ship`, redisValue);
          //check status of the ship
          if (shipStatus[shipName] == 0) {
            const shipStatusArray: number[] = Object.values(shipStatus);
            const someIsNotZero: boolean = shipStatusArray.some(
              (item) => item !== 0
            );
            //all ships lives are zero, so it is a win
            if (!someIsNotZero) {
              const totalNumberofAttack: string = await this.client.get(
                `${playerName}attack`
              );
              const totalNumberofMiss: string = await this.client.get(
                `${playerName}miss`
              );
              resolve(
                `Win! You have completed the game in ${totalNumberofAttack} attacks  and ${totalNumberofMiss} missed shots`
              );
            }
            //all ships lives are not  zero, so you sank a ship
            resolve(`you just sank a ${shipName}`);
          }
          // ship was just hit
          resolve('Hit');
          //get player current session
        } else {
          await this.client.incr(`${playerName}miss`);
          resolve('Miss');
          //miss
        }
      } catch (error) {
        this.logger.error('Unable to attack ship', error);
        reject(error);
      }
    });
  }
}

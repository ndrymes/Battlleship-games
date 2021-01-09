import { attackShip } from '../schema/attack';

export class Ship {
  client: any;
  constants: any;
  constructor(client, constants) {
    this.client = client;
    this.constants = constants;
  }
  async attack(reqBody: attackShip) {
    let { row, column, playerName } = reqBody;

    const data: string = await this.client.get(playerName);
    // reply is null when the key is missing

    const board = JSON.parse(data);
    if (board[row][column] !== '-' && board[row][column] !== 'x') {
      const storedshipdetails: string = await this.client.get(
        `${playerName}ship`
      );
      const shipStatus = JSON.parse(storedshipdetails);

      console.log({ shipStatus });

      const shipName: string = board[row][column];
      let lifeCount = shipStatus[shipName];
      lifeCount = lifeCount - 1;
      console.log({ lifeCount, shipName });
      shipStatus[shipName] = lifeCount;
      if (shipStatus[shipName] == 0) {
        console.log('SINK');
      }
      board[row][column] = 'x';
      const currentBoard = JSON.stringify(board);
      await this.client.set(playerName, currentBoard);
      const redisValue = JSON.stringify(shipStatus);
      await this.client.set(`${playerName}ship`, redisValue);
      //get player current session
    } else {
      console.log('MISS');
      //miss
    }
  }
}

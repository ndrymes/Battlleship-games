import { IaddShip } from '../schema/addShip';
export class Board {
  client: any;
  constants: any;
  constructor(client, constants) {
    this.client = client;
    this.constants = constants;
  }
  async addBoard(playerName: string) {
    let board = [];
    //create a 10X10 row and columns board for new game
    for (let row: number = 0; row < 10; row++) {
      board[row] = [];
      for (let column = 0; column < 10; column++) {
        board[row][column] = '-';
      }
    }
    //store new game session for a particular player using an Id(in this case just names)
    const redisValue: string = JSON.stringify(board);
    await this.client.set(playerName, redisValue);
  }
  
  async addShip(reqBody: IaddShip) {
    let { row, column, direction, shipLength, playerName } = reqBody;
    //assign ship names
    let shipName: string = '';
    switch (shipLength) {
      case 1:
        shipName = 'battleShips';
        break;
      case 2:
        shipName = 'cruisers';
        break;
      case 3:
        shipName = 'destroyers';
        break;
      case 4:
        shipName = 'submarines';
    }
    //get player current session
    const data: string = await this.client.get(playerName);
    // reply is null when the key is missing

    const board = JSON.parse(data);

    for (let index of board) {
      console.log(index.join(' '));
    }
    console.log({ shipName });
// check if a particular ship already on board
    for (let row of board) {
      for (let column of row) {
        console.log('colum', column);

        if (column === shipName) {
          throw new Error(
            'ship has already been placed, please use another ship'
          );
        }
      }
    }
    console.log('herr', board[row][column]);
//check if a ship is already  placed on the request space
    if (board[row][column] !== '-') {
      throw new Error('A ship is placed here already');
    }
    //check if ship has one square row below the request space
    if (board[row - 1][column] !== '-') {
      throw new Error('you have to go a row down to place a ship');
    }
    //check if a ship  has one square row above the request space
    if (board[row + 1][column] !== '-') {
      throw new Error('you have to go a row up to place a ship');
    }
     //check if a has one square  row to the right of the request space
    if (board[row][column - 1] !== '-') {
      throw new Error(
        'you have to go  column up to the right to place a ship'
      );
    }
    //check if a has one square  row to the left of the request space
    if (board[row][column + 1] !== '-') {
      throw new Error('you have to go a column up to the left to place a ship');
    }
   // fill ship space on the board
    for (let index = 0; index < shipLength; index++) {
      // console.log({checkSpace});

      if (direction === this.constants.DIRECTION[0]) {
        console.log('red', row);

        console.log('man', board[row][column]);
        //   console.log('reo' , row+checkSpace);
        if (board[row][column] !== '-') {
          throw new Error('A ship is placed here already');
        }
        if (board[row + 1][column] !== '-') {
          throw new Error('You need to move up one row to place your ship');
        }
        board[row][column] = shipName;
        row += 1;
      }
      else {
        console.log('red', row);

        console.log('man', board[row][column]);
        //   console.log('reo' , row+checkSpace);
        if (board[row][column] !== '-') {
          throw new Error('A ship is placed here already');
        }
        if (board[row][column + 1] !== '-') {
          throw new Error(
            'You need to move to the left by one colum to place your ship'
          );
        }
        // checkSpace++
        board[row][column] = shipName;
        column += 1;
      }

      //column += 1;
    }
    //store session
    const redisValue = JSON.stringify(board);
    await this.client.set(playerName, redisValue);
  }
}

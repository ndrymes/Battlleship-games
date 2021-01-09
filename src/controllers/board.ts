
export class Board {
  client: any;
  constructor(client) {
    this.client = client;
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
  
}

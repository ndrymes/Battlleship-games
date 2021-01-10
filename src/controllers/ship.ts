import { attackShip } from '../schema/attack';

export class Ship {
  client: any;
  constants: any;
  constructor(client, constants) {
    this.client = client;
    this.constants = constants;
  }
  async attack(reqBody: attackShip) {
    return new Promise<string>(async (resolve, reject) => {
      let { row, column, playerName } = reqBody;
      try {
        const data: string = await this.client.get(playerName);
        const board = JSON.parse(data);
        const checkAttack: string = await this.client.get(
          `${playerName}attack`
        );
        console.log({ checkAttack });

        if (parseInt(checkAttack) === 0) {
          const ships:string[] = [
            this.constants.SHIPNAMES.BATTLESHIPS,
            this.constants.SHIPNAMES.CRUISERS,
            this.constants.SHIPNAMES.DESTROYERS,
            this.constants.SHIPNAMES.SUBMARINES,
          ];
          let flagArr: string[] = [];
          const obj = {};
          for (let row of board) {
            for (let column of row) {
              flagArr.push(column);
            }
          }
          const indexArray:number[] = ships.map((el) => {
            return flagArr.indexOf(el);
          });
          const flag: boolean = indexArray.indexOf(-1) === -1;
          console.log({flagArr});
          
          console.log({flag});
          
          if (!flag) {
              return resolve('The defender needs to place all ships before you can attack')
          }
        }
        await this.client.incr(`${playerName}attack`);
        // reply is null when the key is missing

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

          board[row][column] = 'x';
          const currentBoard: string = JSON.stringify(board);
          await this.client.set(playerName, currentBoard);
          const redisValue: string = JSON.stringify(shipStatus);
          await this.client.set(`${playerName}ship`, redisValue);
          if (shipStatus[shipName] == 0) {
            console.log('SINK');
            const shipStatusArray: number[] = Object.values(shipStatus);
            console.log({ shipStatusArray });

            const someIsNotZero: boolean = shipStatusArray.some(
              (item) => item !== 0
            );
            if (!someIsNotZero) {
              const totalNumberofAttack: string = await this.client.get(
                `${playerName}attack`
              );
              const totalNumberofMiss: string = await this.client.get(
                `${playerName}miss`
              );
              resolve(
                `Win! You have completed the game in ${totalNumberofAttack} and ${totalNumberofMiss} missed shots`
              );
            }
            resolve(`you just sank a ${shipName}`);
          }
          resolve('Hit');
          //get player current session
        } else {
          await this.client.incr(`${playerName}miss`);
          resolve('Miss');
          //miss
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

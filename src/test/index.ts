let { expect, assert } = require('chai');
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

const server = require('../app');

const app = server;
const playerName: string = 'Sunmonu-Oluwole';
const testDefender: string = 'taskWorld';
chai.use(chaiHttp);

describe('Board controller', async () => {
  it('should throw an error if player name is not provided', async () => {
    const res = await chai.request(app).post('/game/start').send({});
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('player name or id is required');
  });

  it('should start a new game session', async () => {
    const res = await chai.request(app).post('/game/start').send({
      playerName: playerName,
    });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `new Game session is created for player ${playerName}`
    );
  });

  it('should throw an error if required field are not provided', async () => {
    const res = await chai.request(app).post('/place/ship').send({});
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(
      'player name,direction , type, row and column are required'
    );
  });

  it('should throw an error if direction is not vertical or horizontal', async () => {
    const res = await chai.request(app).post('/place/ship').send({
      playerName,
      direction: 'DIAGONAL',
      shipType: 'submarines',
      row: 4,
      column: 6,
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(
      'direction can only be VERTICAL or HORIZONTAL'
    );
  });

  it('should throw an error if wrong ship type was provided', async () => {
    const res = await chai.request(app).post('/place/ship').send({
      playerName,
      direction: 'VERTICAL',
      shipType: 'boat',
      row: 4,
      column: 6,
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(
      'ship can only be battleShips,cruisers, destroyers and submarines'
    );
  });

  it('should place ship sucessfully', async () => {
    const res = await chai.request(app).post('/place/ship').send({
      playerName,
      direction: 'VERTICAL',
      shipType: 'cruisers',
      row: 4,
      column: 6,
    });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('ship placed succesfully');
  });

  it('it show throw an error if ship if you try to place the same ship twice', async () => {
    const res = await chai.request(app).post('/place/ship').send({
      playerName,
      direction: 'VERTICAL',
      shipType: 'cruisers',
      row: 4,
      column: 6,
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(
      'This ship has already been placed, please use another ship'
    );
  });
  it('it show throw an error if  a ship is already placed on targeted coordinates', async () => {
    const res = await chai.request(app).post('/place/ship').send({
      playerName,
      direction: 'VERTICAL',
      shipType: 'submarines',
      row: 4,
      column: 6,
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('A ship is placed here already');
  });

  it('should throw an error if ship if space is not left before placing ship', async () => {
    const res = await chai.request(app).post('/place/ship').send({
      playerName,
      direction: 'VERTICAL',
      shipType: 'submarines',
      row: 4,
      column: 7,
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(
      'you have to go  column up to the right to place a ship'
    );
  });
  it('should throw an error if ship if one space row is not left before placing ship', async () => {
    const res = await chai.request(app).post('/place/ship').send({
      playerName,
      direction: 'VERTICAL',
      shipType: 'submarines',
      row: 3,
      column: 6,
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(
      'you have to go a row up to place a ship'
    );
  });
});
describe('Test full game session', () => {
  describe('start a new game session', () => {
    it('should start a new game session', async () => {
      const res = await chai.request(app).post('/game/start').send({
        playerName: testDefender,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(
        `new Game session is created for player ${testDefender}`
      );
    });
  });
  describe('place all ships', () => {
    it('should place ship sucessfully', async () => {
      const res = await chai.request(app).post('/place/ship').send({
        playerName: testDefender,
        direction: 'VERTICAL',
        shipType: 'battleShips',
        row: 2,
        column: 2,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('ship placed succesfully');
    });
    it('should place ship sucessfully', async () => {
      const res = await chai.request(app).post('/place/ship').send({
        playerName: testDefender,
        direction: 'HORIZONTAL',
        shipType: 'cruisers',
        row: 5,
        column: 2,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('ship placed succesfully');
    });

    it('should place ship sucessfully', async () => {
      const res = await chai.request(app).post('/place/ship').send({
        playerName: testDefender,
        direction: 'HORIZONTAL',
        shipType: 'submarines',
        row: 2,
        column: 5,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('ship placed succesfully');
    });
    it('should place ship sucessfully', async () => {
      const res = await chai.request(app).post('/place/ship').send({
        playerName: testDefender,
        direction: 'VERTICAL',
        shipType: 'destroyers',
        row: 5,
        column: 5,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('ship placed succesfully');
    });
  });

  describe('attack ships', () => {
    it('should throw an error if required details are not provided', async () => {
      const res = await chai.request(app).post('/ship/attack').send({});
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        'player name, row and column are required'
      );
    });
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 1,
        column: 1,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('Miss');
    });
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 3,
        column: 3,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('Miss');
    });
    describe('attack battleships', async () => {
      it('should attack cordinates', async () => {
        const res = await chai.request(app).post('/ship/attack').send({
          playerName: testDefender,
          row: 2,
          column: 2,
        });
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('move made succesfully');
        expect(res.body.data).to.equal('you just sank a battleShips');
      });
    });
  });
  describe('attack cruisers', () => {
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 5,
        column: 2,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('Hit');
    });
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 5,
        column: 3,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('you just sank a cruisers');
    });
  });

  describe('attack destroyers', () => {
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 5,
        column: 5,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('Hit');
    });
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 6,
        column: 5,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('Hit');
    });
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 7,
        column: 5,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('you just sank a destroyers');
    });
  });

  describe('attack submarines', () => {
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 2,
        column: 5,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('Hit');
    });
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 2,
        column: 6,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('Hit');
    });
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 2,
        column: 7,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal('Hit');
    });
    it('should attack cordinates', async () => {
      const res = await chai.request(app).post('/ship/attack').send({
        playerName: testDefender,
        row: 2,
        column: 8,
      });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('move made succesfully');
      expect(res.body.data).to.equal(
        'Win! You have completed the game in 12 attacks  and 2 missed shots'
      );
    });
  });
});

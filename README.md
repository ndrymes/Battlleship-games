# BATTLESHIP_GAME
This apps helps is a game of battleship
There are two players: the defender and the attacker 
The attacker keeps attacking the defenders board until they get all their ships, for more information you can check  https://en.wikipedia.org/wiki/Battleship_(game)
```
Node
typescript
Libaries : prettier, mocha, axios redis
```
**Install all dependencies**
```
- Download or clone
- Open terminal inside the root directory of clone folder
- npm install
```

**Start the application**
```
npm run build
npm run start
```
**Run all tests**
```
npm run test
```

**Run development enviroment**
```
npm run dev
```
**Run linting**
```
npm run prettier:write
```
1) The first endpoint is POST method-
**Endpoint**
``
/game/start
``

#with a sample payload#
``
{
    "playerName":"walex"
}
``

Response format
application/json
#sample response#
{
    "error": false,
    "errorCode": 200,
    "message": "new Game session is created for player walex"
}

2) The second endpoint is POST method-
**Endpoint**
``
/place/ship
``
-place individual ships on board
#with a sample payload#
{
    "playerName":"walex",
    "direction":"VERTICAL",
    "shipType":"submarines",
    "row":2,
    "column":6
}
Response format
  
application/json
#sample response#
{
    "error": false,
    "code": 200,
    "message": "ship placed succesfully"
}

3) Third  endpoint gets the details of the board and individual ships
**Endpoint**
``
/board/details/:playerName
``
- Gets board details data with
``
     - submarines
     - battleships
     - cruisers
     -destroyers
``

response format
application/json

4) The fourth endpoint is POST method-
**Endpoint**
``
/ship/attack
``
-attack differents cordinates on board until individual all ships  are down
#with a sample payload#
{
    "playerName":"walex",
    "row":2,
    "column":6
}
Response format
  
application/json
#sample response#
{
    "error": false,
    "code": 200,
    "message": "move made succesfully",
    "data": "Hit"
}

#-------------------------------Environment variables--------------------------------------------------

 Just as provided in sample.env

``
PORT=''
``

where PORT
##  AUTHOR
Oluwole
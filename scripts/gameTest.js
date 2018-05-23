const Game = require('./classes/Game');

game = new Game(3,false);
game.userIsDone(3);
game.userIsDone(4);
//console.log(game);

console.log(Game.prototype.initGameExists());
// newGame = Game.prototype.initGame(3);
// console.log(newGame);
//console.log(Game.prototype.initGameExists());
if (Game.prototype.initGameExists()) {
    let initgame = new Game(Game.prototype.getInitGameId(),false);
    console.log(initgame);
    initgame.userB = 4;
    initgame.gameSession = initgame.initGameSession();
    console.log(initgame);
    initgame.save();
}
console.log(Game.prototype.initGameExists());

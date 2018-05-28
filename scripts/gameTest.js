const Game = require('./classes/Game');

game = new Game(1,false);
console.log(game.gameSession);
console.log(game.gameSession.getQuestionIds());
game.gameSession.questionA = game.gameSession.getNextQuestion('a');
game.gameSession.questionA = game.gameSession.getNextQuestion('a');
game.gameSession.questionA = game.gameSession.getNextQuestion('a');
game.gameSession.questionA = game.gameSession.getNextQuestion('a');
game.gameSession.questionA = game.gameSession.getNextQuestion('a');
game.gameSession.questionA = game.gameSession.getNextQuestion('a');
game.gameSession.questionA = game.gameSession.getNextQuestion('a');
console.log(game.gameSession.questionA.id);
if (game.gameSession.getNextQuestion('a') === null) {
    game.userIsDone(game.userA.id);
}
console.log(game);

//console.log(Game.prototype.initGameExists());
// newGame = Game.prototype.initGame(3);
// console.log(newGame);
//console.log(Game.prototype.initGameExists());
// if (Game.prototype.initGameExists()) {
//     let initgame = new Game(Game.prototype.getInitGameId(),false);
//     console.log(initgame);
//     initgame.userB = 4;
//     initgame.gameSession = initgame.initGameSession();
//     console.log(initgame);
//     initgame.save();
// }
// console.log(Game.prototype.initGameExists());

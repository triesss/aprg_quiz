const Game = require('./classes/Game');
const UserStatistic = require('./classes/UserStatistic');

game = new Game(1,false);
console.log(game.gameSession);
console.log(game.gameSession.getQuestionIds());
while (game.gameSession.getNextQuestion('a') !== null) {
    let i = Math.floor((Math.random() * 4));
    //console.log(i);
    console.log(game.gameSession.questionA.id);
    if (game.gameSession.questionA.answers[i].isTrue){
        game.gameSession.addPoint('a');
    }
    game.gameSession.questionA = game.gameSession.getNextQuestion('a');
}

if (Object.keys(game.gameSession.questionA).length === 0) {
    game.userIsDone(game.userA.id);
    let usa = new UserStatistic(game.userA.id);
    let usb = new UserStatistic(game.userB.id);
    switch (game.gameSession.determineResult()) {
        case 0:
            usa.addLose();
            usb.addWin();
            break;
        case 1:
            usb.addDraw();
            usa.addDraw();
            break;
        case 2:
            usb.addLose();
            usa.addWin();
            break;
    }
    console.log(usb);
    console.log(usa);
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

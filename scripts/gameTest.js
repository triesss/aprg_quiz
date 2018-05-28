const Game = require('./classes/Game');
const UserStatistic = require('./classes/UserStatistic');

game = new Game(1,false);
console.log(game.gameSession.getQuestionIds());

//UserA beantwortet seine Fragen und gibt random (i) Antworten
while (game.gameSession.getNextQuestion(game.userA.id) !== null) {
    let i = Math.floor((Math.random() * 4));
    console.log(game.gameSession.questionA.id);
    if (game.gameSession.questionA.answers[i].isTrue){
        game.gameSession.addPoint(game.userA.id);
    }
    game.gameSession.questionA = game.gameSession.getNextQuestion(game.userA.id);
    game.gameSession.save(game.userA.id);
}
console.log("UserA hat alle Fragen beantwortet");
//UserB beantwortet seine Fragen und gibt random (i) Antworten
while (game.gameSession.getNextQuestion(game.userB.id) !== null) {
    let i = Math.floor((Math.random() * 4));
    console.log(game.gameSession.questionB.id);
    if (game.gameSession.questionB.answers[i].isTrue){
        game.gameSession.addPoint(game.userB.id);
    }
    game.gameSession.questionB = game.gameSession.getNextQuestion(game.userB.id);
    game.gameSession.save(game.userB.id);
}
console.log("UserB hat alle Fragen beantwortet");
let usa = new UserStatistic(game.userA.id);
let usb = new UserStatistic(game.userB.id);
//Wenn beide Spieler alle Fragen beantwortet haben
if (Object.keys(game.gameSession.questionA).length === 0 && Object.keys(game.gameSession.questionB).length === 0) {
    game.userIsDone(game.userA.id);
    game.userIsDone(game.userB.id);
    game.save();
    if (game.userADone && game.userBDone) {
        game.gameSession.endSession();
        game.gameSession.save();
    }
    //ermittelt, welcher Spieler die meisten Fragen korrekt beantwortet hat
    switch (game.gameSession.determineResult()) {
        case 0:
        console.log("UserA hat verloren!");        
            usa.addLose();
            usb.addWin();
            break;
        case 1:
            console.log("Unentschieden!");
            usb.addDraw();
            usa.addDraw();
            break;
        case 2:
            console.log("UserA hat gewonnen!");
            usb.addLose();
            usa.addWin();
            break;
    }
    usb.save();
    usa.save();
}
//console.log(game);
console.log(usb);
console.log(usa);
console.log("Punkte UserA:"+UserStatistic.prototype.calcPoints(game.userA.id));
console.log("Punkte UserB:"+UserStatistic.prototype.calcPoints(game.userB.id));

console.log(Game.prototype.getGameIdOfUser(game.userA.id));
console.log(Game.prototype.getGameIdOfUser(6));
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

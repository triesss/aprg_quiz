const GameSession = require('./classes/GameSession');

let gs = new GameSession(1);
console.log(gs);

console.log(gs.getQuestionIds());

//gs.generateSeed();
console.log(gs.seed);
console.log(gs.getQuestionIds());

gs.addPoint('a');
gs.addPoint('b');

// console.log(gs.getCurrentQuestion('a'));
// gs.questionA = gs.getNextQuestion('a');
// console.log(gs.getCurrentQuestion('a'));
// console.log(gs);
// gs.save('a');



gs2 = new GameSession(1,4);
console.log(gs2);
console.log(gs2.getQuestionIds());
gs2.save();
console.log(gs2.id);

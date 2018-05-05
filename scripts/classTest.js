const Question = require('./classes/Question');
const GameSession = require('./classes/GameSession');

let quest = new Question(1,true);
console.log(quest.question);
quest.answers.forEach(element => {
    console.log(element.answer + " " + (element.isTrue() === 1?"Wahr":"Falsch"));
});
//console.log(quest.answers);

console.log(Question.prototype.count());
let session = new GameSession(1);

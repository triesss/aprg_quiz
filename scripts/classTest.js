<<<<<<< HEAD
const Question = require('./classes/Question');

let quest = new Question(3);
let question = quest.question;
console.log(question);
let answers = quest.getAnswers();
answers.forEach(element => {
    console.log(element.answer + " " + (element.isTrue() === 1?"Wahr":"Falsch"));    
});

=======
var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
const Question = require('./classes/Question');
const Answer = require('./classes/Answer');
const GameSession = require('./classes/GameSession');

let quest = new Question(1,true);
// console.log(quest.question);
// quest.answers.forEach(element => {
//     console.log(element.answer + " " + (element.isTrue() === 1?"Wahr":"Falsch"));
// });
//console.log(quest.answers);


let session = new GameSession(1);
// console.log("AnzFr: "+Question.prototype.count());
// let q2 = new Question("Wie viele Einwohner hat Frankreich?");
// console.log(q2.question);
// q2.save();
// console.log(q2.id);
// console.log("AnzFr: "+Question.prototype.count());


let q3 = new Question(7);
let a = [];
a.push(new Answer("Etwa 67 Mio.",true,q3.id));
a.push(new Answer("Etwa 70 Mio.",false,q3.id));
a.push(new Answer("Etwa 62 Mio.",false,q3.id));
a.push(new Answer("Etwa 75 Mio.",false,q3.id));

// console.log(a);
// a.forEach(element => {
//     element.save();
// });
console.log(a);
>>>>>>> 89ad92e029307c37613f940fca141a219f11fec4

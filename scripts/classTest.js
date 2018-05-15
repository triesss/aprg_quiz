
var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
const Question = require('./classes/Question');
const Answer = require('./classes/Answer');
const GameSession = require('./classes/GameSession');
const User = require('./classes/User');

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
// User aus Tabelle auslesen und bearbeiten
let user = new User(1);
console.log(user);
user.password = "hallo";
user.image = "hund.png";
user.comment = "Ich bin der Boss";
user.save();
console.log(user);
console.log(User.prototype.correctPassword("superadmin","hallo"));
console.log(User.prototype.correctPassword("superadmin","lalala"));
// neuen User erstellen und in Datenbank speichern
let user1 = new User("neuer@user.net","newuser123","hallo123",null,30,"Hallo ich bin neu");
console.log(user1);
//user1.save();
//console.log(user1);
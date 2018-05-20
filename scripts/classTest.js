
var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
const Question = require('./classes/Question');
const Answer = require('./classes/Answer');
const GameSession = require('./classes/GameSession');
const User = require('./classes/User');
const UserStatistic = require('./classes/UserStatistic');

let quest = new Question(1,true);
// console.log(quest.question);
// quest.answers.forEach(element => {
//     console.log(element.answer + " " + (element.isTrue() === 1?"Wahr":"Falsch"));
// });
//console.log(quest.answers);


let session = new GameSession(1);
console.log(session);
// console.log("AnzFr: "+Question.prototype.count());
// let q2 = new Question("Wie viele Einwohner hat Frankreich?");
// console.log(q2.question);
// q2.save();
// console.log(q2.id);
// console.log("AnzFr: "+Question.prototype.count());



// let q3 = new Question(7);
// let a = [];
// a.push(new Answer("Etwa 67 Mio.",true,q3.id));
// a.push(new Answer("Etwa 70 Mio.",false,q3.id));
// a.push(new Answer("Etwa 62 Mio.",false,q3.id));
// a.push(new Answer("Etwa 75 Mio.",false,q3.id));
//
// // console.log(a);
// // a.forEach(element => {
// //     element.save();
// // });
// console.log(a);
// // User aus Tabelle auslesen und bearbeiten
// let user = new User(1);
// console.log(user);
// user.password = "hallo123";
// user.image = "hund.png";
// user.comment = "Ich";
// user.save();
// console.log(user);
// console.log("correctPassword:"+User.prototype.correctPassword("superadmin","hallo"));
// console.log("correctPassword:"+User.prototype.correctPassword("superadmin","lalala"));
// console.log("usernameExists:"+User.prototype.usernameExists("super"));
// console.log("usernameExists:"+User.prototype.usernameExists("superadmin"));
// console.log("emailExists:"+User.prototype.emailExists("super@admin.de"));
// console.log("emailExists:"+User.prototype.emailExists("super@admin.com"));
// // neuen User erstellen und in Datenbank speichern
// let user1 = new User("neuer@user.net","newuser123","hallo123",null,30,"Hallo ich bin neu");
// console.log(user1);

let user2 = new User("peter@lustig.de","peterlustig","lustig",null,null,null);
console.log(user2);
//user2.save();
let user3 = new User(4);
console.log(user3);
console.log(User.prototype.idOfUsername("newuser123"));
console.log(User.prototype.idOfUsername("blabla"));
//user1.save();
//console.log(user1;



let us = new UserStatistic(1);
console.log(us);
us.addDraw();
us.addWin();
us.addLose();
console.log(us);
//us.save();
let us2 = new UserStatistic(4);
console.log(us2);
us2.addWin();
//us2.save();
console.log(us2);
console.log(UserStatistic.prototype.userStatisticExists(4));

console.log(UserStatistic.prototype.userStatisticExists(5));

us3 = new UserStatistic(3);
console.log(us3);
us3.addLose();
//us3.save();

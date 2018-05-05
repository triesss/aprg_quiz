const Question = require('./classes/Question');

let quest = new Question(1,true);
console.log(quest.question);
quest.answers.forEach(element => {
    console.log(element.answer + " " + (element.isTrue() === 1?"Wahr":"Falsch"));
});
//console.log(quest.answers);

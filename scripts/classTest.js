const Question = require('./classes/Question');

let quest = new Question(3);
let question = quest.question;
console.log(question);
let answers = quest.getAnswers();
answers.forEach(element => {
    console.log(element.answer + " " + (element.isTrue() === 1?"Wahr":"Falsch"));    
});


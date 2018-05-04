var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
const Question = require('./classes/Question');
var srand = require('srand');

var row = db.prepare('SELECT * FROM game_sessions WHERE id=1').get();
var seed = row.seed;
var row = db.prepare('SELECT count(*) as anz from questions').get();
var AnzFr = row.anz;

srand.seed(seed);
var Fragen = [];

for(var i = 0; i < AnzFr ; i++){
   do{
	var lock = 0;
	var id = parseInt((srand.random()*(AnzFr)) + 1);
	for(var j = 0; j < i;j++){
		if(Fragen[j] === id){
			lock = 1;
		}
	}
	}while(lock == 1);
	Fragen[i] = id;
}

console.log("Seed: " + seed + " Fragen: " + Fragen);
Fragen.forEach(function(element){
	let q = new Question(element);
	let question = q.question;
	console.log(question);
	let answers = q.getAnswers();
	answers.forEach(element =>{
		console.log(element.answer + " " + (element.isTrue() === 1?"Wahr":"Falsch"));    
	});
});

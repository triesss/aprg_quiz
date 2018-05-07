var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
const Question = require('./classes/Question');
const GameSession = require('./classes/GameSession');
var srand = require('srand');

let gs = new GameSession(1);
var AnzFr = Question.prototype.count();

srand.seed(gs.seed);
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

console.log("Seed: " + gs.seed + " Fragen: " + Fragen);
Fragen.forEach(function(element){
	let q = new Question(element,true);
    console.log("---------Frage "+q.id+"---------");
	console.log(q.question);
	q.answers.forEach(element =>{
		console.log(element.answer + " " + (element.isTrue() === 1?"Wahr":"Falsch"));
	});
});

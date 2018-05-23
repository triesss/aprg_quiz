var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
let srand = require('srand');
const User = require('./User');
const Question = require('./Question');

class GameSession {
	constructor(id) {
		if (typeof(id) === 'number' && arguments.length === 1) {
			this._id = id;
			let row = db.prepare(`select * from game_sessions where id = ${this._id}`).get();
			//console.log(row);
			this._seed = row.seed;
			this._userA = new User(row.ua_id);
			this._userB = new User(row.ub_id);
			this._questionA = new Question(row.ua_current_question,true);
			this._questionB = new Question(row.ub_current_question,true);
			this._pointsA = row.ua_points;
			this._pointsB = row.ub_points;
			this._done = row.done;
			this._new = false;
		} else if (User.prototype.idExists(arguments[0]) && User.prototype.idExists(arguments[1])) {
			this._new = true;
			this._seed = this.generateSeed();
			this._userA = new User(arguments[0]);
			this._userB = new User(arguments[1]);
			this._questionA = this.getNextQuestion();
			this._questionB = this.getNextQuestion();
			this._pointsA = 0;
			this._pointsB = 0;
			this._done = false;
		}
	}
	get id(){
		return this._id;
	}
	get seed(){
		return this._seed;
	}
	get questionA(){
		return this._questionA;
	}
	get questionB(){
		return this._questionB;
	}
	get done(){
		return this._done;
	}
	set questionA(question){
		this._questionA = question;
	}
	set questionB(question){
		this._questionB = question;
	}
	set seed(seed){
		this._seed = seed;
	}
	endSession(){
		if (!this._new) {
			let stmt = db.prepare('update game_sessions set done = 1 where id = (?)');
			stmt.run(this._id);
		}
	}
	getCurrentQuestion(user){
		return user === 'a' ? this._questionA : this._questionB;
	}
	generateSeed(){
		let uts = new Date();
		return Date.now();
	}
	addPoint(user){
		if (user === 'a') {
			this._pointsA++;
		}else if (user === 'b') {
			this._pointsB++;
		}
	}
	getNextQuestion(user){
		let nxtQst = null;
		let qArr = this.getQuestionIds();
		if (this._new) {
			return new Question(qArr[0],true);
		}
		let curQst = user === 'a' ? this._questionA.id : this._questionB.id;
		for (var i = 0; i < qArr.length; i++) {
			if (curQst === qArr[i] && i != qArr.length) {
				nxtQst = new Question(qArr[i+1],true);
			}
		}
		return nxtQst;
	}
	getQuestionIds(){
		var AnzFr = Question.prototype.count()<=10?Question.prototype.count():10;
		srand.seed(this._seed);
		let Fragen = [];
		let lock = 0;
		let id = 0;

		for(var i = 0; i < AnzFr ; i++){
		   do{
			lock = 0;
			id = parseInt((srand.random()*(AnzFr)) + 1);
			for(var j = 0; j < i;j++){
				if(Fragen[j] === id){
					lock = 1;
				}
			}
			}while(lock == 1);
			Fragen[i] = id;
		}
		return Fragen;
	}
	save(user){
		if (!this._new) {
			if (user === 'a') {
				let stmt = db.prepare(`update game_sessions set ua_current_question = (?),ua_points = (?) where id = ${this._id}`);
				stmt.run(this._questionA != null?this._questionA.id : -1,this._pointsA);
			}else if (user === 'b') {
				let stmt = db.prepare(`update game_sessions set ub_current_question = (?),ub_points = (?) where id = ${this._id}`);
				stmt.run(this._questionB != null?this._questionB.id : -1,this._pointsB);
			}
		}else if (this._new) {
			let stmt = db.prepare(`insert into game_sessions(seed,ua_id,ua_current_question,ub_id,ub_current_question) values (?,?,?,?,?)`);
			stmt.run(this._seed,this._userA.id,this._questionA.id,this._userB.id,this._questionB.id);
			this._id = db.prepare(`select id from game_sessions where seed = (?) and ua_id = (?) and ub_id = (?)`).get(this._seed,this._userA.id,this._userB.id).id;
		}
	}
}

module.exports = GameSession;

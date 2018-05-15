var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');

class GameSession {
	constructor(id) {
		this._id = id;
		let row = db.prepare(`select * from game_sessions where id = ${this._id}`).get();
		//console.log(row);
		this._seed = row.seed;
	}
	get id(){
		return this._id;
	}
	get seed(){
		return this._seed;
	}
}

module.exports = GameSession;

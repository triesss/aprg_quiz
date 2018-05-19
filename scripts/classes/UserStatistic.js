var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');

class UserStatistic {
	constructor(id) {
		if (typeof(id) === 'number') {
			this._uid = id;
			let row = db.prepare(`select * from user_statistics where uid = ${this._uid}`).get();
			console.log(row);
			if (typeof(row) === 'undefined') {
				this.setDefaults(id);
			}else {
				this._id = row.id;
				this._wins = row.wins;
				this._loses = row.loses;
				this._draws = row.draws;
				this._new = false;
			}
		}
	}
	get id(){
		return this._id;
	}
	get uid(){
		return this._uid;
	}
	get wins(){
		return this._wins;
	}
	get loses(){
		return this._loses;
	}
	get draws(){
		return this._draws;
	}
	set wins(wins){
		this._wins = wins;
	}
	set uid(uid){
		if (this._new) {
			this._uid = uid;
		}
	}
	set loses(loses){
		this._loses = loses;
	}
	set draws(draws){
		this._draws = draws;
	}
	addWin(){
		this._wins++;
	}
	addLose(){
		this.loses++;
	}
	addDraw(){
		this._draws++;
	}
	setDefaults(uid){
		this._uid = uid;
		this._wins = 0;
		this._loses = 0;
		this._draws = 0;
		this._new = true;
	}
	userStatisticExists(uid){
		return db.prepare(`select count(*) as anz from user_statistics where uid = ${uid}`).get().anz === 1?true:false;
	}
	save(){
		if (!this._new) {
			let stmt = db.prepare(`update user_statistics set wins = (?),loses = (?), draws = (?) where id = ${this._id}`);
			stmt.run(this._wins,this._loses,this._draws);
		}else if (this._new) {
			let stmt = db.prepare(`insert into user_statistics(uid,wins,loses,draws) values (?,?,?,?)`);
			stmt.run(this._uid,this._wins,this._loses,this._draws);
			this._id = db.prepare(`select id from user_statistics where uid = ${this._uid}`).get().id;
			this._new = false;
		}
	}
}

module.exports = UserStatistic;

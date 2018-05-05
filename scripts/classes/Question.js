var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
const Answer = require('./Answer');

class Question {

    constructor(id) {
        if (typeof(id)==='string') {
            //erstelle neue Frage
            this.question = id;
        } else if (typeof(id)==='number') {
            //hol Frage aus DB
            var row = db.prepare(`select * from questions where id = ${id}`).get();
            this._id = row.id;
            this._question = row.question;
			if (arguments.length === 2) {
				if (arguments[1] === true) {
					this._answers = this.getAnswers();
				}
			}
        }
    }
    get question(){
        return this._question;
    }
    get id(){
        return this._id;
    }
	get answers(){
		return this._answers;
	}
    getAnswers() {
        let answers = [];
        let ids = db.prepare(`select id from answers where qid = ${this._id}`).all();
        ids.forEach(element => {
            answers.push(new Answer(element.id));
        });
        return answers;
    }
}

module.exports = Question;

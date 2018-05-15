var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
const Answer = require('./Answer');

class Question {

    constructor(id) {
        if (typeof(id)==='string') {
            //erstelle neue Frage
            this._question = id;
            this._new = true;
        } else if (typeof(id)==='number') {
            //hol Frage aus DB
            var row = db.prepare(`select * from questions where id = ${id}`).get();
            this._new = false;
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
    save(){
        if (this._new === true) {
            let stmt = db.prepare('insert into questions (question) values (?)');
            stmt.run(this._question);
            this._id = db.prepare(`select id from questions where question = "${this._question}"`).get().id;
        }
    }
    getAnswers(){
        let answers = [];
        let ids = db.prepare(`select id from answers where qid = ${this._id}`).all();
        ids.forEach(element => {
            answers.push(new Answer(element.id));
        });
        return answers;
    }
	count(){
		var row = db.prepare('SELECT count(*) as anz from questions').get();
		return row.anz;
	}
}

module.exports = Question;

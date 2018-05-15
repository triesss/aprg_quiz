var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');

class Answer {
    constructor(id) {        
        let row = db.prepare(`select answer, is_true from answers where id = ${id}`).get();
        this._answer = row.answer;
        this._isTrue = row.is_true;
    }
    get answer(){
        return this._answer;
    }
    isTrue(){
        return this._isTrue;
    }
}

module.exports = Answer;
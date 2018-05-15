<<<<<<< HEAD
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
=======
var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');

class Answer {
    constructor(id) {
        if (typeof(id)==='number') {
            let row = db.prepare(`select answer, qid, is_true from answers where id = ${id}`).get();
            this._answer = row.answer;
            this._isTrue = row.is_true;
            this._qid = row.qid;
            this._new = false;
        } else if (typeof(id)==='string') {
            if (arguments[1] === true || arguments[1] === false) {
                this._isTrue = arguments[1];
                this._new = true;
                this._answer = id;
                this._qid = arguments[2];
            }
        }
    }
    get answer(){
        return this._answer;
    }
    isTrue(){
        return this._isTrue;
    }
    /**
     * Saves the new Answer to the data base.
     * Answer object needs to be initialised by following pattern:
     * new Answer(Answer:string,is_true:true|false,qid:number)
     */
    save(){
        if (this._new === true) {
            let stmt = db.prepare('insert into answers (answer,qid,is_true) values (?,?,?)');
            stmt.run(this._answer,this._qid,this._isTrue===true?1:0);
            this._id = db.prepare(`select id from answers where answer = "${this._answer}" and qid = ${this._qid}`).get().id;
        }
    }
}

module.exports = Answer;
>>>>>>> 89ad92e029307c37613f940fca141a219f11fec4

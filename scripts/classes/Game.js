var Database = require('better-sqlite3');
let db = new Database('../db/quiz.db');
const User = require('./User');
const GameSession = require('./GameSession');

class Game{
    constructor(){
        switch (arguments[1]) {
            case false:
                this._id = arguments[0];
                let row = db.prepare("select * from games where id = (?)").get(this._id);
                this._userA = new User(row.ua_id);
                this._userB = new User(row.ub_id);
                this._gameSession = new GameSession(row.gs_id);
                this._userADone = row.ua_done === 0?false:true;
                this._userBDone = row.ub_done === 0?false:true;
                this._new = false;
                break;
            case true:
                this._userA = new User(arguments[0]);
                this._new = true;
            break;
        }
    }
    get userA(){
        return this._userA;
    }
    get userB(){
        return this._userB;
    }
    get userADone(){
        return this._userADone;
    }
    get userBDone(){
        return this._userBDone;
    }
    set userB(user){
        console.log(user);
        if (User.prototype.idExists(user)) {
            this._userB = new User(user);
        }
    }
    get gameSession(){
        return this._gameSession;
    }
    set gameSession(gs){
        this._gameSession = new GameSession(gs);
    }
    initGameSession(){
        let gs = new GameSession(this._userA.id,this._userB.id);
    }
    initGame(user){
        let game = new Game(user,true);
        game.save();
        return game;
    }
    userIsDone(user){
        if (user === this._userA.id) {
            this._userADone = true;
        } else if (user === this._userB.id) {
            this._userBDone = true;
        }
    }
    getGameIdOfUser(uid){
        let get = db.prepare('select id from games where (ua_id = (?) AND ua_done = 0) OR (ub_id = (?) AND ub_done = 0) ').get(uid,uid);
        return typeof(get) === 'undefined' ? -1 : get.id;
    }
    initGameExists(){
        return db.prepare('select count(*) as anz from games where ub_id is null').get().anz === 1?true:false;
    }
    getInitGameId(){
        return db.prepare('select id from games where ub_id is null and gs_id is null').get().id;
    }
    save(){
        switch (this._new) {
            case true:
                let create = db.prepare('insert into games (ua_id) values (?)');
                create.run(this._userA.id);
                this._id = this.getInitGameId();
                this._new = false;
                break;
            case false:
                let update = db.prepare('update games set ub_id = (?), gs_id = (?), ua_done = (?), ub_done = (?) where id = (?)');
                update.run(this._userB.id,this._gameSession.id,this._id,this._userADone===true?1:0,this._userBDone===true?1:0);
                break;
        }
    }
}


module.exports = Game;

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
    get userB(){
        return this._userB;
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
        gs.save();
        return gs.id;
    }
    initGame(user){
        let game = new Game(user,true);
        game.save();
        return game;
    }
    userIsDone(user){
        let update = "";
        if (user === this._userA.id) {
            update = db.prepare('update games set ua_done = 1 where id = (?)');
        } else if (user === this._userB.id) {
            update = db.prepare('update games set ub_done = 1 where id = (?)');
        }
        update.run(this._id);
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
                let update = db.prepare('update games set ub_id = (?), gs_id = (?) where id = (?)');
                update.run(this._userB.id,this._gameSession.id,this._id);
                break;
        }
    }
}


module.exports = Game;

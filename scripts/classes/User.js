var Database = require('better-sqlite3');
var sha1 = require('sha1');
let db = new Database('../db/quiz.db');


class User {
    constructor(id) {
        if (typeof(id)==='number') {
            let row = db.prepare(`select * from users where id = ${id}`).get();
            this._id = row.id;
            this._email = row.email;
            this._username = row.username;
            this._password = row.password;
            this._image = row.image;
            this._age = row.age;
            this._comment = row.comment;
            this._isAdmin = row.is_admin;
            this._new = false;
        } else if (typeof(id)==='string') {
            this._email = arguments[0];
            this._username = arguments[1];
            this._password = sha1(arguments[2]);
            this._image = arguments[3];
            this._age = arguments[4];
            this._comment = arguments[5];
            this._new = true;
        }
    }
    get password(){
        return this._password;
    }
    set password(password){
        this._password = sha1(password);
    }
    get username(){
        return this._username;
    }
    get email(){
        return this._email;
    }
    set email(email){
        this._email = email;
    }
    get image(){
        return this._image;
    }
    set image(image){
        this._image = image;
    }
    get age(){
        return this._age;
    }
    set age(age){
        this._age = age;
    }
    get comment(){
        return this._comment;
    }
    set comment(comment){
        this._comment = comment;
    }
    get isAdmin(){
        return this._isAdmin;
    }
    usernameExists(username){
        return typeof db.prepare("select username from users where username = (?)").get(username) === 'undefined'?false:true;
    }
    emailExists(email){
        return typeof db.prepare("select email from users where email = (?)").get(email) === 'undefined'?false:true;
    }
    correctPassword(username,password){
        return db.prepare(`select password from users where username = "${username}"`).get().password === sha1(password);
    }
    save(){
        if (this._new === true) {
            let stmt = db.prepare('insert into users (email,username,password,image,age,comment) values (?,?,?,?,?,?)');
            stmt.run(this._email,this._username,this._password,this._image,this._age,this._comment);
            this._id = db.prepare(`select id from users where email = "${this._email}" and username = "${this._username}"`).get().id;
        } else if (!this._new) {
            let stmt = db.prepare(`update users set email = "${this._email}", password = "${this._password}", age = "${this._age}", image = (?), comment = "${this._comment}" where id = ${this._id}`);
            stmt.run(this._image);
        }
    }
}

module.exports = User;

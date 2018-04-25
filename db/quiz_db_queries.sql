CREATE TABLE user (id integer primary key autoincrement,email varchar(255) not null,username varchar(255) not null, password varchar(255) not null, image text, age int, comment varchar(255), is_admin boolean default 0);
CREATE TABLE question (id integer primary key autoincrement, question text not null);
CREATE TABLE answer (id integer primary key autoincrement, qid integer, answer text not null, is_true boolean not null, FOREIGN KEY(qid) REFERENCES question(id));
CREATE TABLE game_session (id integer primary key autoincrement, seed varchar(255) not null, ua_id integer, ua_points integer default 0, ub_id integer, ub_points integer default 0,FOREIGN KEY(ua_id) REFERENCES user(id), FOREIGN KEY(ub_id) REFERENCES user(id));
CREATE TABLE user_statistic (id integer primary key autoincrement, uid integer, wins integer default 0, loses integer default 0, draws integer default 0, FOREIGN KEY(uid) REFERENCES user(id));

CREATE TABLE users (
	id integer primary key autoincrement,
	email varchar(255) not null,
	username varchar(255) not null,
	password varchar(255) not null,
	image text, age int,
	comment varchar(255),
	background_image integer default 1,
	is_admin boolean default 0
);
CREATE TABLE questions (
	id integer primary key autoincrement,
	question text not null
);
CREATE TABLE answers (
	id integer primary key autoincrement,
	qid integer not null,
	answer text not null,
	is_true boolean not null,
	FOREIGN KEY(qid) REFERENCES questions(id)
);
CREATE TABLE game_sessions (
	id integer primary key autoincrement,
	seed integer not null,
	ua_id integer not null,
	ua_points integer default 0,
	ua_current_question integer not null,
	ub_id integer not null,
	ub_points integer default 0,
	ub_current_question integer not null,
	done boolean default 0;
	FOREIGN KEY(ua_id) REFERENCES users(id),
	FOREIGN KEY(ub_id) REFERENCES users(id),
	FOREIGN KEY(ua_current_question) REFERENCES questions(id),
	FOREIGN KEY(ub_current_question) REFERENCES questions(id)
);
CREATE TABLE user_statistics (
	id integer primary key autoincrement,
	uid integer not null,
	wins integer default 0,
	loses integer default 0,
	draws integer default 0,
	FOREIGN KEY(uid) REFERENCES users(id)
);
CREATE TABLE games (
	id integer primary key autoincrement,
	ua_id integer,
	ub_id integer,
	gs_id integer,
	ua_done boolean default 0,
	ub_done boolean default 0,
	FOREIGN KEY(ua_id) REFERENCES users(id),
	FOREIGN KEY(ub_id) REFERENCES users(id),
	FOREIGN KEY(gs_id) REFERENCES game_sessions(id)
);

-- Password = hallo123
insert into users (email,username,password,image,age,comment,is_admin) values ('super@admin.de','superadmin','7e0e0c4012fca9f0a18c802df01e758713a0751b',NULL,42,"",1);
-- Password = blablabla
insert into users (email,username,password,image,age,comment) values ('normal@user.de','normaluser','23c6834b1d353eabf976e524ed489c812ff86a7d',NULL,12,"");
insert into questions (question) values ('Wieviel ist 5 + 5?');
insert into answers (qid,answer,is_true) values(1,"10",1);
insert into answers (qid,answer,is_true) values(1,"11",0);
insert into answers (qid,answer,is_true) values(1,"12",0);
insert into answers (qid,answer,is_true) values(1,"13",0);
insert into questions (question) values ('Welches Jahr haben wir?');
insert into answers (qid,answer,is_true) values (2,"2018",1);
insert into answers (qid,answer,is_true) values (2,"2017",0);
insert into answers (qid,answer,is_true) values (2,"2019",0);
insert into answers (qid,answer,is_true) values (2,"2020",0);
insert into questions (question) values ('Wieso?');
insert into answers (qid,answer,is_true) values (3,"Darum",1);
insert into answers (qid,answer,is_true) values (3,"Larum",0);
insert into answers (qid,answer,is_true) values (3,"Farum",0);
insert into answers (qid,answer,is_true) values (3,"Sarum",0);
insert into game_sessions (seed,ua_id,ub_id,ua_current_question,ub_current_question) values (123456,1,2,1,1);
insert into user_statistics (uid,wins) values (1,42);
insert into user_statistics (uid) values (2);
insert into games (ua_id,ub_id,gs_id) values (1,2,1);
insert into games (ua_id) values (3);

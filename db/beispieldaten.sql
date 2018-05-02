-- Password = hallo123
insert into users (email,username,password,image,age,comment,is_admin) values ('super@admin.de','superadmin','7e0e0c4012fca9f0a18c802df01e758713a0751b',NULL,42,"",1);
-- Password = blablabla
insert into users (email,username,password,image,age,comment) values ('normal@user.de','normaluser','23c6834b1d353eabf976e524ed489c812ff86a7d',NULL,12,"");
insert into questions (question) values('Wieviel ist 5 + 5?');
insert into answers (qid,answer,is_true) values(1,"10",1);
insert into answers (qid,answer,is_true) values(1,"11",0);
insert into answers (qid,answer,is_true) values(1,"12",0);
insert into answers (qid,answer,is_true) values(1,"13",0);
insert into game_sessions (seed,ua_id,ub_id,ua_current_question,ub_current_question) values (123456,1,2,1,1);
insert into user_statistics (uid,wins) values (1,42);
insert into user_statistics (uid) values (2);

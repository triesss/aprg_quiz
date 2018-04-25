-- Password = hallo123
insert into user(email,username,password,image,age,comment,is_admin) values ('super@admin.de','superadmin','7e0e0c4012fca9f0a18c802df01e758713a0751b',NULL,42,"",1);
-- Password = blablabla
insert into user(email,username,password,image,age,comment) values ('normal@user.de','normaluser','23c6834b1d353eabf976e524ed489c812ff86a7d',NULL,12,"");
insert into question(question) values('Wieviel ist 5 + 5?');
insert into answer (qid,answer,is_true) values(1,"10",1);
insert into answer (qid,answer,is_true) values(1,"11",0);
insert into answer (qid,answer,is_true) values(1,"12",0);
insert into answer (qid,answer,is_true) values(1,"13",0);
insert into game_session(seed,ua_id,ub_id) values ('1;2;3;4;5',1,2);
insert into user_statistic(uid,wins) values (1,42);
insert into user_statistic(uid) values (2);

const express = require('express');
const multer = require('multer');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');
const path = require('path');
const User = require('./classes/User');
const Game = require('./classes/Game');
const Statistic = require('./classes/UserStatistic');



const session = require('express-session');
app.use(session({
	secret: 'example',
	resave: false,
	saveUninitialized: true
}));

app.listen(3000,function(){
	console.log("Port on 3000");


});

//Storage Engine
const storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}




// Public Folder (fÃ¼r css bilder usw)
app.use(express.static('../public'));

app.get('/',function(req,res){
	res.render('regilog');
});

app.get('/home', function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/register',function(req,res){
	const user = req.body['username'];
	const pass = req.body['password'];
	const mail = req.body['email'];



	if (user === "" || pass === "" || mail === ""){
		res.render('regilog',{
			message1: 'empty field'
		});

	}
	else{

		if (!User.prototype.usernameExists(user)){

		let user1 = new User(mail,user,pass,null,null,null);
		user1.save();
		


		res.render('regilog',{
		message1: 'Sucessfull, you can now Log in'
		});



		}

		else {

			res.render('regilog',{
			message1: 'username already exist'
			});


		}
	}
});


	let comment;
	let age;
	let wins;
	let loses;
	let draws;
	app.post('/login',function(req,res){

	const user = req.body['username'];
	const pass = req.body['password'];

		if (User.prototype.usernameExists(user) && User.prototype.correctPassword(user,pass)){

			req.session['authenticated'] = true;
				req.session["username"] = user;
				req.session["userid"] = User.prototype.idOfUsername(req.session["username"]);
				let stats = new Statistic(req.session["userid"]);
				stats.save();
				wins = stats.wins;
				loses = stats.loses;
				draws = stats.draws;
				res.redirect('/profile');


		}

		else{
			res.render('regilog',{
			message2: 'wrong username or password'
			});
			}




	});






	let zahl; //fÃ¼r die Titelbilder 1-5 siehe /changecover
	let im; // diese variable bekommt den namen des profilbildes

	app.get('/profile', function(req,res){


		if (req.session['authenticated'] == true){
		

		let user2 = new User(req.session["userid"]);
		zahl = user2.bgimg;
		if(user2.age === null){
		age = '  ';
		}

		else{
			age = user2.age;
		}
		if(user2.comment === null){
		comment = '  ';
		}
		else{
			comment = user2.comment;
		}



			if (user2.image === null){
			user2.image = 'nopb.jpg';
			}
			res.render('profile',{
			// die entsprechenden Pfade fÃ¼rs Profilbild und Titelbild
			profile: `uploads/${user2.image}`,
			cover: `images/titelbild${zahl}.jpg`,
			user: req.session["username"] ,
			wins: wins ,
			loses: loses ,
			draws: draws ,
			age: age ,
			comment: comment

			});



	}else{
		res.render('error', {message: "You have to log in first"});
	}
	});


app.get('/start',function(req,res){

	res.render('start');
});


app.post('/startgame',function(req,res){
	res.redirect('/startGame');
});

app.get('/startGame',function(req,res){
	if (Game.prototype.getGameIdOfEnemy(req.session["userid"]) === -1 && Game.prototype.getGameIdOfUser(req.session["userid"]) === -1 && !Game.prototype.initGameExists()){

		//if (gameidOfUser=== initGameiD)
		res.redirect('/newGame');
	}
	else if(Game.prototype.getGameIdOfUser(req.session["userid"]) !== -1){
		if (Game.prototype.initGameExists()) {
			if (Game.prototype.getGameIdOfUser(req.session["userid"]) !== Game.prototype.getInitGameId()) {
				let game = new Game(Game.prototype.getGameIdOfUser(req.session["userid"]),false);
				req.session.gameID = game.id;
				res.redirect('/oldgame?gameID='+game.id);
			}else{
				res.render('enemyerror', {'message': "Warte bis dein Gegner gefunden wurde..."});
			}
		}else {
			let game = new Game(Game.prototype.getGameIdOfUser(req.session["userid"]),false);
			req.session.gameID = game.id;
			res.redirect('/oldgame?gameID='+game.id);
		}

	}
	else if(Game.prototype.initGameExists()){
		if(Game.prototype.getGameIdOfUser(req.session["userid"]) !== Game.prototype.getInitGameId()){
		let game = new Game(Game.prototype.getInitGameId(),false);
		req.session.gameID = game.id;
		game.userB = req.session["userid"];
		game.initGameSession();
		game.gameSession.save();
		game.save();
		res.redirect('/oldgame?gameID='+game.id);
		}
		else{
			res.render('enemyerror', {'message': "Warte bis dein Gegner gefunden wurde..."});
		}
	}
	else if(Game.prototype.getGameIdOfEnemy(req.session["userid"]) !== -1){
		res.render('enemyerror', {'message': "Warte bis dein Gegner fertig ist..."});
	}
});

app.get('/newGame',function(req,res){
	Game.prototype.initGame(req.session["userid"]);
	let game = new Game(req.session["userid"],true);
	req.session['gameID'] = game.id;
	res.redirect('/startGame');
});

let gameId;
app.get('/oldGame',function(req,res){
	let game = new Game(req.session['gameID'],false);

	if (game.userADone && game.userBDone) {
		game.gameSession.endSession();
		game.gameSession.save();
	}

	if(req.session["userid"] === game.userA.id){
	if(game.gameSession.getNextQuestion(game.userA.id) !== null){
	//erstellt 2 neue Arrays, in welchen die Antworten durchgewÃ¼rfelt werden
	let newAnswerArrayA = game.gameSession.questionA.answers;
	newAnswerArrayA.sort(function(a, b){return 0.5 - Math.random()});

	req.session[0] = newAnswerArrayA[0].answer;
    req.session[1] = newAnswerArrayA[1].answer;
    req.session[2] = newAnswerArrayA[2].answer;
    req.session[3] = newAnswerArrayA[3].answer;
	



	res.render('quiz',{
	question: game.gameSession.questionA.question,
	ans1: newAnswerArrayA[0].answer,
	ans2: newAnswerArrayA[1].answer,
	ans3: newAnswerArrayA[2].answer,
	ans4: newAnswerArrayA[3].answer
	});
	}
	else{
		game.userIsDone(game.userA.id);
		game.save();
		if (game.enemyIsDone(req.session.userid) === 1){
				let usa = new Statistic(game.userA.id);
				let usb = new Statistic(game.userB.id);	
				
				switch (game.gameSession.determineResult()) {
				case 0:      
					usa.addLose();
					usb.addWin();
					break;
				case 1:
					usb.addDraw();
					usa.addDraw();
					break;
				case 2:
					usb.addLose();
					usa.addWin();
					break;
				}
				usb.save();
				usa.save();
			}
		res.redirect('/profile');
	}

	}

	else if(req.session["userid"] === game.userB.id){
		
		
		
		if(game.gameSession.getNextQuestion(game.userB.id) !== null){
			game.gameSession.questionB.answers.sort(function(a, b){return 0.5 - Math.random()});
			let newAnswerArrayB = game.gameSession.questionB.answers;
			newAnswerArrayB.sort(function(a, b){return 0.5 - Math.random()});
			req.session["B0"] = newAnswerArrayB[0].answer;
			req.session["B1"] = newAnswerArrayB[1].answer;
			req.session["B2"] = newAnswerArrayB[2].answer;
			req.session["B3"] = newAnswerArrayB[3].answer;
			res.render('quiz',{
			question: game.gameSession.questionB.question,
			ans1: newAnswerArrayB[0].answer,
			ans2: newAnswerArrayB[1].answer,
			ans3: newAnswerArrayB[2].answer,
			ans4: newAnswerArrayB[3].answer
		});
		}
		else{
			game.userIsDone(game.userB.id);
			game.save();
			if (game.enemyIsDone(req.session.userid) === 1){
				let usa = new Statistic(game.userA.id);
				let usb = new Statistic(game.userB.id);	
				
				switch (game.gameSession.determineResult()) {
				case 0:      
					usa.addLose();
					usb.addWin();
					break;
				case 1:
					usb.addDraw();
					usa.addDraw();
					break;
				case 2:
					usb.addLose();
					usa.addWin();
					break;
				}
				usb.save();
				usa.save();
			}
			res.redirect('/profile');
		}
	}

});

app.post('/checkAnswers',function(req,res){


	let game = new Game (req.session['gameID'],false);
	let answ = req.body["ans"];
	let givenAnswerA = req.session[answ];
	let givenAnswerB = req.session["B"+answ];
	let correct_answerA = null;
	let correct_answerB = "Test";

	
	if(Object.keys(game.gameSession.questionA).length !== 0 && game.gameSession.questionA.id !== -1){
	 	correct_answerA = game.gameSession.questionA.answers[0].answer;
	}
	if(Object.keys(game.gameSession.questionB).length !== 0 && game.gameSession.questionB.id !== -1){
		correct_answerB = game.gameSession.questionB.answers[0].answer;
	}
		

	
	if (Object.keys(game.gameSession.questionA).length === 0){
	game.userIsDone(game.userA.id);
	game.save();
	if (game.enemyIsDone(req.session.userid) === 1){
		let usa = new Statistic(game.userA.id);
		let usb = new Statistic(game.userB.id);	
		
		switch (game.gameSession.determineResult()) {
        case 0:
              
            usa.addLose();
            usb.addWin();
            break;
        case 1:
            
            usb.addDraw();
            usa.addDraw();
            break;
        case 2:
           
            usb.addLose();
            usa.addWin();
            break;
    }
		usb.save();
		usa.save();
	}
	res.redirect('/profile');
	}

	if (Object.keys(game.gameSession.questionB).length === 0){
	game.userIsDone(game.userB.id);
	game.save();
	if (game.enemyIsDone(req.session.userid) === 1){
		let usa = new Statistic(game.userA.id);
		let usb = new Statistic(game.userB.id);	
		
		switch (game.gameSession.determineResult()) {
        case 0:
              
            usa.addLose();
            usb.addWin();
            break;
        case 1:
           
            usb.addDraw();
            usa.addDraw();
            break;
        case 2:
            
            usb.addLose();
            usa.addWin();
            break;
    }
		usb.save();
		usa.save();
	}
		

	res.redirect('/profile');
	}
	
	


	if(req.session["userid"] === game.userA.id){

		if (givenAnswerA == correct_answerA){
			
			game.gameSession.addPoint(game.userA.id);
		}
		

		if(game.gameSession.getNextQuestion(game.userA.id) !== null){

			game.gameSession.questionA = game.gameSession.getNextQuestion(game.userA.id);
			game.gameSession.save(game.userA.id);
			res.redirect('/oldgame');
		}
		else{
			res.redirect('/profile');
		}
	}

	if(req.session["userid"] === game.userB.id){

		if (givenAnswerB == correct_answerB){
			
			game.gameSession.addPoint(game.userB.id);
		}
		
		if(game.gameSession.getNextQuestion(game.userB.id) !== null){
			game.gameSession.questionB = game.gameSession.getNextQuestion(game.userB.id);
			game.gameSession.save(game.userB.id);
			res.redirect('/oldgame');
		}
		else{
			res.redirect('/profile');
		}


	}

});

//weiterleitung des change profile button zum uploader
app.post('/change',function(req,res){
	res.render('uploader');
});


//hier wird das hochgeladene bild in die Datenbank des users hinzugefÃ¼gt/ersetzt
app.post('/upload', function(req,res){
	if (req.session['authenticated'] == true){
  upload(req, res, (err) => {
    if(err){
      res.render('uploader', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('uploader', {
          msg: 'Error: No File Selected!'
        });
      } else {
		 pb = req.file.filename;
		let user = new User(req.session["userid"]);
			user.image = pb;
			user.save();
				res.redirect('/profile');

	}}});

	}

		else{
			res.render('error', {message: "You have to log in first"});
		}
});

//Ã„nderung der Titelbilder (hinweis kleiner pfeil button rechts vom profilbild)
app.post('/changecover',function(req,res){
		let user = new User(req.session["userid"]);
		if (user.bgimg < 5){
		user.bgimg += 1;
		}
		else{
			user.bgimg = 1;
		}
		user.save();
		res.redirect('/profile');

	});

app.post('/edit',function(req,res){
	res.render('edit');
});

app.post('/editpt2',function(req,res){
	age = req.body["age"];
	comment = req.body["comment"];
	let user = new User(req.session["userid"]);
	user.age = age;
	user.comment = comment;
	user.save();
	res.redirect('/profile');
});

app.get('/logout',function(req,res){
	delete req.session['authenticated'];
	res.redirect('/');

});

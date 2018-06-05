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

/*
if(Game.prototype.initGameExists()){
	let game = new Game (Game.prototype.getInitGameId(),false);
}
else{
	let game = new Game (Game.prototype.getInitGameId(),true);
}

*/


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




// Public Folder (für css bilder usw)
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
		console.log(user1);
			
				
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
	let userID;	
	let name; //globale variable für den username
	app.post('/login',function(req,res){
	
	const user = req.body['username'];
	const pass = req.body['password'];
	
		if (User.prototype.usernameExists(user) && User.prototype.correctPassword(user,pass)){
			
			req.session['authenticated'] = true;
				name = user;
				console.log("Login sucessfull");
				userID = User.prototype.idOfUsername(name);
				let stats = new Statistic(userID);
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
	
		
		
	

	
	let zahl; //für die Titelbilder 1-5 siehe /changecover
	let im; // diese variable bekommt den namen des profilbildes 
	
	app.get('/profile', function(req,res){
		
		
		if (req.session['authenticated'] == true){
			
			
		let user2 = new User(userID);
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
				console.log("dritter");
			user2.image = 'nopb.jpg';
			}
			console.log(user2);
			res.render('profile',{
			// die entsprechenden Pfade fürs Profilbild und Titelbild
			profile: `uploads/${user2.image}`,
			cover: `images/titelbild${zahl}.jpg`,
			user: name ,
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
	if (Game.prototype.getGameIdOfUser(userID) === -1 && !Game.prototype.initGameExists()){
		
		//if (gameidOfUser=== initGameiD)
		res.redirect('/newGame');
	}
	else if(Game.prototype.initGameExists()){ 
		let game = new Game(Game.prototype.getInitGameId(),false);
		req.session['gameID'] = game.id;
		game.userB = userID;
		game.initGameSession();
		game.gameSession.save();
		game.save();
		res.redirect('/oldgame?gameID='+game.id);
	}
	else{
		let game = new Game(Game.prototype.getGameIdOfUser(userID),false);
		req.session['gameID'] = game.id;
		res.redirect('/oldgame?gameID='+game.id);
	}
});	
	
app.get('/newGame',function(req,res){
	Game.prototype.initGame(userID);
	let game = new Game(userID,true);
	req.session['gameID'] = game.id;
	res.render('quiz',{
	question: game.gameSession.questionA.question,
	ans1: game.gameSession.questionA.answers[0].answer,
	ans2: game.gameSession.questionA.answers[1].answer,
	ans3: game.gameSession.questionA.answers[2].answer,
	ans4: game.gameSession.questionA.answers[3].answer
	});
});	

let gameId;	
app.get('/oldGame',function(req,res){
	let game = new Game(req.query.gameID,false);
	if(userID === game.userA.id){

	//erstellt 2 neue Arrays, in welchen die Antworten durchgewürfelt werden
	let newAnswerArrayA = game.gameSession.questionA.answers;
	let newAnswerArrayB = game.gameSession.questionB.answers;
	newAnswerArrayA.sort(function(a, b){return 0.5 - Math.random()});
	newAnswerArrayB.sort(function(a, b){return 0.5 - Math.random()});

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
	else if(userID === game.userB.id){
		game.gameSession.questionB.answers.sort(function(a, b){return 0.5 - Math.random()});
		res.render('quiz',{
		question: game.gameSession.questionB.question,
		ans1: game.gameSession.questionB.answers[0].answer,
		ans2: game.gameSession.questionB.answers[1].answer,
		ans3: game.gameSession.questionB.answers[2].answer,
		ans4: game.gameSession.questionB.answers[3].answer
		});
	}
	
});	

app.post('/checkAnswers',function(req,res){
	
	
	let game = new Game (req.session['gameID'],false);
	let answ = req.body["ans"];
	console.log(answ);
	console.log(game.gameSession.questionA.answers[0].answer);
	console.log(game.gameSession.questionA.answers[answ].answer);
	console.log(req.session[answ]);
	let givenAnswerA = req.session[answ];
	let givenAnswerB = req.session[answ];
	let correct_answerA = game.gameSession.questionA.answers[0].answer;
	let correct_answerB = game.gameSession.questionB.answers[0].answer;

	console.log("----------------" + givenAnswerA);
	console.log("---------------- " + correct_answerA);


	if(userID === game.userA.id){
				
		if (givenAnswerA == correct_answerA){
			console.log('Richtige Antwort');
			game.gameSession.addPoint(game.userA.id);
		}
		else{
			console.log('Falsche Antwort!');
		}
		
		if(game.gameSession.getNextQuestion(game.userA.id) !== null){
			game.gameSession.questionA = game.gameSession.getNextQuestion(game.userA.id);
			game.gameSession.save(game.userA.id);
			res.redirect('/oldgame');
		}
	}
	
	if(userID === game.userB.id){
				
		if (givenAnswerB == correct_answerB){
			console.log('Richtige Antwort');
			game.gameSession.addPoint(game.userB.id);
		}
		else{
			console.log('Falsche Antwort!');
		}
		if(game.gameSession.getNextQuestion(game.userB.id) !== null){
			game.gameSession.questionB = game.gameSession.getNextQuestion(game.userB.id);
			game.gameSession.save(game.userB.id);
			res.redirect('/oldgame');
		}
		
	}

	
	if(game.gameSession.getNextQuestion(game.userA.id) !== null){}
});

//weiterleitung des change profile button zum uploader
app.post('/change',function(req,res){
	res.render('uploader');
});	


//hier wird das hochgeladene bild in die Datenbank des users hinzugefügt/ersetzt
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
		let user = new User(userID);
			user.image = pb;
			user.save();
				res.redirect('/profile');
      
	}}});
	
	}
  
		else{
			res.render('error', {message: "You have to log in first"});
		}
});

//Änderung der Titelbilder (hinweis kleiner pfeil button rechts vom profilbild)
app.post('/changecover',function(req,res){
		let user = new User(userID);
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
	let user = new User(userID);
	user.age = age;
	user.comment = comment;
	user.save();
	res.redirect('/profile');
});	
	
app.get('/logout',function(req,res){
	delete req.session['authenticated'];
	res.redirect('/');
	
});




const express = require('express');
const multer = require('multer');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');
const path = require('path');
const User = require('./classes/User');



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
	
	
					
	
		
		
	let name; //globale variable für den username
	app.post('/login',function(req,res){
	
	const user = req.body['username'];
	const pass = req.body['password'];
	
		if (User.prototype.usernameExists(user) && User.prototype.correctPassword(user,pass)){
			
			req.session['authenticated'] = true;
				name = user;
				console.log("Login sucessfull");
				res.redirect('/profile'); //sobald home eingerichtet ist dann darauf weiterverlinken
			
		}
		
		else{
			res.render('regilog',{
			message2: 'wrong username or password'
			});
			}
			
			
			
		
	});
	
		
		
	


	let zahl = 1; //für die Titelbilder 1-5 siehe /changecover
	let im; // diese variable bekommt den namen des profilbildes 
	
	app.get('/profile', function(req,res){
		
		
		if (req.session['authenticated'] == true){
			
		let user2 = new User(2);
		
		
		
			
		
			// Dieser Ausschnitt wird zuerst abgespielt, deswegen alles so umständlich
			if (user2.image === null){
				console.log("dritter");
			user2.image = 'nopb.jpg';
			}
			console.log(user2);
			res.render('profile',{
							// die entsprechenden Pfade fürs Profilbild und Titelbild
			profile: `uploads/${user2.image}`,
			cover: `images/titelbild${zahl}.jpg`,
			user: name
			
			});
		
		
		
	}else{
		res.render('error', {message: "You have to log in first"});
	}
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
		let user = new User(2);
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
		if (zahl < 5){
		zahl += 1;
		}
		else{
			zahl = 1;
		}
		res.redirect('/profile');
		
	});
	
app.get('/logout',function(req,res){
	delete req.session['authenticated'];
	res.redirect('/');
	
});


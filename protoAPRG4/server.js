const express = require('express');
const multer = require('multer');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('benutzer.db', (error) => {
	if (error){
		console.error (error.message);
	}
	console.log('Connected to the database shop')
});

app.listen(3000,function(){
	console.log("Port on 3000");
	let sql = `SELECT * FROM users`;
	db.all(sql, (error, rows) => {
		if (error) {
			if (rows == undefined) {
				sql = `CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, image TEXT)`;
				db.run(sql);
				
			}
		}
	});
});

//Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
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
app.use(express.static('./public'));

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
	
		
		let sql = `select * from users where username = '${user}'`;
		db.get(sql,function(row){
		if (row == undefined){
			
		sql =  `INSERT INTO users(username, password) VALUES ('${user}', '${pass}')`;
		db.run(sql);		
				
		res.render('regilog',{
		message1: 'Sucessfull, you can now Log in'
		});
		
		sql = `SELECT * FROM users`;
		db.all(sql, function(err, rows){
		if (err){
		console.log(err.message);
		}
		else{
		console.log(rows);
			
		}
		});
		
		}
		else {	//Dieser Teil wird nie abgespielt irgendwie... sprich der selbe username ist mehrmals möglich....
			if (row != undefined){
			res.render('regilog',{
			message1: 'username already exist'
			});	
			
		}
		}
	});
	
	}
			
										
			
	});
		
		
	let name; //globale variable für den username
	app.post('/login',function(req,res){
	
	const user = req.body['username'];
	const pass = req.body['password'];
	
	let sql = `select * from users where username = '${user}' and password = '${pass}'`;
	db.get(sql,function(error,row){
		if (error){ //dieser teil wird auch nie abgespielt, muss noch behoben werden
			if (row == undefined){
			res.render('regilog',{
			message2: 'wrong username or password'
			});
			}
			else{
				console.log(error.message);
			}
		}
		else{
			if (row != undefined){
				name = user;
				console.log("Login sucessfull");
				res.redirect('/profile'); //sobald home eingerichtet ist dann darauf weiterverlinken
				console.log(name);
			}
			
			
		}
	});
	
	});
		
		
	


	let zahl = 1; //für die Titelbilder 1-5 siehe /changecover
	let userId;	//globale Variable für user id

	app.get('/profile', function(req,res){
		console.log(name);
		sql = `SELECT * FROM users WHERE username = '${name}'`;
		db.get(sql,[],function(err,row){
			if (err){
				
				console.log(err.message);
				console.log("erste");
				
			}
			
		else{
			
			userId = row.id;
			console.log(userId);
		}
		});
		let im;
		sql = `SELECT image FROM users where id= ${userId}`;
		db.get(sql,[],function(err,row){
			if (err){ 
				db.run(`UPDATE users SET image = 'nopb.jpg' where id = ${userId}`,function(error){
					if (error){
						console.log(error.message);
					}
				});
				
				res.redirect('/profile');
			}
			
		else{
			im = row.image;
			if (im == null){
				im = 'nopb.jpg';
			}
			console.log(im);
			res.render('profile',{
						// die entsprechenden Pfade fürs Profilbild und Titelbild
			profile: `uploads/${im}`,
			cover: `images/titelbild${zahl}.jpg`
			
		});
		}
		});
		
	}); 
	

app.post('/change',function(req,res){
	res.render('uploader');
});	

app.post('/upload', function(req,res){
	
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
		sql = `INSERT into users (image) VALUES ('${pb}') where id= ${userId}`;
		 db.run(sql,function(row){
					if (row != undefined){
						db.run(`UPDATE users SET image='${pb}' WHERE id= ${userId}`);
					}
				});
				res.redirect('/profile');
      }
    }
  });	
});

app.post('/changecover',function(req,res){
		if (zahl < 5){
		zahl += 1;
		}
		else{
			zahl = 1;
		}
		res.redirect('/profile');
	});


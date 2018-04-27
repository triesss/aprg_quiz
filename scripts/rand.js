var srand = require('srand');
var AnzFr = 11;
srand.seed(345546);
var Fragen = [];

for(var i = 0;i < 10; i++){
   do{
	var lock = 0;
	var id = parseInt((srand.random()*(AnzFr)) + 1);
	for(var j = 0; j < i;j++){
		if(Fragen[j] === id){
			lock = 1;
		}
	}

	}while(lock == 1);
	Fragen[i] = id;
}
console.log(Fragen);











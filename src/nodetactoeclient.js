var net = require('net');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var client = net.connect({port: 8100}, function(){console.log("client connected-- Game Started"); });

client.on("data", function(data){
	console.log(data.toString());

rl.question("> ", function(answer) {
  			client.write(answer + " ");
	});
});

client.on("end", function(){
	console.log("client disconnected -- Thanks for playing!\n");
});

client.on("error", function(){
	console.log("The game is over, thanks for playing.");
});
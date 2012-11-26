

var net = require('net');

var comp_move;

var server = net.createServer(function(target){
	tttGame = function(){
	this.userMove = true;
	this.gameOver = false;
	this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; //unoccupied spaces on the game board are 0.
};

tttGame.prototype.drawBoard = function(){
	var board_string = "";
	for (var row = 0; row < 3; row++){
		for (var col = 0; col < 3; col++){
			board_string += ((this.board[row][col] == 1) ? "X  "
					: ((this.board[row][col] == -1) ? "O  "
						: "[] "
						)
				);
		} 
		board_string += "\n";
	}
	return board_string;
};

tttGame.prototype.updateBoard = function(move){
	if (this.userMove == true)
		this.board[move.toString()[0]][move.toString()[1]] = 1; // human player is 1
	else 
		this.board[move.toString()[0]][move.toString()[1]] = -1; // computer is -1
};

tttGame.prototype.getCompMove = function(){
	var move;
	var diag_winning_pos = this.checkDiagPos(this, -1);
	var diag_losing_pos = this.checkDiagPos(this, 1);
	var row_winning_pos = this.checkRowPos(this, -1);
	var row_losing_pos = this.checkRowPos(this, 1);
	var col_winning_pos = this.checkColPos(this, -1);
	var col_losing_pos = this.checkColPos(this, 1);

	if (diag_winning_pos != "")
		move = diag_winning_pos;
	else if (row_winning_pos != "")
		move = row_winning_pos;
	else if (col_winning_pos != "")
		move = col_winning_pos;
	else if (diag_losing_pos != "")
		move = diag_losing_pos;
	else if (row_losing_pos != "")
		move = row_losing_pos;
	else if (col_losing_pos != "")
		move = col_losing_pos;
	else
		move = Math.floor(Math.random()*3).toString() + Math.floor(Math.random()*3).toString();
	
	if (this.validMove(move) == true)
		return move;
	else 
		return this.getCompMove();
}

tttGame.prototype.checkDiagPos = function(game, board_num){
	var index = "";
	var row, col;
	//check middle
	index += (((game.board[0][0] == board_num && game.board[2][2] == board_num) || (game.board[0][2] == board_num && game.board[2][0] == board_num)) ? 
		((game.board[0][0] != -1*board_num) ? "11" 
			: "" )
		: ""
		);
	//check corners
	for (row = 0; row < 3; row +=2){
		for (col = 0; col < 3; col +=2){
			index += ((game.board[row][col] == board_num && game.board[1][1] == board_num) ? (((row == 0) ? 2 : 0)).toString() + (((col == 0) ? 2 : 0)).toString()
				: ""
				);
		}
	}

	return index;
}

tttGame.prototype.checkRowPos = function(game, board_num){
	var index = "";
	var row, col;
	
	//check left to right
	col = 0;
	for (row = 0; row < 3; row++){
		index += ((game.board[row][col] == board_num && game.board[row][col + 1] == board_num) ? 
			((game.board[row][col + 2] != -1*board_num) ? row.toString() + (col + 2).toString() 
				: "" )
			: ""
			 );
	}
	//check left to right
	col = 2;
	for (row = 0; row < 3; row++){
		index += ((game.board[row][col] == board_num && game.board[row][col - 1] == board_num) ? 
			((game.board[row][col - 2] != -1*board_num) ? row.toString() + (col - 2).toString() 
				: "" )
			: ""
			 );
	}
	//check middle
	col = 1;
	for (row = 0; row < 3; row++){
		index += ((game.board[row][0] == board_num && game.board[row][2] == board_num) ? 
			((game.board[row][col] != -1*board_num) ? row.toString() + col.toString() 
				: "" )
			: ""
			 );
	}


	return index;
	 
}

tttGame.prototype.checkColPos = function(game, board_num){
	var index = "";
	var row, col;
	
	//check up to down
	row = 0;
	for (col = 0; col < 3; col++){
		index += ((game.board[row][col] == board_num && game.board[row + 1][col] == board_num) ? 
			((game.board[row + 2][col] != -1*board_num) ? (row + 2).toString() + col.toString() 
				: "" )
			: ""
			 );
	}
	//check down to up
	row = 2;
	for (col = 0; col < 3; col++){
		index += ((game.board[row][col] == board_num && game.board[row - 1][col] == board_num) ? 
			((game.board[row - 2][col] != -1*board_num) ? (row - 2).toString() + col.toString() 
				: "" )
			: ""
			 );
	}
	//check middle
	row = 1;
	for (col = 0; col < 3; col++){
		index += ((game.board[0][col] == board_num && game.board[2][col] == board_num) ? 
			((game.board[row][col] != -1*board_num) ? row.toString() + col.toString() 
				: "" )
			: ""
			 );
	}
	
	return index;
}

tttGame.prototype.checkDiag = function(){
	var result = new Boolean();
	if((this.board[0][0] + this.board[1][1] + this.board[2][2] == 3) || (this.board[0][2] + this.board[1][1] + this.board[2][0] == 3)){
		result = true;
	}
	else if ((this.board[0][0] + this.board[1][1] + this.board[2][2] == -3) || (this.board[0][2] + this.board[1][1] + this.board[2][0] == -3)){
		result = true;
	}
	return result;
}

tttGame.prototype.checkRow = function(){
	var total = 0;
	
	for (var i = 0; i < 3; i++){
		for (var j = 0; j < 3; j++){
			total += this.board[i][j]; 
		}
		if (total == 3 || total == -3){
			return true;
		}
		total = 0;
	}
	return false;
}

tttGame.prototype.checkCol = function(){
	var total = 0;
	
	for (var j = 0; j < 3; j++){
		for (var i = 0; i < 3; i++){
			total += this.board[i][j]; 
		}
		if (total == 3 || total == -3){
			return true;
		}
		total = 0;
	}
	return false;
}

tttGame.prototype.gameCheck = function(){
	if (this.checkDiag() == true || this.checkRow() == true || this.checkCol() == true)
		this.gameOver = true;
}

tttGame.prototype.validMove = function(move){
		var validity = new Boolean(); // false by default

		move_string = move.toString();

		if ((move_string[0] < 0 || move_string[0] > 2) || (move_string[1] < 0 || move_string[1] > 2))
			;
		else if (this.board[move_string[0]][move_string[1]] == 1)
			;
		else if (this.board[move_string[0]][move_string[1]] == -1)
			;
		else 
			validity = true;
		
		return validity;		
}

	var new_game = new tttGame();
	console.log("server connected");
	target.on("end", function(){
		console.log("disconnected");
	});
	
	target.on("data", function(data){
		if (new_game.validMove(data) == true){
			new_game.updateBoard(data);
			new_game.gameCheck();
			if (new_game.gameOver == true){
				console.log("Got this: " + data + "from: " + target.remoteAddress + "\n");
				target.write("The Game is Over!\n" + new_game.drawBoard() + "\n");
				target.end();
			}
			else {	
				console.log("Got this: " + data + "from: " + target.remoteAddress + "\n");
				comp_move = new_game.getCompMove();
				new_game.userMove = false;
				new_game.updateBoard(comp_move);
				new_game.gameCheck();
				if (new_game.gameOver == true){
					target.write(new_game.drawBoard() + "\n");
					console.log("Got this: " + data + "from: " + target.remoteAddress + "\n");
					target.write("The Game is Over!\n" + new_game.drawBoard() + "\n");
					target.end();
				}
					target.write(new_game.drawBoard() + "\n");
			}
		}
		else {
			console.log("Got this: " + data + "from: " + target.remoteAddress + "\n");
			target.write("That's not a valid move: Try Again\n");
		}
		new_game.userMove = true;
	});

	target.write("\n\nLet the Game begin: The board has row/column coordinates, each starting from 0.\n" +
		"Make a move by typing the coordinates of your move-- without spaces.\nI.e., something " + 
		"like \"00\" (for the top left corner) \nor \"11\" (for the middle of the board)." + 
		"\n\nWhat's your first move?\n" + new_game.drawBoard());

});

server.listen(8100, function(){console.log("server bound-- touchdown");});


var board = new Array();
var score = 0;
var flagArray = new Array();

$(document).ready(function(){
	newgame();
});

function newgame(){
	//初始化棋盘
	init();
	//随机生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i=0; i<4; i++){
		for (var j = 0; j<4; j++) {
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	}

	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		flagArray[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			flagArray[i][j] = false;
		}
	}

	updateBoardView();
	score = 0;
	updateScore(score);
}

function updateBoardView(){
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {                                                
			$("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>")
			var theNumberCell = $("#number-cell-"+i+"-"+j);

			if (board[i][j]==0) {
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+50);
				theNumberCell.css('left',getPosLeft(i,j)+50);
			}
			else{
				theNumberCell.css('width','100px');
				theNumberCell.css('height','100px');
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));		
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));	
				theNumberCell.css('color',getNumberColor([i][j]));
				theNumberCell.text(board[i][j]);
			}
			flagArray[i][j] = false;
		}
	}
}

function generateOneNumber(){
	if (nospace(board)) {
		return false;
	}

	//随机位置
	var randx = parseInt(Math.floor(Math.random()*4));
	var randy = parseInt(Math.floor(Math.random()*4));
	var time = 0;
	while (time < 50) {
		if (board[randx][randy]==0) 
			break;
		randx = parseInt(Math.floor(Math.random()*4));
	    randy = parseInt(Math.floor(Math.random()*4));
	    time++;
	}
	//如果50次都随即不出一个位置，则自找
	if (time==50) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (board[i][j]==0) {
					randx = i;
					randy = j;
				}
			}
		}
	}


	//随机数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	//在位置显示数字
	board[randx][randy]=randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
}

$(document).keydown(function(event){
	switch (event.keyCode) {
		case 37://left
			if (moveLeft()) {
				setTimeout('generateOneNumber()',250);
				setTimeout('isgameover()',700);
			}
			break;
		case 38://up
			if (moveUp()) {
				setTimeout('generateOneNumber()',250); 				
				setTimeout('isgameover()',700);
			}
			break;
		case 39://right
			if (moveRight()) {
				setTimeout('generateOneNumber()',250); 				
				setTimeout('isgameover()',700);
			}
			break;
		case 40://down
			if (moveDown()) {
				setTimeout('generateOneNumber()',250); 				
				setTimeout('isgameover()',700);
			}
			break;
		default:
			break;
	}
});

function isgameover(){
	if (nospace(board) && nomove(board)) 
		gameover();
}
function gameover(){
	alert('gameover!!!!')
}

function moveLeft(){
	if(!canMoveLeft(board))
		return false;
	//moveleft
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if (board[i][j]!=0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k]==0 && noBlockHorizontal(i,k,j,board)) {
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						break;
					}
					else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !flagArray[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						updateScore(score);
						flagArray[i][k] = true;
						break;						
					}

				}
			}
		}
	}
	setTimeout('updateBoardView()',200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board))
		return false;
	//moveright
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if (board[i][j]!=0) {
				for (var k = 3; k > j; k--) {
					if (board[i][k]==0 && noBlockHorizontal(i,k,j,board)) {
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						break;
					}
					else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !flagArray[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k]; 						
						updateScore(score);
						flagArray[i][k] = true;
						break;						
					}

				}
			}
		}
	}
	setTimeout('updateBoardView()',200);
	return true;
}


function moveUp(){
	if(!canMoveUp(board))
		return false;
	//moveUp
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if (board[j][i]!=0) {
				for (var k = 0; k < j; k++) {
					if (board[k][i]==0 && noBlockVertical(i,k,j,board)) {
						showMoveAnimation(j,i,k,i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						break;
					}
					else if(board[k][i]==board[j][i] && noBlockVertical(i,k,j,board) && !flagArray[k][i]){
						showMoveAnimation(j,i,k,i);
						board[k][i] += board[j][i];
						board[j][i] = 0;
						score += board[k][i]; 						
						updateScore(score);
						flagArray[k][i] = true;
						break;						
					}

				}
			}
		}
	}
	setTimeout('updateBoardView()',200);
	return true;
}
function moveDown(){
	if(!canMoveDown(board))
		return false;
	//moveUp
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if (board[j][i]!=0) {
				for (var k = 3; k > j; k--) {
					if (board[k][i]==0 && noBlockVertical(i,k,j,board)) {
						showMoveAnimation(j,i,k,i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						break;
					}
					else if(board[k][i]==board[j][i] && noBlockVertical(i,k,j,board) && !flagArray[k][i]){
						showMoveAnimation(j,i,k,i);
						board[k][i] += board[j][i];
						board[j][i] = 0;
						score += board[k][i]; 						
						updateScore(score);
						flagArray[k][i]
						break;						
					}

				}
			}
		}
	}
	setTimeout('updateBoardView()',200);
	return true;
}


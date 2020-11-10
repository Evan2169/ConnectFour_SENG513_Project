import * as WebSocket from 'ws';

export class ConnectFourGame {
   public playerOneUsername: string;
   public playerTwoUsername: string;
   public gameBoard: string[][];
   private turnNumber: number;
   private gameColumns: string[][];
   private gameOver: boolean;

   constructor() {
    	this.playerOneUsername = "";
    	this.playerTwoUsername = "";
    	this.turnNumber = Math.round(Math.random());
    	this.gameOver = false;
    	this.gameBoard = [];
    	this.gameColumns = [];
    	for(let i = 0; i < 6; i++) {
    		this.gameBoard[i] = [];
    		for(let j = 0; j < 7; j++) {
    			this.gameBoard[i][j] = "";
    		}
    	}
    	for(let i = 0; i < 7; i++) {
    		this.gameColumns[i] = new Array();
    	}
   }

	public addPlayer(username: string): boolean {
    	if(this.playerOneUsername === "") {
    		this.playerOneUsername = username;
    		return true;
    	}
    	else if(this.playerTwoUsername === "") {
    		this.playerTwoUsername = username;
    		return true;
    	}
    	else {
    		return false;
    	}
   }

   public gameSetupComplete(): boolean {
   	return this.playerOneUsername !== "" && this.playerTwoUsername !== "";
   }

   public currentPlayerTurn(): string {
      switch (this.turnNumber % 2) {
         case 0:
            return this.playerOneUsername;
         default:
         	return this.playerTwoUsername;
      }
   }

   public makeMove(username: string, move: string): [boolean, string] {
   	if(username !== this.currentPlayerTurn()) {
   		return [false, "It's not your turn!"];
   	}
   	else if(this.gameOver) {
   		return [false, "Game is over. Join a new game to play again."]
   	}
   	else {
   		switch (move) {
   			case "column_zero":
   				if(this.gameColumns[0].length === 6) {
   					return [false, "Invalid move"];
   				}
   				else {
   					this.gameColumns[0].push(username);
   				}
   				break;
   			case "column_one":
   				if(this.gameColumns[1].length === 6) {
   					return [false, "Invalid move"];
   				}
   				else {
   					this.gameColumns[1].push(username);
   				}
   				break;
   			case "column_two":
   				if(this.gameColumns[2].length === 6) {
   					return [false, "Invalid move"];
   				}
   				else {
   					this.gameColumns[2].push(username);
   				}
   				break;
   			case "column_three":
   				if(this.gameColumns[3].length === 6) {
   					return [false, "Invalid move"];
   				}
   				else {
   					this.gameColumns[3].push(username);
   				}
   				break;
   			case "column_four":
   				if(this.gameColumns[4].length === 6) {
   					return [false, "Invalid move"];
   				}
   				else {
   					this.gameColumns[4].push(username);
   				}
   				break;
   			case "column_five":
   				if(this.gameColumns[5].length === 6) {
   					return [false, "Invalid move"];
   				}
   				else {
   					this.gameColumns[5].push(username);
   				}
   				break;
   			case "column_six":
   				if(this.gameColumns[6].length === 6) {
   					return [false, "Invalid move"];
   				}
   				else {
   					this.gameColumns[6].push(username);
   				}
   				break;
   		}
   		this.updateGameBoard();
   		this.turnNumber++;
   		return [true, ""];
   	}
   }

   public winner(): string {
   	if(this.gameBoardFull()) {
   		return "draw";
   	}
   	for(let i = 0; i < 6; i++) {
   		for(let j = 0; j < 7; j++) {
   			let gameOver = this.checkForConnectFourVerticalUp(i, j)
   								|| this.checkForConnectFourDiagonalUpRight(i, j)
   								|| this.checkForConnectFourDiagonalDownRight(i, j)
   								|| this.checkForConnectFourHorizontalRight(i, j);
   			if(gameOver) {
   				this.gameOver = true;
   				return this.gameBoard[i][j];
   			}
   		}
   	}
   	return "";
   }

   private checkForConnectFourVerticalUp(row: number, column: number): boolean {
   	if(row > 2) {
   		return false;
   	}
   	let tempGameBoard = Array.from(this.gameBoard);
   	for(let i = 1; i < 4; i++) {
   		const startingPiece = tempGameBoard[row][column];
   		const connectingPiece = tempGameBoard[row + i][column];
   		if(!startingPiece || !connectingPiece || startingPiece !== connectingPiece) {
   			return false;
   		}
   	}
   	return true;
   }

   private checkForConnectFourDiagonalUpRight(row: number, column: number): boolean {
   	if(row > 2 || column > 3) {
   		return false;
   	}
   	let tempGameBoard = Array.from(this.gameBoard);
   	for(let i = 1; i < 4; i++) {
   		const startingPiece = tempGameBoard[row][column];
   		const connectingPiece = tempGameBoard[row + i][column + i];
   		if(!startingPiece || !connectingPiece || startingPiece !== connectingPiece) {
   			return false;
   		}
   	}
   	return true;
   }

   private checkForConnectFourDiagonalDownRight(row: number, column: number): boolean {
   	if(row > 2 || column < 3) {
   		return false;
   	}
   	let tempGameBoard = Array.from(this.gameBoard);
   	for(let i = 1; i < 4; i++) {
   		const startingPiece = tempGameBoard[row][column];
   		const connectingPiece = tempGameBoard[row + i][column - i];
   		if(!startingPiece || !connectingPiece || startingPiece !== connectingPiece) {
   			return false;
   		}
   	}
   	return true;
   }

   private checkForConnectFourHorizontalRight(row: number, column: number): boolean {
   	if(column > 3) {
   		return false;
   	}
   	let tempGameBoard = Array.from(this.gameBoard);
   	for(let i = 1; i < 4; i++) {
   		const startingPiece = tempGameBoard[row][column];
   		const connectingPiece = tempGameBoard[row][column + i];
   		if(!startingPiece || !connectingPiece || startingPiece !== connectingPiece) {
   			return false;
   		}
   	}
   	return true;
   }

   private updateGameBoard(): void {
   	for(let i = 0; i < 7; i++) {
   		for(let j = 0; j < 6; j++) {
   			if(this.gameColumns[i][j]){
   				this.gameBoard[j][i] = this.gameColumns[i][j];
   			}
   			else {
   				this.gameBoard[j][i] = "";
   			}
   		}
   	}
   }

   private gameBoardFull(): boolean {
   	for(let i = 0; i < 6; i++) {
   		for(let j = 0; j < 7; j++) {
   			if(this.gameBoard[i][j] === "") {
   				return false;
   			}
   		}
   	}
   	return true;
   }
}
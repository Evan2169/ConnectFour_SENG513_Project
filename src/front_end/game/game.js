'use strict';

$(() => {
	const DOMAIN = "localhost:8080"; 
	const HTTP_DOMAIN = "http://" + DOMAIN;
	const WS_PATH = "ws://" + DOMAIN + "/connection"; 

	// Setup theme
	if(getStoredTheme() === "") {
		changeTheme("sky");
	}
	else {
		changeTheme(getStoredTheme());
	}
	$("input[name='theme']").change(() => {
		const theme = $("input[name='theme']:checked").val();
		if(theme !== getStoredTheme()) {
			changeTheme(theme);
		}
	});
	function changeTheme(theme) {
		switch(theme) {
			case "sky":
				$("#sky").prop("checked", true);
				$("body").css("background-color", "#b7d7e8");
				$("#game_area").css("background-color", "#87bdd8");
				$("th").css("background-color", "#b7d7e8");
				$(".column_selector").css("background-color", "#daebe8");
				$("td").css("border-color", "#cfe0e8");
				break;
			case "forest":
				$("#forest").prop("checked", true);
				$("body").css("background-color", "#405d27");
				$("#game_area").css("background-color", "#82b74b");
				$("th").css("background-color", "#405d27");
				$(".column_selector").css("background-color", "#3e4444");
				$("td").css("border-color", "#c1946a");
				break;
			case "earth":
				$("#earth").prop("checked", true);
				$("body").css("background-color", "#8b6f47");
				$("#game_area").css("background-color", "#bbab9b");
				$("th").css("background-color", "#8b6f47");
				$(".column_selector").css("background-color", "#d4ac6e");
				$("td").css("border-color", "#4f3222");
				break;
		}
		document.cookie = "theme=" + theme + "; path=/";
	}
	function getStoredTheme() {
		return document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	}

	// Setup username
	function getStoredUsername() {
		return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	}

	// Open socket and report ready to play
	const socket = new WebSocket(WS_PATH);
	let gameId = null;
	socket.onopen = () => {
		$.get(HTTP_DOMAIN + "/game/gameIdForUsername/" + getStoredUsername(), (response) => {
			gameId = response.gameId;
			const readyToPlayRequest = {
				type: "ready_to_play",
				gameId: gameId,
				username: getStoredUsername()
			};
			socket.send(JSON.stringify(readyToPlayRequest));
		});
	};

	// Setup game logic
	let currentTurn = "";
	let gameOver = false;
	socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			switch(response.type) {
				case "game_setup_failed":
					$("#turn_text").text("Something went wrong. Please start a new game.");
					socket.close();
					break;
				case "turn":
					currentTurn = response.turn;
					if(!gameOver) {
						if(currentTurn === getStoredUsername()) {
							$("#turn_text").text("It's your turn! Please make a move.");
						}
						else {
							$("#turn_text").text("It's " + currentTurn + "'s turn. Please be patient.");
						}
					}
					break;
				case "board_changed":
					updateBoard(response.board);
					if(response.winner !== "") {
						gameOver = true;
						if(response.winner === getStoredUsername()) {
							$("#turn_text").text("Game over. Congrats on the win " + response.winner + "!");
						}
						else if(response.winner === "draw") {
							$("#turn_text").text("Game over. It came down to a draw.");
						}
						else {
							$("#turn_text").text("Game over. Better luck next time " + getStoredUsername() + "!");
						}
					}
					break;
				case "illegal_move":
					window.alert(response.message);
					break;
			}
		};

	// Register callbacks for column buttons.
	for(const column of 
		["column_zero", "column_one", "column_two", "column_three", "column_four", "column_five", "column_six"]) {
			$("#" + column).click(() => {
				if(gameOver) {
					window.alert("Game over. Please join another game if you would like to play again.");
				}
				else if(!isLocalPlayersTurn()) {
					window.alert("Please be patient, " + currentTurn + " is making their move");
				}
				else {
					socket.send(JSON.stringify({
						type: "move",
						gameId: gameId,
						username: getStoredUsername(),
						move: column
					}));
				}
			});
	}

	function isLocalPlayersTurn() {
		return currentTurn === getStoredUsername();
	}

	function updateBoard(board) {
		for(let i = 0; i < 6; i++) {
			for(let j = 0; j < 7; j++) {
				if(board[i] && board[i][j] && board[i][j] !== "") {
					if(board[i][j] === getStoredUsername()) {
						$("#row_"+i+"_col_"+j).css("background-color", "darkblue");
					}
					else {
						$("#row_"+i+"_col_"+j).css("background-color", "red");
					}
				}
				else {
					$("#row_"+i+"_col_"+j).css("background-color", "white");
				}
			}
		}
	}
});
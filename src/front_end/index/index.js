'use strict';

$(() => {
	const DOMAIN = "localhost:8080"; 
	const HTTP_DOMAIN = "http://" + DOMAIN;
	const WS_PATH = "ws://" + DOMAIN + "/connection"; 

	// Disable carousel from automatically changing
	$(".carousel").carousel('pause');

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
				$("#menu").css("background-color", "#87bdd8");
				$(".carousel-inner button").css("background-color", "#b7d7e8");
				break;
			case "forest":
				$("#forest").prop("checked", true);
				$("body").css("background-color", "#405d27");
				$("#menu").css("background-color", "#82b74b");
				$(".carousel-inner button").css("background-color", "#3e4444");
				break;
			case "earth":
				$("#earth").prop("checked", true);
				$("body").css("background-color", "#8b6f47");
				$("#menu").css("background-color", "#bbab9b");
				$(".carousel-inner button").css("background-color", "#4f3222");
				break;
		}
		document.cookie = "theme=" + theme + "; path=/";
	}
	function getStoredTheme() {
		return document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	}

	// Setup username
	changeUsername(getStoredUsername());
	$("#username_button").click(() => {
		$('#username_input').val(getStoredUsername());
	});
	$("#save_username_button").click(() => {
		changeUsername($('#username_input').val());
	});
	function changeUsername(username) {
		if(username === "") {
			$.get(HTTP_DOMAIN + "/username/generate", (response) => {
				$("#username").text(response.username);
				document.cookie = 'username=' + response.username;
			});
		}
		else {
			$("#username").text(username);
			document.cookie = "username=" + username + "; path=/";
		}
	}
	function getStoredUsername() {
		return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	}

	// Setup game creation
	$("#create_game_button").click(() => {
		const socket = new WebSocket(WS_PATH);

		socket.onopen = () => {
			const newGameRequest = {
				type: "request_new_game"
			};
  			socket.send(JSON.stringify(newGameRequest));
		};

		let gameId = "";
		socket.onmessage = (event) => {
  			const response = JSON.parse(event.data);
  			switch(response.type) {
  				case "game_created":
  					gameId = response.gameId;
  					$("#game_id").text(gameId);
  					break;
  				case "game_ready":
  					const requestParameters = {
  						gameId: gameId,
  						username: getStoredUsername()
  					}
  					socket.close();
  					window.location = HTTP_DOMAIN + "/game/" + JSON.stringify(requestParameters);
  					break;
  			}
		};

		$('#game_creation_modal').on('hidden.bs.modal', () => {
			const cancelGameRequest = {
				type: "cancel_game",
				gameId: gameId
			};
			socket.send(JSON.stringify(cancelGameRequest));
			socket.close();
		});
	});

	// Setup joining game
	$("#join_game_button").click(() => {
		const socket = new WebSocket(WS_PATH);
		
		socket.onopen = () => {
			const joinGameRequest = {
				type: "join_game",
				gameId: $("#join_game_id_entry").val()
			};
			socket.send(JSON.stringify(joinGameRequest));
		}

		socket.onmessage = (event) => {
  			const response = JSON.parse(event.data);
  			switch(response.type) {
  				case "join_success":
  					const requestParameters = {
  						gameId: response.gameId,
  						username: getStoredUsername()
  					}
  					socket.close();
  					window.location = HTTP_DOMAIN + "/game/" + JSON.stringify(requestParameters);
  					break;
  				case "join_fail":
  					window.alert("Could not join game with provided game ID.")
  					break;
  			}
  			socket.close();
		};
	});

	// Setup joining random game
	$("#join_random_game_button").click(() => {
	const socket = new WebSocket(WS_PATH);

	socket.onopen = () => {
		const joinRandomRequest = {
			type: "join_random"
		};
			socket.send(JSON.stringify(joinRandomRequest));
	};

	socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			switch(response.type) {
				case "random_join_success":
					const requestParameters = {
						gameId: response.gameId,
						username: getStoredUsername()
					}
					socket.close();
					window.location = HTTP_DOMAIN + "/game/" + JSON.stringify(requestParameters);
					break;
			}
		};

		$('#join_random_modal').on('hidden.bs.modal', () => {
			const cancelRandomJoin = {
				type: "cancel_random_join"
			};
			socket.send(JSON.stringify(cancelRandomJoin));
			socket.close();
		});
	});
});
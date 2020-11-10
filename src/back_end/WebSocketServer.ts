import * as WebSocket from 'ws';
import * as http from 'http';

import { GameInitializer } from './GameInitializer';
import { GameMapper } from './GameMapper';


export class WebSocketServer extends WebSocket.Server {
	private gameInitializer: GameInitializer;
	private gameMapper: GameMapper;

	constructor(httpServer: http.Server, gameInitializer: GameInitializer, gameMapper: GameMapper) {
		super({server: httpServer, path: "/connection"});
		this.gameInitializer = gameInitializer;
		this.gameMapper = gameMapper;
		this.setupRoutingForSocketServer();
	}

	private setupRoutingForSocketServer(): void {
		super.on('connection', (socket: WebSocket) => {
	   	socket.on('message', (data: string) => {
      		const message = JSON.parse(data);
      		switch (message.type) {
      			case "request_new_game":
      				this.gameInitializer.addNewGame(socket);
      				break;
      			case "cancel_game":
      				this.gameInitializer.removeGame(Number(message.gameId));
      				break;
      			case "join_game":
      				this.gameInitializer.joinGame(socket, Number(message.gameId));
      				break;
      			case "join_random":
      				this.gameInitializer.joinRandomGame(socket);
      				break;
      			case "cancel_random_join":
      				this.gameInitializer.cancelRandomJoin();
      				break;
      			case "ready_to_play":
      				this.gameMapper.addPlayerToGame(message.username, Number(message.gameId), socket);
      				break;
      			case "move":
      				this.gameMapper.makeMoveInGame(message.username, Number(message.gameId), message.move, socket)
      		}
    		});
		});
	}
}
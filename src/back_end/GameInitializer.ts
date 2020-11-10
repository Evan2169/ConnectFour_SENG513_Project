import * as WebSocket from 'ws';

import { GameMapper } from './GameMapper';

export class GameInitializer {
	private gameIdAndWaitingSocketPairs: Map<number, WebSocket>;
	private gameIdAndSocketWaitingForRandomGame: [number | null, WebSocket | null];
	private currentGameId: number;
	private gameMapper: GameMapper;

	constructor(gameMapper: GameMapper) {
		this.gameIdAndWaitingSocketPairs = new Map<number, WebSocket>();
		this.currentGameId = 1000;
		this.gameIdAndSocketWaitingForRandomGame = [null, null];
		this.gameMapper = gameMapper;
	}

	public addNewGame(socket: WebSocket): void {
		const gameId: number = this.generateGameId();
		this.gameIdAndWaitingSocketPairs.set(gameId, socket);
		socket.send(JSON.stringify({
			type: "game_created",
			gameId: gameId
		}));
	}

	public removeGame(gameId: number): void {
		this.gameIdAndWaitingSocketPairs.delete(gameId);
	}

	public joinGame(socket: WebSocket, gameId: number): void {
		if(this.gameIdAndWaitingSocketPairs.has(gameId)) {
			const waitingSocket: WebSocket | undefined = this.gameIdAndWaitingSocketPairs.get(gameId);
			if(waitingSocket) {
			 	waitingSocket.send(JSON.stringify({
			 		type: "game_ready",
			 		gameId: gameId
			 	}));
			 	socket.send(JSON.stringify({
			 		type: "join_success",
			 		gameId: gameId
			 	}));
				this.gameIdAndWaitingSocketPairs.delete(gameId);
				this.gameMapper.addGameForId(gameId);
			}
		}
		else {
			socket.send(JSON.stringify({
				type: "join_fail"
			}));
		}
	}

	public joinRandomGame(socket: WebSocket): void {
		if(this.gameIdAndSocketWaitingForRandomGame[0] && this.gameIdAndSocketWaitingForRandomGame[1]) {
			const random_join_success = {
				type: "random_join_success",
				gameId: this.gameIdAndSocketWaitingForRandomGame[0]
			};
			this.gameIdAndSocketWaitingForRandomGame[1].send(JSON.stringify(random_join_success));
			socket.send(JSON.stringify(random_join_success));
			this.gameMapper.addGameForId(this.gameIdAndSocketWaitingForRandomGame[0]);
			this.gameIdAndSocketWaitingForRandomGame = [null, null];
		}
		else {
			this.gameIdAndSocketWaitingForRandomGame = [this.generateGameId(), socket];
		}
	}

	public cancelRandomJoin(): void {
		this.gameIdAndSocketWaitingForRandomGame = [null, null];
	}

	private generateGameId(): number {
		return this.currentGameId++;
	}
}
import * as WebSocket from 'ws';

import { ConnectFourGame } from './ConnectFourGame';

export class GameMapper {
    private idsAndGames: Map<number, ConnectFourGame>;
    private usernamesAndGames: Map<string, number>;
    private usernnamesAndSockets: Map<string, WebSocket>;

    constructor() {
        this.idsAndGames = new Map<number, ConnectFourGame>();
        this.usernamesAndGames = new Map<string, number>();
        this.usernnamesAndSockets = new Map<string, WebSocket>();
    }

    public addGameForId(gameId: number): void {
        this.idsAndGames.set(gameId, new ConnectFourGame());
    }

    public associateUsernameWithGameId(username: string, gameId: number): boolean {
        if(this.idsAndGames.has(gameId)) {
            const game: ConnectFourGame | undefined = this.idsAndGames.get(gameId);
            if(game) {
                this.usernamesAndGames.set(username, gameId);
                return true;
            }
        }
        return false;
    }

    public gameIdForUsername(username: string): number | undefined {
        return this.usernamesAndGames.get(username);
    }

    public addPlayerToGame(username: string, gameId: number, socket: WebSocket): void {
        let game: ConnectFourGame | undefined = this.idsAndGames.get(gameId);
        if(game && game.addPlayer(username)) {
            this.usernnamesAndSockets.set(username, socket);
            if(game.gameSetupComplete()) {
                this.sendMessageToBothPlayersOfGame(gameId, 
                    JSON.stringify({
                        type: "turn",
                        turn: game.currentPlayerTurn()
                    })
                );
            }
        }
        else {
            socket.send(JSON.stringify({
                type: "game_setup_failed"
            }))
        }
    }

    public makeMoveInGame(username: string, gameId: number, move: string, socket: WebSocket): void {
        const game: ConnectFourGame | undefined = this.idsAndGames.get(gameId);
        if(game) {
            const result: [boolean, string] = game.makeMove(username, move);
            if(!result[0]) {
                socket.send(JSON.stringify({
                    type: "illegal_move",
                    message: result[1]
                }));
            }
            else {
                this.sendMessageToBothPlayersOfGame(gameId, JSON.stringify({
                    type: "board_changed",
                    board: game.gameBoard,
                    winner: game.winner()
                }))
                this.sendMessageToBothPlayersOfGame(gameId, JSON.stringify({
                    type: "turn",
                    turn: game.currentPlayerTurn()
                }))
            }
        }
    }

    private sendMessageToBothPlayersOfGame(gameId: number, message: string): void {
        const game: ConnectFourGame | undefined = this.idsAndGames.get(gameId);
        if(game) {
            for(const username of [game.playerOneUsername, game.playerTwoUsername]) {
                const socket: WebSocket | undefined = this.usernnamesAndSockets.get(username);
                if(socket) {
                    socket.send(message);
                }
            }
        }
    }
}
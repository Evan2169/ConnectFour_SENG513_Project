import { Controller, Get } from '@overnightjs/core';
import { OK, BAD_REQUEST } from 'http-status-codes';
import { Request, Response } from 'express';
import * as path from 'path';

import { GameMapper } from './GameMapper';

@Controller('game')
export class GameController {
    private gameMapper: GameMapper;

    constructor(gameMapper: GameMapper) {
        this.gameMapper = gameMapper;
    }

    @Get(':gameIdAndUsername')
    private returnGameHtml(request: Request, response: Response): any {
        const gameIdAndUsername = JSON.parse(request.params.gameIdAndUsername);
        if(this.gameMapper.associateUsernameWithGameId(gameIdAndUsername.username, Number(gameIdAndUsername.gameId))) {
            const gameHtmlPath: string = "src/front_end/game/game.html"; 
            response.sendFile(path.resolve(gameHtmlPath));
        }
        else {
            return response.status(BAD_REQUEST).json({
            error: "User isn't registered to play game."
        });
        }
    }

    @Get('files/game.css')
    private returnGameCss(request: Request, response: Response): void {
        const gameCssPath: string = "src/front_end/game/game.css"; 
        response.sendFile(path.resolve(gameCssPath));
    }

    @Get('files/game.js')
    private returnGameJavascript(request: Request, response: Response): void {
        const gameJavascriptPath: string = "src/front_end/game/game.js"; 
        response.sendFile(path.resolve(gameJavascriptPath));
    }

    @Get('gameIdForUsername/:username')
    private returnGameIdForUsername(request: Request, response: Response): any {
        let gameId: number | undefined = this.gameMapper.gameIdForUsername(request.params.username);
        if(gameId) {
            return response.status(OK).json({
                gameId: gameId
            });
        }
        return response.status(BAD_REQUEST).json({
            error: "User isn't registered to play game."
        });
    }
}
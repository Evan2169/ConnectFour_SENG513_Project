import { OK } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import axios  from 'axios';

@Controller('username')
export class UsernameController {
    @Get('generate')
    private returnRandomUsername(request: Request, response: Response) {
        axios.get('https://wunameaas.herokuapp.com/wuami/' + Math.random(), { headers: {'Accept': 'application/json'}})
            .then((r: any) => {
                const generatedUsername: string = r.data.message;
                return response.status(OK).json({
                    username: generatedUsername,
                });
            });
    }
}
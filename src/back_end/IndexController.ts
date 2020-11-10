import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import * as path from 'path';

@Controller('')
export class IndexController {
    @Get('')
    private returnIndexHtml(request: Request, response: Response): void {
        const indexHtmlPath: string = "src/front_end/index/index.html"; 
        response.sendFile(path.resolve(indexHtmlPath));
    }

    @Get('index.css')
    private returnIndexCss(request: Request, response: Response): void {
        const indexCssPath: string = "src/front_end/index/index.css";
        response.sendFile(path.resolve(indexCssPath));
    }

    @Get('index.js')
    private returnIndexJavascript(request: Request, response: Response): void {
        const indexJavascriptPath: string = "src/front_end/index/index.js";
        response.sendFile(path.resolve(indexJavascriptPath));
    }
}
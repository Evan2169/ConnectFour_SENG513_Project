import * as path from 'path';
import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import * as http from 'http';

import { GameController } from './GameController';
import { IndexController } from './IndexController';
import { UsernameController } from './UsernameController';

export class ApplicationServer extends Server {
   constructor(
   	gameController: GameController,
   	indexController: IndexController,
   	usernameController: UsernameController)
   {
      super(false);
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({extended: true}));
      super.addControllers([indexController, gameController, usernameController]);
   }

   public start(port: number): http.Server {
       return this.app.listen(port, () => {
           console.log("Running server on port " + port);
       });
   }
}
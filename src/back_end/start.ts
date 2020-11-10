import { ApplicationServer } from './ApplicationServer';
import { GameController } from './GameController';
import { GameInitializer } from './GameInitializer';
import { GameMapper } from './GameMapper';
import { IndexController } from './IndexController';
import { UsernameController } from './UsernameController';
import { WebSocketServer } from './WebSocketServer';

// Construct game logic
let gameMapper = new GameMapper();
let gameInitializer = new GameInitializer(gameMapper);

// Construct controllers
const gameController = new GameController(gameMapper);
const indexController = new IndexController();
const usernameController = new UsernameController();

// Construct servers
const applicationServer = new ApplicationServer(gameController, indexController, usernameController);
const websocketServer = new WebSocketServer(applicationServer.start(8080), gameInitializer, gameMapper);

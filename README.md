RUNNING THE SERVER
Navigate to the top-level directory of the project.
$cd $PATH/ConnectFour
Install dependencies needed for running typescript (I believe only ts-node is necessary).
$npm install ts-node tslint typescript nodemon
Run the following command to start the server
$ npm start

VIEWING IN THE BROWSER
My project is hardcoded to run on localhost:8080. To change this, adjustments would need to be made in "src/back_end/start.ts", "src/front_end/game/game.js", and "src/front_end/index/index.js".

NOTE
- All other dependencies should be installed automatically. I tried to get ts-node to not need extra installation steps, but couldn't get it working.
- Opening my project in multiple windows/tabs of the same browser will break it. If it is run in different browsers or on different machines, it will work dandy.
- Code got a little sloppy with the last bit of functionality that I was working on. "ConnectFourGame.ts" and "GameMapper.ts" are unnecessarily coupled and a little tough to read.

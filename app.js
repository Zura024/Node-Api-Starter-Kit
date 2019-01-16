let express = require('express');
let app = express();
const config = require('./config');
let BaseModule = require('./modules');
require('./db');
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
let http = require('http');
app.set('port', port);

let server = http.createServer(app);
let io = require('socket.io')(server);

// Initialize all available modules
const modules = BaseModule.init(app);
let SocketIo = require('./socket/SocketIo');
const mySocketIo = new SocketIo(io);

const jwt = require('./middleware/jwt');

let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/error-handler');
const bodyParser = require('body-parser');

//Implementing middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
  origin: config.allowReferrers,
  optionsSuccessStatus: 200
}));

// Use JWT auth to secure the api
app.use(jwt());

//Register routes
BaseModule.initRouters();

// Catching errors
app.use(errorHandler);

server.listen(port, function () {
  console.log('Server listening on port ' + port);
});

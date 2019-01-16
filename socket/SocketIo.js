const socketIOJwt = require('socketio-jwt');
const config = require('../config/config');
const Connection = require('./Connection');


class SocketIo {
  constructor(io) {
    this.io = io;
    this.connections = new Map();

    this.io.sockets
      .on('connection', socketIOJwt.authorize({
        secret: config.secret,
        timeout: 15000
      }))
      .on('authenticated', this.onAuthenticated.bind(this));

  }

  onAuthenticated(socket) {
    const userId = socket.decoded_token.sub;
    let mySocket = this.connections.get(userId);
    if (mySocket) {
      mySocket.setIoSocket(socket);
    } else {
      mySocket = new Connection(socket, userId);
      this.connections.set(userId, mySocket);
    }
  }

}

module.exports = SocketIo;






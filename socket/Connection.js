const {Generator} = require('qa-screenshot-comparator');
const path = require('path');
const stringHelper = require('./../helpers/stringHelper');
const models = require('../db/models');
const ConnectionData = require('./ConnectionData');
const companyId = 1;

class Connection {

  constructor(socket, userId) {
    this.socket = null;
    this.userId = userId;
    /**
     * @type {ConnectionData}
     */
    this.data = new ConnectionData();
    this.setIoSocket(socket);

    //Initial function to be triggered
    this.sendInitData();

    //Event listeners from client side
    this.onDisconnect();
  }

  setIoSocket(socket) {
    this.socket = socket;
    this.initSocketListeners();
  }

  initSocketListeners() {
    this.socket.on('disconnect', function () {
      console.log('User was disconnected');
    });
    this.socket.on('init', function () {
      this.socket.emit('init', JSON.stringify(this.data));
    });
  }

  onDisconnect() {

  }

}

module.exports = Connection;

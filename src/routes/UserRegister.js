const Express = require('express');
const server = Express();
const userController = require('../controller/UserController');
console.log('1');

server.post('/register', userController.register);

module.exports = server;
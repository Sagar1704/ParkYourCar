var express = require('express');
var router = express.Router();

//Models
var user = require('./models/user');

user.methods(['get', 'post', 'put', 'delete']);

user.register(router, '/users');

module.exports = router;
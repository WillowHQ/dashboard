'use strict';

var user = require('../../controllers/user.info.controller.js');

module.exports = function (app) {
  app.post('/api/phonenumber/create/:id', user.createPhoneNumber);
}

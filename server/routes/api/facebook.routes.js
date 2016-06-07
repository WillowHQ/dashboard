'use strict'
var facebook = require('../../controllers/api/facebook.controller.js');

module.exports = function(app) {
	app.get('/api/facebook/webhook', facebook.webhook);
	app.post('/api/facebook/webhook', facebook.echo);
	app.post('/api/facebook/send', facebook.send);
	app.get('/api/facebook/recieve', facebook.recieve);
	app.get('/api/facebook/getprofile/:user_id/:access_token', facebook.getProfile);
  app.post('/api/facebook/email/', facebook.sendEmail);


}

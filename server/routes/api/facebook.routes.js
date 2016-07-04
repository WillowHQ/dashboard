'use strict'
var facebook = require('../../controllers/api/facebook.controller.js');

module.exports = function(app) {
  // Temporary, for testing messenger
  app.get('/facebook/receive', function (req, res) {
    if (req.query['hub.verify_token'] === 'FISHTACOS') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
  });
  app.post('/facebook/receive', function (req, res) {
    console.log(req.body);
    console.log('User id: ' + req.body.entry[0].messaging[0].sender.id);
  });
	app.get('/api/facebook/webhook', facebook.webhook);
	app.post('/api/facebook/webhook', facebook.echo);
	app.post('/api/facebook/send', facebook.send);
	app.get('/api/facebook/recieve', facebook.recieve);
	app.get('/api/facebook/getprofile/:user_id/:access_token', facebook.getProfile);
  app.post('/api/facebook/email/', facebook.sendEmail);
  app.get('/api/facebook/connect', facebook.connectUser);
  app.get('/api/facebook/getclientprofile', facebook.getClientProfile);
}

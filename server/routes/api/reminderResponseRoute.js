 'use strict';

var reminderResponse = require('../../controllers/api/reminderResponseController.js');
var reminder = require('../../controllers/api/reminderController.js');

//responses are dumb objects that are created inside of a reminder


//let's change these to start with a reminder object


module.exports = function(app) {
  app.post('/api/reminderResponse', reminderResponse.create);
  app.get('/api/reminderResponse', reminderResponse.list);
  app.post('/api/reminderResponse/:id', reminder.addResponse);
  app.post('/api/reminderResponse/remove/:id', reminderResponse.delete);

  app.post('/api/reminder/receive', reminder.receiveResponse);

  app.get('/api/reminder/response/list', reminderResponse.list);
  // When Reminder is initially sent out by the bot
  app.post('/api/reminder/response/create', reminderResponse.create);
  // When there is a genuine response
  app.post('/api/reminder/response/respond/:id', reminderResponse.respond);
  app.post('/api/reminder/response/remove/:id', reminderResponse.delete);

}

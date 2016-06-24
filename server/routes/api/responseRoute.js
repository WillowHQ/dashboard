var response = require('../../controllers/api/responseController.js');
// var reminder = require('../../controllers/api/reminderController.js');


//let's change these to start with a reminder object


module.exports = function(app) {
  //reminder id
  app.post('/api/response/create', response.create);
  app.get('/api/response/list', response.list);
  //app.post('/api/reminderResponse/:id', reminder.addResponse);
  // app.post('/api/reminderResponse/remove/:id', reminderResponse.delete);
  //
  // //app.post('/api/reminder/receive', reminder.receiveResponse);
  //
  // app.get('/api/reminder/response/list', reminderResponse.list);
  // // When Reminder is initially sent out by the bot
  // app.post('/api/reminder/response/create', reminderResponse.create);
  // // When there is a genuine response
  // app.post('/api/reminder/response/respond/:id', reminderResponse.respond);
  // app.post('/api/reminder/response/remove/:id', reminderResponse.delete);

}

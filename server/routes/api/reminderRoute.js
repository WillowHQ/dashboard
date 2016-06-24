'use strict';

var reminder = require('../../controllers/api/reminderController.js');
var userReminder = require('../../controllers/api/userReminderController.js')

module.exports = function(app) {

  //Reminders by themself
  app.post('/api/reminder/create', reminder.create);
  //app.get('/api/reminder/list', reminder.list);
  //app.get('/api/reminder/now', reminder.listNow);


  //app.post('/api/reminder/update/:id', reminder.update);
  //app.post('/api/reminder/remove/:id', reminder.delete);

  //Reminder in the user
  app.post('/api/user/reminder/add', userReminder.addUserReminder);
}

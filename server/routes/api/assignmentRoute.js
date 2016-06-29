'use strict';

var assignment = require('../../controllers/api/assignmentController.js');

module.exports = function(app) {


  app.post('/api/assignment/create', assignment.create);
  app.get('/api/assignment/list', assignment.list);
  //ok we got the basic call working, now let's get only the surveys and remidners that are for right now

  app.get('/api/assignment/listNow', assignment.listNow);
  
  // app.post('/api/assignment/update/:id', assignment.update);
  // app.post('/api/assignment/remove/:id', assignment.delete);

}

'use strict';

var response = require('../../controllers/api/responseController.js');

module.exports = function(app) {

  app.post('/api/response/create', response.create);
  app.get('/api/response/list', response.list);
  app.get('/api/response/selectedAssignment/:id', response.selectedByAssignment);
  app.post('/api/response/update', response.update);
  app.get('/api/response/delete/:id', response.delete);

  //ok we got the basic call working, now let's get only the surveys and remidners that are for right now

};

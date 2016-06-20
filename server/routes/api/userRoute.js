'use strict';

// Load the module dependencies
var user = require('../../controllers/user.info.controller.js');

// Define the routes module' method
module.exports = function(app) {

  app.post('/api/user/create', user.create);
  app.get('/api/users/:id', user.read);

  app.post('/api/users/:id/surveys', user.createSurvey);
  app.get('/api/users/:id/surveys', user.listSurveys);

  app.get('/api/users/:user_id/surveys/:survey_id', user.getSurvey);
  app.put('/api/users/:user_id/surveys/:survey_id', user.updateSurvey);
  app.delete('/api/users/:user_id/surveys/:survey_id', user.removeSurvey);

  app.post('/api/user/delete/:id', user.delete);
  app.post('/api/coach/newuser/:id', user.updateCoach);

  app.post('/api/user/parse-csv', user.parseCSV);

}

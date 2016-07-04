'use strict';

// Load the module dependencies
var survey = require('../../controllers/api/surveyController.js');

// Define the routes module' method
module.exports = function(app) {

  // Creates a new route with the prefix /api/surveys
  var surveysRoute = app.route('/api/surveys');

  surveysRoute.post(survey.create);
  surveysRoute.get(survey.listAll);

  // Creates a new route for an individual survey
  var surveyRoute = app.route('/api/surveys/:survey_id');

  surveyRoute.get(survey.read);
  surveyRoute.put(survey.update);
  surveyRoute.delete(survey.delete);

  /*app.post('/api/survey', survey.create);
  app.get('/api/survey', survey.list);
  app.post('/api/survey/:id', survey.update);
  app.post('/api/survey/remove/:id', survey.delete);
  */
}

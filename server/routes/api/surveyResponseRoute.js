'use strict';

var surveyResponse = require('../../controllers/api/surveyResponseController.js');

module.exports = function (app) {

  // Creates a new route with the prefix /api/surveyresponses
  var surveyResponsesRoute = app.route('/api/surveyresponses');

  surveyResponsesRoute.post(surveyResponse.create);
  surveyResponsesRoute.get(surveyResponse.listAll);

  // Creates a new route for an individual survey response
  var surveyResponseRoute = app.route('/api/surveyresponses/:response_id');

  surveyResponseRoute.get(surveyResponse.read);
  surveyResponseRoute.put(surveyResponse.update);
  surveyResponseRoute.delete(surveyResponse.delete);

};

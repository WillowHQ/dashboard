'use strict';

var surveyQuestion = require('../../controllers/api/surveyQuestionController.js');

module.exports = function (app) {

  // Creates a new route with the prefix /api/surveyquestions
  var surveyQuestionsRoute = app.route('/api/surveyquestions');

  surveyQuestionsRoute.post(surveyQuestion.create);
  surveyQuestionsRoute.get(surveyQuestion.listAll);

  // Creates a new route for an individual survey question
  var surveyQuestionRoute = app.route('/api/surveyquestions/:question_id');

  surveyQuestionRoute.get(surveyQuestion.read);
  surveyQuestionRoute.put(surveyQuestion.update);
  surveyQuestionRoute.delete(surveyQuestion.delete);

};

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var surveyQuestionSchema = new Schema({
  question: {type: String},
  questionHeader: {type: String},
  type: {type: String},
  // response: {type: mongoose.Schema.Types.Object, ref: 'SurveyResponse'}
});

var SurveyQuestion = mongoose.model('SurveyQuestion', surveyQuestionSchema);

module.exports = SurveyQuestion;

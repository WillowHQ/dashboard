'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var surveyResponseSchema = require('./surveyResponse').surveyResponseSchema;

var surveyQuestionSchema = new Schema({
  question: {type: String, required: true},
  header: {type: String, required: true},
  type: {type: String, enum: ['WRITTEN', 'SCALE', 'YESNO'], required: true},
  responses: [surveyResponseSchema]//{type: mongoose.Schema.Types.Object, ref: 'SurveyResponse'}]
});

//var SurveyQuestion = mongoose.model('SurveyQuestion', surveyQuestionSchema);

module.exports = {
  //SurveyQuestion: SurveyQuestion,
  surveyQuestionSchema: surveyQuestionSchema
}

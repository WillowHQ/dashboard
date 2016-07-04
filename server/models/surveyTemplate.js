'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var surveyQuestionSchema = require('./surveyQuestion.js').surveyQuestionSchema;

var surveyTemplateSchema =  new Schema({

  title: {type: String, required: true},
  questions:[
  {
    type: {
      type: String,
      enum: ['WRITTEN', 'SCALE', 'YESNO'],
      default: 'WRITTEN'
    },
    header: String,
    question:String
  }],
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

});

var SurveyTemplate = mongoose.model('SurveyTemplate',surveyTemplateSchema);
module.exports = SurveyTemplate;

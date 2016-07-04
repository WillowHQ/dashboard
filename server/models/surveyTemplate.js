'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var surveyQuestionSchema = require('./surveyQuestion.js').surveyQuestionSchema;

var surveyTemplateSchema =  new Schema({
  title: {type: String, required: true},
  questions: [

    {
      question:{type: String, required: true},
      header: {type: String, required: true},
      type: {
        type: String,
        enum: ['YESNO', 'SCALE', 'WRITTEN'],
      }
     },
  ],
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  selectedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  daysOfTheWeek: {
    monday: {type: Boolean},
    tuesday: {type: Boolean},
    wednesday: {type: Boolean},
    thursday: {type: Boolean},
    friday: {type: Boolean},
    saturday: {type: Boolean},
    sunday: {type: Boolean}
  },
  repeat: Boolean,
  timeOfDay: {type: Date, default: Date.now},
  days: [{type: Number, min: 0, max: 6}],
  hour: {type: Number, min: 0, max: 23},
  minute: {type: Number, min: 0, max: 59}
});

var SurveyTemplate = mongoose.model('SurveyTemplate',surveyTemplateSchema);
module.exports = SurveyTemplate;

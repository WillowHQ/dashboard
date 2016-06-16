'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var surveyResponseSchema = new Schema({
  response: {type: String, required: true},
  timeStamp: {type: Date, default: Date.now}
});

var SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

module.exports = SurveyResponse;

//from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

'use strict';
//not used
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user.js');




var assignmentSchema = new Schema({

  repeat: {type: Boolean},
  type: {
    type: String,
    enum: ['reminder', 'survey'],
    default: 'reminder'},

  days: [{type: Number, min: 0, max: 6}],
  hour: {type: Number, min: 0, max: 23},
  minute: {type: Number, min:0, max:59},

  //client not coach
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

  userId: {type: mongoose.Schema.Types.Object, ref: 'User'},

  surveyTemplateId: {type: mongoose.Schema.Types.Object, ref: 'SurveyTemplate'},

  reminderId: {type: mongoose.Schema.Types.Object, ref: 'Reminder'}

});

var Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js');
var moment = require('moment');

var surveyTemplateSchema =  new Schema({
  //title: {type: String, required: true},
  title: {type: String, required: true},
  questions: Array,
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

var surveyTemplate = mongoose.model('surveyTemplate',surveyTemplateSchema);
module.exports = surveyTemplate;

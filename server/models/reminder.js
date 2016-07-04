'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var moment = require('moment');
var User = require('./user.js');
var Assignment = require('./assignment.js');
var Response = require('./response.js');



var reminderSchema = new Schema({
  //Client
  assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  // Who the reminder is coming from
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

  //Text
  body: String,

  //Time of the reminder
  assignment : {type: mongoose.Schema.Types.Object, ref:'Assignment'},

  //What we get back
  responses : [{type: mongoose.Schema.Types.Object, ref:'Response' }]

})

var Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;

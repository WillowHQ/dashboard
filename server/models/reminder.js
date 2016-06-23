var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user.js');
var moment = require('moment');

var reminderSchema = new Schema({
  assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  // Who the reminder is coming from
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

  body: String,

})

var Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;

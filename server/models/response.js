'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Reminder = require('/.reminder.js');

var responseSchema = new Schema({

  response: {type: String},
  createdBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  responded:{type:Boolean, default:'false'},
  timeStamp: {type: Date, default: Date.now}
  reminder: {type: mongoose.Schena.Types.Object, ref: 'Reminder'}
});


// // Update User with most recent response and update thier status
// reminderResponseSchema.post('findOneAndUpdate', function() {
//   console.log(this);
//   // Find User, set response as most recent, then update status
//
//   // Update Status
// });

var response = mongoose.model('response', responseSchema);

module.exports = response;

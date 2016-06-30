'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Reminder = require('./reminder.js');
//not used

//response schema is super dumb and doesn't figure out status by itself -
//might not be a bad idea to make a status model actually



var responseSchema = new Schema({

// // Update User with most recent response and update thier status
// reminderResponseSchema.post('findOneAndUpdate', function() {
//   console.log(this);
//   // Find User, set response as most recent, then update status
//
//   // Update Status
// });

var response = mongoose.model('response', responseSchema);

  type: {
    type: String,
    enum: ['reminder', 'survey'],
    default: 'reminder'},



  //TODO get populate to work
  timeStamp: {type: Date, default: Date.now},
  assignment: {type: mongoose.Schema.Types.Object, ref: 'Assignment'},
  userId: {type: mongoose.Schema.Types.Object, ref: 'User'},

  surveyTemplateId: {type: mongoose.Schema.Types.Object, ref: 'SurveyTemplate'},

  //questions create a local copy of questions asked, in case survey template gets dropped or changed

  questions: [

    {
      question:{type: String, required: true},
      header: {type: String, required: true},
      type: {
        type: String,
        enum: ['YESNO', 'SCALE', 'WRITTEN'],
      },
      answer: {type: String, default: "something is broke"}
     },
  ],
  reminderId: {type: mongoose.Schema.Types.Object, ref: 'Reminder'}

});

var Response = mongoose.model('Response', responseSchema);

module.exports = Response;

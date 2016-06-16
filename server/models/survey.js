'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SurveyTemplateSchema = require('./surveyTemplate.js');

var surveySchema = new Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  selectedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  body: {type: mongoose.Schema.Types.ObjectId, ref: 'SurveyTemplate', required: true},
  daysOfTheWeek: {
    monday: {type: Boolean, default: false},
    tuesday: {type: Boolean, default: false},
    wednesday: {type: Boolean, default: false},
    thursday: {type: Boolean, default: false},
    friday: {type: Boolean, default: false},
    saturday: {type: Boolean, default: false},
    sunday: {type: Boolean, default: false}
  },
  repeat: {type: Boolean, default: false},
  timeOfDay: {type: Date, default: Date.now},
  days: [{type: Number, min: 0, max: 6}],
  hours: {type: Number, min: 0, max: 23},
  minute: {type: Number, min: 0, max: 59}
});

// A survey is a reminder if it contains only one question
surveySchema.methods.isReminder = function () {
  return this.content.questions.length === 1;
};

var Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;

/*  assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
start: { type: Date, default: Date.now },
status: {
type: String,
enum: ['red', 'yellow', 'green'],
default: 'green'
},
goals: [
{
goal: {type: String},
reminder: {type: mongoose.Schema.Types.ObjectId, ref: 'Reminder'}
}
]
})

surveySchema.pre('remove', function(next) {
var ids = [];
var User = this.model('User');
var self = this;
// Get user model that the survey is assigned too
User.findOne({_id: this.assignee}, function(err, user) {
// Remove Survey Ref
var index = user.surveys.indexOf(this._id);
user.surveys.splice(index, 1);
// Remove Reminder Refs
for(var i = 0; i < self.goals.length; i++) {
index = user.reminders.indexOf(self.goals.reminder);
user.reminders.splice(index, 1);
}
// Save with removed refs
user.save(function(err) {
if(!err){
// Flash message?
}
});
})
// Remove reminders from mongo
for (var i = 0; i < self.goals.length; i++) {
Reminder.remove({_id: self.goals[i].reminder._id}).exec();
}
next();
});
*/
